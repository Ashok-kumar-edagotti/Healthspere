const express = require('express');
const router = express.Router();
const { 
    getSanitationRecords, 
    getSanitationRecordById, 
    addSanitationRecord, 
    updateSanitationRecord, 
    deleteSanitationRecord 
} = require('../controllers/sanitationController');
const { protect, healthWorker, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSanitationRecords)
    .post(protect, healthWorker, addSanitationRecord); // Health worker only

router.route('/:id')
    .get(protect, getSanitationRecordById)
    .put(protect, healthWorker, updateSanitationRecord) // Health worker only
    .delete(protect, admin, deleteSanitationRecord); // Admin only

module.exports = router;