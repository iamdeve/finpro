const express = require('express');
const router = express.Router();
const stripeSubControler = require('../controllers/stripe-subscription');

router.post('/subscription', stripeSubControler.subscription);

module.exports = router;
