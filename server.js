const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "https://*.myabsorb.com",
    "https://studybuddy.justinsuranceco.com",
    "https://chiddy23.github.io"
  ],
  credentials: false
}));

const openai = new OpenAI({ 
  apiKey: "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"
});

const PORT = process.env.PORT || 3000;

app.post("/tutor/answer", async (req, res) => {
  try {
    const question = (req.body?.question ?? "").toString().slice(0, 4000);
    if (!question) return res.status(400).json({ error: "Missing question" });

    const system = "You are JustInsurance's friendly study buddy. Keep answers concise, educational, and avoid legal/financial advice.";
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: question }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const answer = completion.choices[0]?.message?.content || "Sorry, I couldn't generate an answer.";
    res.json({ answer });
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

app.listen(PORT, () => console.log(`Study Buddy running on :${PORT}`));
