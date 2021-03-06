const mongoose = require('mongoose');
const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

global.fetch = require('node-fetch');
global.navigator = () => null;
// console.log(process.env);
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
	UserPoolId: process.env.pool_id,
	ClientId: process.env.app_client_id,
};
const pool_region = process.env.pool_region;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.signupWithCognito = (req, res, next) => {

	const email = req.body.email;
	const pass = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;

	const attributeList = [];
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }));
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'name', Value: firstName }));
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'family_name', Value: lastName }));
	userPool.signUp(email, pass, attributeList, null, function (err, result) {
		if (err) {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		}
		var cognitoUser = result.user;
		console.log(cognitoUser);
		res.status(201).json({
			message: 'sign up successful',
			token: cognitoUser,
		});
	});
};

module.exports.loginWithCognito = (req, res, next) => {
	const email = req.body.email;
	const pass = req.body.password;

	const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
		Username: email,
		Password: pass,
	});
	const userData = {
		Username: email,
		Pool: userPool,
	};
	const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			const accesstoken = result.getAccessToken().getJwtToken();
			return res.status(201).json({
				token: accesstoken,
			});
		},
		onFailure: function (err) {
			return res.status(500).json({
				message: err,
			});
		},
	});
};

module.exports.signupWithEmail = (req, res, next) => {
	const email = req.body.email;
	const pass = req.body.password;
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
								const token = await jwt.sign({ id, email, password, firstName, lastName }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' });
								res.status(201).json({
									message: 'sign up successful',
									token: token,
								});
							})
							.catch((err) => {
								console.log(`last final error ${err}`);
								res.status(500).json({
									error: err,
								});
							});
					}
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

module.exports.loginWithEmail = (req, res, next) => {
	const email = req.body.email;
	const pass = req.body.password;
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
