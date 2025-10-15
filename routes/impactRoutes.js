const express = require('express');
const router = express.Router();
const { 
    getImpactFeedback, 
    getImpactFeedbackById, 
    addImpactFeedback, 
    updateImpactFeedback, 
    deleteImpactFeedback 
} = require('../controllers/impactController');
const { protect, admin } = require('../middleware/authMiddleware'); // No healthWorker check needed for POST/PUT here

router.route('/')
    .get(protect, getImpactFeedback)
    .post(protect, addImpactFeedback); // User or health_worker (protect is enough)

router.route('/:id')
    .get(protect, getImpactFeedbackById)
    .put(protect, updateImpactFeedback) // User/self only (logic handled in controller/needs better database design)
    .delete(protect, admin, deleteImpactFeedback); // Admin only

module.exports = router;