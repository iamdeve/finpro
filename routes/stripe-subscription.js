const express = require('express');
const router = express.Router();
const stripeSubControler = require('../controllers/stripe-subscription');
const auth = require('../middleware/auth');

router.post('/subscription', auth.Validate, stripeSubControler.subscription);
router.post('/cancel', auth.Validate, stripeSubControler.cancel);
router.get('/invoices', auth.Validate,stripeSubControler.invoices )
module.exports = router;
