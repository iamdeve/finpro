const express = require('express');
const router = express.Router();
const inputController = require('../controllers/inputs');
const auth = require('../middleware/auth');

router.get('/userInputs', auth.Validate, inputController.userInputs);
router.post('/addInputs', [auth.Validate, inputController.addInputValidation], inputController.addInputs);
router.post('/deleteInputs', [auth.Validate, inputController.deleteInputValidation], inputController.deleteInputs);
router.put('/updateInputs', [auth.Validate, inputController.updateInputValidation], inputController.updateInputs);
router.post('/addInputExpense', [auth.Validate, inputController.addExpenseValidation], inputController.addExpense);
router.post('/deleteInputExpense', [auth.Validate, inputController.deleteExpenseValidation], inputController.deleteExpense);
router.put('/updateInputExpense', [auth.Validate, inputController.updateExpenseValidation], inputController.updateExpense);

module.exports = router;
