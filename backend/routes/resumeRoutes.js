const express = require("express");
const ai = require("../config/gemini");

const router = express.Router();

function buildPrompt(section, input) {
  if (section === "summary") {
    const { skills = [], experienceLevel = "fresher", extraContext = "" } = input;
    return `Write a concise, professional resume summary (2-4 sentences, plain text, no markdown) for a ${experienceLevel} candidate.
Key skills: ${skills.join(", ") || "not specified"}.
${extraContext ? `Additional context from the student: ${extraContext}` : ""}
Rules:
- Do NOT invent companies, numbers, or achievements not mentioned above.
- Avoid buzzword clichés like "results-driven synergy".
- Return ONLY the summary text.`;
  }

  if (section === "project") {
    const { projectName = "", technologies = "", roughDescription = "" } = input;
    return `Rewrite these rough project notes into a polished, resume-ready description (2-3 short lines, plain text, no markdown).
Project name: ${projectName}
Technologies: ${technologies}
Student's rough notes: ${roughDescription}
Rules:
- Only use facts present in the rough notes; do not invent features or outcomes.
- Return ONLY the description text.`;
  }

  if (section === "experience") {
    const { role = "", company = "", roughDescription = "" } = input;
    return `Rewrite these rough notes into a polished, resume-ready work experience description (2-3 short bullet lines, one per line, plain text, start each with a strong action verb).
Role: ${role}
Company: ${company}
Student's rough notes: ${roughDescription}
Rules:
- Only use facts present in the rough notes; do not invent metrics or responsibilities.
- Return ONLY the bullet lines.`;
  }

  throw new Error("Unknown section");
}

router.post("/generate-text", async (req, res) => {
  try {
    const { section, input } = req.body;

    if (!section || !["summary", "project", "experience"].includes(section)) {
      return res.status(400).json({ message: "Invalid or missing 'section'" });
    }

    const prompt = buildPrompt(section, input || {});

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text || !text.trim()) {
      return res.status(502).json({ message: "AI did not return a response. Please try again." });
    }

    res.status(200).json({ text: text.trim() });
  } catch (error) {
    console.log("RESUME AI GENERATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;