const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { SpeechClient } = require("@google-cloud/speech");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });
const client = new SpeechClient(); // Uses GCP default credentials

app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
  try {
    const file = fs.readFileSync(req.file.path);
    const audioBytes = file.toString("base64");

    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const request = {
      audio,
      config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join("\n");

    res.json({ text: transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
