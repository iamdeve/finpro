const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const MONOGO_URI = process.env.MONGOD_URI || 'mongodb://localhost:27017/finpro';
const cors = require('cors');
const AuthMiddleWare = require('./middleware/auth');
mongoose.connect(MONOGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cors());

const route = '/api';
app.use('/profiles', express.static('profiles'));
console.log(__dirname + '/' + 'profiles');
app.use(express.static(path.join(__dirname, '/', 'profiles')));
const authRoute = require('./routes/auth');
app.use(`${route}/auth`, authRoute);

const revenuRoute = require('./routes/revenue');
app.use(`${route}/revenue`, revenuRoute);

const inputsRoute = require('./routes/inputs');
app.use(`${route}/inputs`, inputsRoute);

const paymentRoute = require('./routes/payment-method');
app.use(`${route}/payment`, paymentRoute);

const purchasingRoute = require('./routes/purchasing');
app.use(`${route}/purchasing`, purchasingRoute);

const stripePyament = require('./routes/stripe-subscription');
app.use(`${route}`, stripePyament);

app.use('/test', AuthMiddleWare.Validate, (req, res, next) => {
	res.status(200).json({
		message: 'test',
	});
});

app.use('/test2', (req, res, next) => {
	res.status(200).json({
		message: 'test',
	});
});

app.use((req, res, next) => {
	const error = new Error('not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
