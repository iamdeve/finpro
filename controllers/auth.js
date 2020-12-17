const mongoose = require('mongoose');
const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.signupWithEmail = (req, res, next) => {
	const email = req.body.email;
	const pass = req.body.pass;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;

	var hashP;
	Auth.findOne({ email: email })
		.exec()
		.then(async (result) => {
			if (result && result.email != '') {
				console.log('already');
				return res.status(500).json({
					message: 'email already registered',
				});
			} else {
				await bcrypt.hash(pass, saltRounds, function (err, hash) {
					if (err) {
						console.log(err);
						return res.status(500).json({
							error: err,
						});
					} else {
						hashP = hash;
						console.log(hashP);
						const auth = new Auth({
							_id: mongoose.Types.ObjectId(),
							email: email,
							password: hashP,
							firstName: firstName,
							lastName: lastName,
						});
						auth.save()
							.then(async (result) => {
								const id = result._id;
								const email = result.email;
								const password = result.password;
								const firstName = result.firstName;
								const lastName = result.lastName;
								const token = await jwt.sign({ id, email, password, roleId, firstName, lastName, isAdmin, isSuperAdmin, route, country }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' });
								res.status(201).json({
									message: 'sign up successful',
									token: token,
								});
							})
							.catch((err) => {
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

module.exports.loginWithEmail = (req, res, next) => {
	const email = req.body.email;
	const pass = req.body.pass;
	console.log(pass);
	Auth.findOne({ email: email })
		.then(async (result) => {
			if (result) {
				console.log(result);
				await bcrypt.compare(pass, result.password, async function (err, newResult) {
					if (err) {
						return res.status(501).json({
							error: err,
						});
					} else {
						const id = result._id;
						const email = result.email;
						const password = result.password;
						const firstName = result.firstName;
						const lastName = result.lastName;

						// console.log(newResult);
						if (newResult) {
							const token = jwt.sign({ id, email, password, firstName, lastName }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' });
							// console.log(role);
							return res.status(201).json({
								token: token,
							});
						} else {
							return res.status(500).json({
								message: 'invalid Password',
							});
						}
					}
				});
			} else {
				return res.status(500).json({
					message: 'invalid email',
				});
			}
		})
		.catch((err) => {
			res.status(502).json({
				error: err,
			});
		});
};