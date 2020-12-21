const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signupWithCognito);
router.post('/login', authController.loginWithCognito);

module.exports = router;
