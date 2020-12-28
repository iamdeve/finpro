const express = require('express');
const router = express.Router();
const paymentMethod = require('../controllers/payment-method');
const auth = require('../middleware/auth');

router.get('/userPayment', auth.Validate, paymentMethod.addMethod);
router.post('/add', [auth.Validate, paymentMethod.addValidation], paymentMethod.addMethod);
router.delete('/delete/:id', auth.Validate, paymentMethod.delete);
router.put('/update/:id', auth.Validate, paymentMethod.update);
router.put('/status/:id', auth.Validate, paymentMethod.status);
router.put('/type/:id', auth.Validate, paymentMethod.type);

module.exports = router;
