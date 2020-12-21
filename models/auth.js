const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	firstName: {
		type: String,
	},

	lastName: {
		type: String,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Auth', authSchema);
