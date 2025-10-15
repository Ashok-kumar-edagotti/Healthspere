// const db = require('../config/db'); // Assume this is imported

// @desc    GET Get all impact feedback
// @route   GET /api/impact
// @access  Private
exports.getImpactFeedback = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM impact_assessment ORDER BY participant_id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching impact feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET Get feedback by participant
// @route   GET /api/impact/:id
// @access  Private
exports.getImpactFeedbackById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM impact_assessment WHERE participant_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching impact feedback by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    POST Add feedback (user or health_worker)
// @route   POST /api/impact
// @access  Private
exports.addImpactFeedback = async (req, res) => {
    const { participant_name, hygiene_habit_changes, awareness_before_percent, awareness_after_percent, comments } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO impact_assessment (participant_name, hygiene_habit_changes, awareness_before_percent, awareness_after_percent, comments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [participant_name, hygiene_habit_changes, awareness_before_percent, awareness_after_percent, comments]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding impact feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    PUT Update feedback (user/self only)
// @route   PUT /api/impact/:id
// @access  Private
exports.updateImpactFeedback = async (req, res) => {
    const { id } = req.params; // Feedback ID (participant_id from table)
    const { awareness_after_percent } = req.body;
    // NOTE: Self-update logic (user/self only) is complex here as impact_assessment table
    // doesn't link to `users`. For this example, I'll assume only the original submitter
    // (identified by a user_id stored *during POST* but not in the schema) can update,
    // or simply allow anyone *authenticated* to update *if* they match a criteria (like a health worker).
    // Given the API spec says "user/self only", and we don't have a user_id foreign key,
    // I'll proceed with a simple update by ID for now, but a real-world scenario needs a foreign key.
    
    try {
        const result = await db.query(
            'UPDATE impact_assessment SET awareness_after_percent = $1 WHERE participant_id = $2 RETURNING *',
            [awareness_after_percent, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating impact feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    DELETE Delete feedback (admin only)
// @route   DELETE /api/impact/:id
// @access  Private/Admin
exports.deleteImpactFeedback = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM impact_assessment WHERE participant_id = $1 RETURNING participant_id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting impact feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
};