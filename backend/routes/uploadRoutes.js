require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
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

router.post(
  "/upload",
  upload.single("pdf"),
  async (req, res) => {

    try {

      console.log("FILE RECEIVED:", req.file);

      if (!req.file) {

        return res.status(400).json({
          message: "No file received from frontend",
        });

      }

      const dataBuffer = fs.readFileSync(req.file.path);

      const pdfData = await pdfParse(dataBuffer);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Summarize this study material in simple points:\n\n${pdfData.text}`,
      });
      
      const summary = response.text;



      res.status(200).json({
        summary,
      });

    } catch (error) {

      console.log("FULL ERROR:");
      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

module.exports = router;