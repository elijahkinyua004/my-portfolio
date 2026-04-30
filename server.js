require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.OWNER_WHATSAPP;

let client = null;
if (accountSid && authToken && accountSid.startsWith('AC') && !accountSid.includes('your_')) {
  client = twilio(accountSid, authToken);
} else {
  console.warn('Warning: Twilio credentials not properly configured. WhatsApp sending will not work.');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  if (!client) {
    return res.status(500).json({ success: false, error: 'WhatsApp service not configured.' });
  }

  const whatsappMessage = `New portfolio contact suggestion:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

  try {
    const result = await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body: whatsappMessage
    });

    return res.json({ success: true, sid: result.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send WhatsApp message.' });
  }
});

app.get('/', (req, res) => {
  res.send('Portfolio backend is running.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
