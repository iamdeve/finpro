const mongoose = require('mongoose');
const Revenue = require('../models/revenue');
const { check, validationResult } = require('express-validator');

module.exports.revenueInputValidator = [
	check('plan', 'Plan field Should not empty').not().isEmpty(),
	check('price', 'Price field Should not empty').not().isEmpty(),
	check('purchasers', 'Purchasers field Should not empty').not().isEmpty(),
	check('type', 'Type field Should not empty').not().isEmpty(),
];

module.exports.userRevenu = (req, res, next) => {
	const userCogId = req.user.payload.client_id;

	Revenue.find({ userId: userCogId })
		.exec()
		.then(async (result) => {
			return res.status(200).json({ allRevenus: result });
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.revenueInput = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { plan, price, purchasers, type, date } = req.body;
	const userCogId = req.user.payload.client_id;
	Revenue.findOne({ userId: userCogId })
		.exec()
		.then(async (result) => {
			if (result && result.userId != '') {
				console.log('revenu exist');
				result.revenuInputs.push({
					_id: mongoose.Types.ObjectId(),
					plan,
					price,
					purchasers,
					type,
					date,
				});
				await result.save();
				return res.status(200).json({
					message: 'Revenue added successfully',
				});
			} else {
				const revenue = new Revenue({
					_id: mongoose.Types.ObjectId(),
					userId: userCogId,
					revenuInputs: [
						{
							_id: mongoose.Types.ObjectId(),
							plan,
							price,
							purchasers,
							type,
							date,
						},
					],
				});
				revenue
					.save()
					.then(() => {
						console.log('revenue save');
						res.status(500).json({ message: 'Revenue added successfully' });
					})
					.catch((err) => {
						console.log(`last final error ${err}`);
						res.status(500).json({
							error: err,
						});
					});
			}
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.deleteRevenueInputValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('revenueInputId', 'Revenue input id field Should not empty').not().isEmpty()];

module.exports.deleteRevenueInput = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, revenueInputId } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.revenuInputs = result.revenuInputs.filter((rev) => rev.id !== revenueInputId);
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Revenue deleted successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.updateRevenueInputValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('revenueInputId', 'Revenue input id field Should not empty').not().isEmpty(), check('data', 'Please send at least one field').not().isEmpty()];

module.exports.updateRevenue = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, revenueInputId, data } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.revenuInputs = result.revenuInputs.map((rev) => {
				if (rev.id === revenueInputId) {
					return {
						...rev.toObject(),
						...data,
					};
				} else {
					return rev;
				}
			});
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Revenue updated successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.addExpenseValidation = [
	check('revenueId', 'Revenue id field Should not empty').not().isEmpty(),
	check('heading', 'heading name Should not empty').not().isEmpty(),
	check('value', 'value name Should not empty').not().isEmpty(),
	check('cost', 'Cost input id field Should not empty').not().isEmpty(),
];

module.exports.addExpense = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, heading, cost, value } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.majorExpenseInput.push({
				_id: mongoose.Types.ObjectId(),
				heading,
				value,
				cost,
			});

			console.log(result.majorExpenseInput);
			result.markModified('majorExpenseInput');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Expense added successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.deleteExpenseValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('majorExpenseInputId', 'Expense input id field Should not empty').not().isEmpty()];

module.exports.deleteExpense = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, majorExpenseInputId } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.majorExpenseInput = result.majorExpenseInput.filter((rev) => rev.id !== majorExpenseInputId);
			// console.log(result.majorExpenseInput[index])
			result.markModified('majorExpenseInput');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Expense deleted successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};
module.exports.updateExpenseValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('expenseInputId', 'Expense Id name Should not empty').not().isEmpty(), check('data', 'data should not be empty').not().isEmpty()];

module.exports.updateExpense = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, expenseInputId, data } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.majorExpenseInput = result.majorExpenseInput.map((rev) => {
				if (rev.id === expenseInputId) {
					return {
						...rev.toObject(),
						...data,
					};
				} else {
					return rev;
				}
			});

			result.markModified('majorExpenseInput');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Expense updated successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.addStartingCapitalValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('source', 'Source name Should not empty').not().isEmpty(), check('amount', 'Amount name Should not empty').not().isEmpty()];
module.exports.addStartingCapital = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, source, amount } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.startingCapital.push({
				_id: mongoose.Types.ObjectId(),
				source,
				amount,
			});
			result.markModified('startingCapital');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Starting Capital added successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.deleteStartingCapitalValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('startingCapitalId', 'Starting Capital input id field Should not empty').not().isEmpty()];

module.exports.deleteStartingCapital = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, startingCapitalId } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.startingCapital = result.startingCapital.filter((rev) => rev.id !== startingCapitalId);
			console.log(result.startingCapital);
			result.markModified('startingCapital');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Starting Capital deleted successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.updateStartCapitalValidation = [check('revenueId', 'Revenue id field Should not empty').not().isEmpty(), check('startingCapitalId', 'Starting Capital Id name Should not empty').not().isEmpty(), check('data', 'data should not be empty').not().isEmpty()];

module.exports.updateStartingCapital = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { revenueId, startingCapitalId, data } = req.body;

	Revenue.findOne({ _id: revenueId })
		.exec()
		.then(async (result) => {
			result.startingCapital = result.startingCapital.map((rev) => {
				if (rev.id === startingCapitalId) {
					return {
						...rev.toObject(),
						...data,
					};
				} else {
					return rev;
				}
			});

			result.markModified('startingCapital');
			result
				.save()
				.then(() => {
					res.status(200).json({
						message: 'Starting Capital updated successfully',
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			res.status(500).json({
				error: err,
			});
		});
};
