require("dotenv").config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});

const upload = multer({ dest: 'uploads/' });

app.post('/api/generate', upload.single('file'), async (req, res) => {
    try {
        const { address, propertyType, buyerConcerns, reductionAmount, agentNotes } = req.body;
        let fileContent = '';

        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);
            fileContent = pdfData.text;
        } else {
            fileContent = fs.readFileSync(req.file.path, 'utf8');
        }

        const prompt = `Survey: ${fileContent}
        
        Buyer Concerns: ${buyerConcerns}
        Requested Reduction: ${reductionAmount}
        Agent Notes: ${agentNotes}
        
        Please generate a summary of key property issues from the survey. Then, based on the buyer's concerns and requested reduction, provide tailored advice for both the buyer and the seller. Include persuasive arguments, estimated costs for each issue, and negotiation guidance.`;


        const response = await axios.post(
            'http://localhost:11434/api/generate',
            { model: 'llama3', prompt },
            { responseType: 'stream' }
        );
        console.log(response);
        let fullResponse = '';

        response.data.on('data', chunk => {
            const lines = chunk.toString().split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.response) {
                        fullResponse += parsed.response;
                    }
                } catch (err) {
                    console.error('JSON parse error:', err.message);
                }
            }
        });

        response.data.on('end', () => {
            res.json({ result: fullResponse });
        });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Something went wrong while contacting Ollama.' });
    }
});
