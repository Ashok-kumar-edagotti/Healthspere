// const db = require('../config/db'); // Assume this is imported

// @desc    GET Get all surveys
// @route   GET /api/surveys
// @access  Private
exports.getSurveys = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM village_health_survey ORDER BY household_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET Get survey by household_id
// @route   GET /api/surveys/:id
// @access  Private
exports.getSurveyById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM village_health_survey WHERE household_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching survey by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    POST Add new survey (health_worker only)
// @route   POST /api/surveys
// @access  Private/HealthWorker
exports.addSurvey = async (req, res) => {
    const { 
        household_id, family_members, common_illnesses, 
        source_of_water, sanitation_type, hygiene_rating 
    } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO village_health_survey (household_id, family_members, common_illnesses, source_of_water, sanitation_type, hygiene_rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [household_id, family_members, common_illnesses, source_of_water, sanitation_type, hygiene_rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding survey:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    PUT Update survey (health_worker only)
// @route   PUT /api/surveys/:id
// @access  Private/HealthWorker
exports.updateSurvey = async (req, res) => {
    const { id } = req.params;
    const { family_members, hygiene_rating } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE village_health_survey SET family_members = $1, hygiene_rating = $2 WHERE household_id = $3 RETURNING *',
            [family_members, hygiene_rating, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating survey:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    DELETE Delete survey (admin only)
// @route   DELETE /api/surveys/:id
// @access  Private/Admin
exports.deleteSurvey = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM village_health_survey WHERE household_id = $1 RETURNING household_id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
        console.error('Error deleting survey:', error);
        res.status(500).json({ message: 'Server error' });
    }
};