// const db = require('../config/db'); // Assume this is imported

// @desc    GET Get all awareness sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM awareness_sessions ORDER BY session_id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET Get one session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSessionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM awareness_sessions WHERE session_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching session by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    POST Add session (health_worker only)
// @route   POST /api/sessions
// @access  Private/HealthWorker
exports.addSession = async (req, res) => {
    const { age_group, number_of_participants, topics_covered, feedback_rating } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO awareness_sessions (age_group, number_of_participants, topics_covered, feedback_rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [age_group, number_of_participants, topics_covered, feedback_rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding session:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    PUT Update session info (health_worker only)
// @route   PUT /api/sessions/:id
// @access  Private/HealthWorker
exports.updateSession = async (req, res) => {
    const { id } = req.params;
    const { number_of_participants, feedback_rating } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE awareness_sessions SET number_of_participants = $1, feedback_rating = $2 WHERE session_id = $3 RETURNING *',
            [number_of_participants, feedback_rating, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    DELETE Delete session (admin only)
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
exports.deleteSession = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM awareness_sessions WHERE session_id = $1 RETURNING session_id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Server error' });
    }
};