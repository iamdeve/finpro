const mongoose = require('mongoose');
const purchasingSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	planId: {
		type: String,
		require: true,
	},
	purchaseDate: {
		type: String,
		required: true,
	}
});

module.exports = mongoose.model('Purchasing', purchasingSchema);
