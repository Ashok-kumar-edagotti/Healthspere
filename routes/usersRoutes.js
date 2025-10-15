const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile, 
    getUserById 
} = require('../controllers/usersController');
const { protect, admin, selfOnly } = require('../middleware/authMiddleware'); // Assume these middleware exist

// Routes for the logged-in user's profile and self-management
router.route('/auth/profile').get(protect, getUserProfile); 
router.route('/:id').put(protect, updateUserProfile); // Self-update
router.route('/:id').get(protect, admin, getUserById); // Admin only to GET any user

module.exports = router;
