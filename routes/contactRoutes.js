const express = require('express');
const router = express.Router();
const contactController = require('../controllers/Contact');

router.post('/submit', contactController.saveContact);

module.exports = router;
