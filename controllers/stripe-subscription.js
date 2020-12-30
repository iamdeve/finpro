const Stripe = require('stripe');
const Purchasing = require('../models/purchasing');
const PaymentMethod = require('../models/payment-method');
const stripe = Stripe('sk_test_51HQQAWL2QqDUeeFIZZbvXrcmZMVNnXXwEZeZZ8NV7ng8XRQjj3yoYPjbUmDRIc5Khe685lSoBR6pZaP1ajaU05w500YStSumf9');
const mongoose = require('mongoose');
module.exports.subscription = (req, res, next) => {
	const userCogId = req.user.payload.email;
	PaymentMethod.findOne({ userId: userCogId, status: 'active', type: 'default' })
		.exec()
		.then(async (result) => {
			stripe.customers.create(
				{
					payment_method: result.paymentMethod.id,
					email: userCogId,
				},
				function (err, customer) {
					if (err) {
						console.log('here');
						console.log(err);
						return res.status(400).json({ error: err, message: 'Something wrong' });
					}

					console.log(customer);
					const { id } = customer;
					stripe.subscriptions.create(
						{
							default_payment_method: result.paymentMethod.id,
							customer: id,
							items: [{ price: 'price_1I1ErgL2QqDUeeFI8WjeHVri' }],
						},
						function (err, userSubscription) {
							if (err) {
								return res.status(400).json({ error: err, message: 'Something wrong' });
							}
							console.log(userSubscription);
							const purchse = new Purchasing({
								_id: mongoose.Types.ObjectId(),
								userId: userCogId,
								planName: 'Intro Plan',
								planId: 'price_1I1ErgL2QqDUeeFI8WjeHVri',
								planType: 'purchased',
								status: 'active',
								purchaseDate: new Date(),
								subscriptionDetails: userSubscription,
								customerDetails: customer,
							});
							purchse
								.save()
								.then(() => {
									console.log('purchase save');
									return res.status(200).json({ message: `subscrive successfully` });
								})
								.catch((err) => {
									console.log(`last final error ${err}`);
									return res.status(500).json({
										error: err,
									});
								});
							res.status(200);
							return res.json({ message: 'Subscription added' });
						},
					);
				},
			);
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			return res.status(500).json({
				error: err,
			});
		});
};

module.exports.invoices = async (req, res, next) => {
	const userCogId = req.user.payload.email;

	try {
		const invoices = await stripe.invoices.list({
			limit: 10,
		});
		// console.log(invoices.data);
		let userInvoices = invoices.data.filter((d) => d.customer_email === userCogId);
		return res.status(200).json({ userInvoices });
	} catch (err) {
		console.log(`final error ${err}`);
		return res.status(500).json({
			error: err,
		});
	}
};

module.exports.cancel = async (req, res, next) => {
	const userCogId = req.user.payload.email;
	Purchasing.findOneAndDelete({ userId: userCogId })
		.then(async (result) => {
			try {
				const deleted = await stripe.subscriptions.del(result.subscriptionDetails.id);
				console.log(deleted)
				if (deleted) {
					return res.json({ message: 'Subscription canceled successfully' });
				}
			} catch (err) {
				console.log(`final error ${err}`);
				return res.status(500).json({
					error: err,
				});
			}
		})
		.catch((err) => {
			console.log(`final error ${err}`);
			return res.status(500).json({
				error: err,
			});
		});
};
