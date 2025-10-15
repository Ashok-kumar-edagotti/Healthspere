const express = require('express');
const router = express.Router();
const { 
    getSessions, 
    getSessionById, 
    addSession, 
    updateSession, 
    deleteSession 
} = require('../controllers/sessionsController');
const { protect, healthWorker, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSessions)
    .post(protect, healthWorker, addSession); // Health worker only

router.route('/:id')
    .get(protect, getSessionById)
    .put(protect, healthWorker, updateSession) // Health worker only
    .delete(protect, admin, deleteSession); // Admin only

module.exports = router;