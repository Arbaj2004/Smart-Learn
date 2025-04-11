const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.isAdmin);

router.get('/all-faculty', adminController.getAllFaculty);
router.get('/stats', adminController.getStats);
router.get('/unapproved-faculty', adminController.getUnapprovedFaculty);
router.post('/approve-faculty/:facultyId', adminController.approveFaculty);
router.delete('/delete-faculty/:facultyId', adminController.deleteFaculty);


module.exports = router;