const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const MONOGO_URI = process.env.MONGOD_URI || 'mongodb://localhost:27017/finpro';
const cors = require('cors');
const AuthMiddleWare = require('./middleware/auth');
mongoose.connect(MONOGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use('/', express.static('profiles'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cors());

const route = '/api';
// app.use('/images',express.static('images'));
const authRoute = require('./routes/auth');
app.use(`${route}/auth`, authRoute);

const revenuRoute = require('./routes/revenue');
app.use(`${route}/revenue`, revenuRoute);

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
