const express = require('express');
const router = express.Router();
const purchasingController = require('../controllers/purchasing');
const auth = require('../middleware/auth');

router.get('/userPurchasing', auth.Validate, purchasingController.userPurchasing);
router.post('/addPurchasing', [auth.Validate, purchasingController.addPurchasingValidation], purchasingController.addPurchasing);

module.exports = router;
