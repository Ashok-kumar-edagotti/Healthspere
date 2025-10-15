const express = require('express');
const router = express.Router();
const { 
    getSurveys, 
    getSurveyById, 
    addSurvey, 
    updateSurvey, 
    deleteSurvey 
} = require('../controllers/surveyController');
const { protect, healthWorker, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSurveys) // All authenticated can view
    .post(protect, healthWorker, addSurvey); // Health worker only

router.route('/:id')
    .get(protect, getSurveyById) // All authenticated can view
    .put(protect, healthWorker, updateSurvey) // Health worker only
    .delete(protect, admin, deleteSurvey); // Admin only

module.exports = router;