const express = require('express');
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const multer = require("multer");
const Admin = require('../models/Admin')
const router = express.Router();

router.post('/verifySignupEmailOTP', authController.verifyOtp);
router.post('/signin', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/me', authController.protect, authController.getUserData);

const upload = multer({ dest: "uploads/" }); // Stores uploaded files in "uploads" folder
// router.use(authController.protect);
router.post("/importStudents", authController.protect, authController.isAdmin, upload.single("file"), authController.importStudents);

router.patch('/updateProfile', authController.protect, userController.updateUser);
// router.get('/me', authController.getUserData);

module.exports = router;