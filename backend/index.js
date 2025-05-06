const config = require('dotenv').config(); // ✅ Add this line first
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});

const upload = multer({ dest: 'uploads/' });
app.use(cors());


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate', upload.single('file'), async (req, res) => {
    const { address, propertyType, buyerConcerns, reductionAmount, agentNotes } = req.body;
    const fileContent = fs.readFileSync(req.file.path, 'utf8'); // optional: parse PDF

    const prompt = `Survey: ${fileContent}\nBuyer: ${buyerConcerns}\nRequest: ${reductionAmount}\nAgent notes: ${agentNotes}`;
    const completion = await openai.chat.completions.create({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] });

    res.json({ result: completion.choices[0].message.content });
});
