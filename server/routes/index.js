
const express = require("express");
const router = express.Router();

const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');
const userRoutes = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

const { sendEmail } = require('../controllers/mailController');


// Mount routers
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.post('/send-email', sendEmail);


module.exports = router;
