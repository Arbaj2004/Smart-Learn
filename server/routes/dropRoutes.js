const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/dropController"); // Ensure correct import

const router = express.Router();

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

        const response = await uploadFile(req.file);
        if (!response) return res.status(500).json({ error: "File upload failed!" });

        res.status(200).json({ message: "File uploaded successfully!", response });

    } catch (error) {
        console.error("🚨 Error in file upload:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
