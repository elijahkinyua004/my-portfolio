const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.OWNER_WHATSAPP;

let client = null;
if (accountSid && authToken && accountSid.startsWith('AC') && !accountSid.includes('your_')) {
  client = twilio(accountSid, authToken);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  if (!client) {
    return res.status(500).json({ success: false, error: 'WhatsApp service not configured.' });
  }

  const whatsappMessage = `New portfolio contact:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

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
};
