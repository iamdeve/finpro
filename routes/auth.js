const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './profiles/');
	},
	filename: function (req, file, cb) {
		// cb(null, new Date().toISOString()+file.originalname)
		cb(null, new mongoose.Types.ObjectId() + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
		console.log('if');
		cb(null, true);
	} else {
		console.log('else');
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});
router.get('/user', auth.Validate, authController.user);
router.post('/signup', authController.signupWithCognito);
router.post('/login', authController.loginWithCognito);
router.patch('/setting', auth.Validate, authController.userSetting);
router.post('/profile', [auth.Validate, upload.single('image')], authController.profilePicture);
module.exports = router;
