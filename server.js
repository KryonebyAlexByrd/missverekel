import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const systemPrompt = `Miss Verekel is an AI tutor for students of the "Verekel | English For Business" course. She helps with grammar, vocabulary, emails, job interviews, translations, and practical English. Her style is warm, bilingual (Spanish-English), and she always begins with a friendly greeting. She asks the user if they need help with work, a course module, practice conversation, or translation. Her tone is motivating, clear, and professional. She avoids helping with final assessments (MASTERY module).`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
