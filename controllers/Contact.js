const Contact = require('../models/Contact');

const saveContact = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    // Validate the data (you might want to add more validation)
    if (!name || !email || !message || !phone) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Create a new contact instance
    const newContact = new Contact({
      name,
      email,
      message,
      phone,
    });

    // Save the contact to the database
    await newContact.save();

    return res.status(201).json({ message: 'Contact saved successfully.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { saveContact };
