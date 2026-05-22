const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file); // 👈 ADD THIS

    if (!req.file) {
      return res.status(400).json({
        message: "No file received from frontend",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    res.status(200).json({
      extractedText: pdfData.text,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      message: "PDF Extraction Failed",
    });
  }
});

module.exports = router;