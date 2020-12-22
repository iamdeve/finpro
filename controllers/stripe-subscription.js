const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HQQAWL2QqDUeeFIZZbvXrcmZMVNnXXwEZeZZ8NV7ng8XRQjj3yoYPjbUmDRIc5Khe685lSoBR6pZaP1ajaU05w500YStSumf9');

module.exports.subscription = (req, res, next) => {
	const token = req.body.token;
	const subscription = req.body.subscribe;

	if (subscription) {
		stripe.customers.create(
			{
				source: token.id,
				email: 'wajdanaeli@gmail.com',
			},
			function (err, customer) {
				if (err) {
					return res.status(400).json({ error: 'Something wrong', err });
				}

				console.log(customer);
				const { id } = customer;
				stripe.subscriptions.create(
					{
						customer: id,
						items: [{ price: 'price_1I1ErgL2QqDUeeFI8WjeHVri' }],
					},
					function (err, userSubscription) {
						if (err) {
							return res.status(400).json({ error: 'Something wrong', err });
						}
						console.log(userSubscription);
						res.status(200);
						res.json({ message: 'Subscription added' });
					},
				);
			},
		);
	} else {
		console.log(token.id, subscription);
		stripe.charges.create(
			{
				amount: 2000,
				currency: 'usd',
				source: token.id, // obtained with Stripe.js
				description: 'My First Test Charge (created for API docs)',
			},
			function (err, charge) {
				if (err) {
					return res.status(400).json({ error: 'Something wrong', err });
				}
				console.log(charge);
				res.status(200);
				res.json({ success: true, message: charge.id });
			},
		);
	}
};
