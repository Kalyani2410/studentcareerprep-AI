require("dotenv").config();

const { GoogleGenAI, Type } = require("@google/genai");
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Keep prompt input within a safe token budget for the model.
// Gemini 3.5 Flash comfortably handles far more, but capping avoids
// runaway cost/latency on huge PDFs while still covering typical
// college study material (roughly ~120k characters).
const MAX_INPUT_CHARS = 120000;

// ---- JSON Schema Gemini must follow ----
const studyNotesSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Short descriptive title for this study material" },
    subject: { type: Type.STRING, description: "Best-guess academic subject, e.g. DBMS, Management, Python" },
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "Name of this topic/subtopic" },
          simple_explanation: { type: Type.STRING, description: "Plain-language explanation a student can quickly understand" },
          key_points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["term", "explanation"],
            },
          },
          definitions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
              required: ["term", "definition"],
            },
          },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
          exam_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["topic", "simple_explanation", "key_points"],
      },
    },
    quick_revision: { type: Type.ARRAY, items: { type: Type.STRING } },
    important_questions: {
      type: Type.OBJECT,
      properties: {
        short_answer: { type: Type.ARRAY, items: { type: Type.STRING } },
        concept_based: { type: Type.ARRAY, items: { type: Type.STRING } },
        application_based: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["short_answer", "concept_based", "application_based"],
    },
  },
  required: ["title", "subject", "topics", "quick_revision", "important_questions"],
};

// ---- Prompt ----
function buildStudyPrompt(sourceText) {
  return `You are an AI study assistant that helps college students prepare for exams.

You will be given raw text extracted from a student's uploaded study material (it may be from any subject: DBMS, Operating Systems, Computer Networks, Java, Python, Management, AI/ML, Software Engineering, Aptitude, or other college subjects).

Your job is to transform this material into structured, exam-oriented study notes — not a generic summary.

Follow these rules strictly:

1. Read and understand the entire material before responding.
2. Break the material into its major topics and subtopics, in the order they logically belong (not necessarily the original order if it improves clarity).
3. For each topic, write a short "simple_explanation" in plain, student-friendly language, while preserving important technical terms.
4. Extract key points as term/explanation pairs — only concepts that genuinely matter, not filler.
5. Extract definitions that are explicitly present or clearly implied in the material.
6. Extract examples ONLY if they exist in the source material. Do not invent new examples.
7. Extract formulas/equations ONLY if they exist in the source material.
8. Identify exam-important points a student is likely to be tested on.
9. Extract relevant keywords per topic.
10. Remove repetition and filler content. Do not just shorten paragraphs — restructure into useful notes.
11. Write a "quick_revision" list: the small set of things most worth remembering right before an exam. This must NOT just repeat the full notes — it should be the highest-value distilled points only.


Critical constraints:
- NEVER invent facts, definitions, examples, or formulas that are not supported by the source text.
- If something is unclear or missing in the source, leave the related array empty rather than guessing.
- Do not pad output with generic filler just to fill every field.
- Keep explanations concise and useful, not verbose.

Respond ONLY with data matching the required JSON schema. Do not include markdown, commentary, or text outside the JSON.

STUDY MATERIAL:
"""
${sourceText}
"""`;
}

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file received from frontend",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text || !pdfData.text.trim()) {
      return res.status(422).json({
        message: "Could not extract any readable text from this PDF",
      });
    }

    let sourceText = pdfData.text;
    let truncated = false;
    if (sourceText.length > MAX_INPUT_CHARS) {
      sourceText = sourceText.slice(0, MAX_INPUT_CHARS);
      truncated = true;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: buildStudyPrompt(sourceText),
      config: {
        responseMimeType: "application/json",
        responseSchema: studyNotesSchema,
      },
    });

    const rawText = response.text;

    if (!rawText || !rawText.trim()) {
      return res.status(502).json({
        message: "AI did not return a response. Please try again.",
      });
    }

    let studyNotes;
    try {
      studyNotes = JSON.parse(rawText);
    } catch (parseError) {
      console.log("JSON PARSE ERROR:", parseError);
      console.log("RAW AI RESPONSE:", rawText);
      return res.status(502).json({
        message: "AI returned an invalid response format. Please try again.",
      });
    }

    res.status(200).json({
      studyNotes,
      truncated, // let the frontend optionally warn "only first part of PDF analyzed"
    });
  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;