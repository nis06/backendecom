const express = require('express');
const router = express.Router();
const { signUp, login } = require('../controllers/Auth');

// Middleware for handling async route functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  const result = await login(req, res);
  res.json(result);
}));

// Signup route
router.post('/signup', asyncHandler(async (req, res) => {
  const result = await signUp(req, res);
  res.json(result);
}));

// Protected route (no specific role check)
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the dashboard',
  });
});

module.exports = router;
