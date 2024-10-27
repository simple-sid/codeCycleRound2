const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store (for demonstration)
let reports = [];
let trustedContacts = [];

// Route to submit an experience report
app.post('/api/report', (req, res) => {
    const { report } = req.body;
    if (report) {
        reports.push(report);
        return res.status(200).json({ message: 'Report submitted successfully.' });
    }
    res.status(400).json({ error: 'Report is required.' });
});

// Route to add a trusted contact
app.post('/api/trusted-contacts', (req, res) => {
    const { name, number } = req.body;
    if (name && number) {
        trustedContacts.push({ name, number });
        return res.status(200).json({ message: 'Contact added successfully.' });
    }
    res.status(400).json({ error: 'Name and number are required.' });
});

// Route to get all trusted contacts
app.get('/api/trusted-contacts', (req, res) => {
    res.status(200).json(trustedContacts);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
