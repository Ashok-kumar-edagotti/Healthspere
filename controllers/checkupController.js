// controllers/checkupController.js
const db = require('../config/db');

// @desc    GET all checkups
// @route   GET /api/checkups
// @access  Protected
exports.getCheckups = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM health_checkup_results ORDER BY participant_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching checkups:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET a checkup by ID
// @route   GET /api/checkups/:id
// @access  Protected
exports.getCheckupById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM health_checkup_results WHERE participant_id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Checkup record not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching checkup by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    ADD a new checkup
// @route   POST /api/checkups
// @access  Protected (Health Worker)
exports.addCheckup = async (req, res) => {
    const { participant_id, gender, age, bmi, blood_pressure, health_issues_found } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO health_checkup_results (participant_id, gender, age, bmi, blood_pressure, health_issues_found) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [participant_id, gender, age, bmi, blood_pressure, health_issues_found]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding checkup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    UPDATE a checkup
// @route   PUT /api/checkups/:id
// @access  Protected (Health Worker)
exports.updateCheckup = async (req, res) => {
    const { id } = req.params;
    const { bmi, health_issues_found } = req.body;

    try {
        const result = await db.query(
            'UPDATE health_checkup_results SET bmi = $1, health_issues_found = $2 WHERE participant_id = $3 RETURNING *',
            [bmi, health_issues_found, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Checkup record not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating checkup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    DELETE a checkup
// @route   DELETE /api/checkups/:id
// @access  Protected (Admin)
exports.deleteCheckup = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            'DELETE FROM health_checkup_results WHERE participant_id = $1 RETURNING participant_id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Checkup record not found' });
        }

        res.json({ message: 'Checkup record deleted successfully' });
    } catch (error) {
        console.error('Error deleting checkup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
