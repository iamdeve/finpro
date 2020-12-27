const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenue');
const auth = require('../middleware/auth');

router.get('/userRevenue', auth.Validate, revenueController.userRevenu);
router.post('/addRevenue', [auth.Validate, revenueController.revenueInputValidator], revenueController.revenueInput);
router.post('/deleteRevenue', [auth.Validate, revenueController.deleteRevenueInputValidation], revenueController.deleteRevenueInput);
router.put('/updateRevenue', [auth.Validate, revenueController.updateRevenueInputValidation], revenueController.updateRevenue);

router.post('/addExpense', [auth.Validate, revenueController.addExpenseValidation], revenueController.addExpense);
router.post('/deleteExpense', [auth.Validate, revenueController.deleteExpenseValidation], revenueController.deleteExpense);
router.put('/updateExpense', [auth.Validate, revenueController.updateExpenseValidation], revenueController.updateExpense);

router.post('/addStartingCapital', [auth.Validate, revenueController.addStartingCapitalValidation], revenueController.addStartingCapital);
router.post('/deleteStartingCapital', [auth.Validate, revenueController.deleteStartingCapitalValidation], revenueController.deleteStartingCapital);
router.put('/updateStartingCapital', [auth.Validate, revenueController.updateStartCapitalValidation], revenueController.updateStartingCapital);
module.exports = router;
