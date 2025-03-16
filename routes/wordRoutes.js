const express = require("express");
const Word = require("../models/Word");

const router = express.Router();

// **Add a new word**
router.post("/", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ message: "Word is required" });

    const existingWord = await Word.findOne({ word: { $regex: `^${word}$`, $options: "i" } });
    if (existingWord) return res.status(400).json({ message: `Word "${existingWord.word}" already exists` });

    const newWord = new Word({ word });
    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// **Get all words**
router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query; // Default: page 1, 20 words per page
  
      const words = await Word.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalWords = await Word.countDocuments();
      
      res.json({
        words,
        totalPages: Math.ceil(totalWords / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  
// **Update a word**
router.patch("/:id", async (req, res) => {
  try {
    const { word } = req.body;
    const wordToUpdate = await Word.findById(req.params.id);
    if (!wordToUpdate) return res.status(404).json({ message: "Word not found" });

    wordToUpdate.word = word;
    await wordToUpdate.save();
    res.json(wordToUpdate);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// **Delete a word**
router.delete("/:id", async (req, res) => {
  try {
    await Word.findByIdAndDelete(req.params.id);
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
