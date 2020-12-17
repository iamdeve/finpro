const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signupWithEmail);
router.post('/login', authController.loginWithEmail);

module.exports = router;
