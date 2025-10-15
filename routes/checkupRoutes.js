// routes/checkupRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getCheckups, 
    getCheckupById, 
    addCheckup, 
    updateCheckup, 
    deleteCheckup 
} = require('../controllers/checkupController');
const { protect, healthWorker, admin } = require('../middleware/authMiddleware');

// GET all checkups
router.get('/', protect, getCheckups);

// POST a new checkup (Health Worker only)
router.post('/', protect, healthWorker, addCheckup);

// GET a checkup by ID
router.get('/:id', protect, getCheckupById);

// UPDATE a checkup by ID (Health Worker only)
router.put('/:id', protect, healthWorker, updateCheckup);

// DELETE a checkup by ID (Admin only)
router.delete('/:id', protect, admin, deleteCheckup);

module.exports = router;
