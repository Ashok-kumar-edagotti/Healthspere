// const db = require('../config/db'); // Assume this is imported

// @desc    GET Get all sanitation records
// @route   GET /api/sanitation
// @access  Private
exports.getSanitationRecords = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM water_sanitation_facilities ORDER BY area_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sanitation records:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET Get specific area sanitation data
// @route   GET /api/sanitation/:id
// @access  Private
exports.getSanitationRecordById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM water_sanitation_facilities WHERE area_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sanitation record not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching sanitation record by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    POST Add sanitation record (health_worker only)
// @route   POST /api/sanitation
// @access  Private/HealthWorker
exports.addSanitationRecord = async (req, res) => {
    const { area_street, water_source_type, toilet_availability, cleaning_frequency, remarks } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO water_sanitation_facilities (area_street, water_source_type, toilet_availability, cleaning_frequency, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [area_street, water_source_type, toilet_availability, cleaning_frequency, remarks]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding sanitation record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    PUT Update sanitation info (health_worker only)
// @route   PUT /api/sanitation/:id
// @access  Private/HealthWorker
exports.updateSanitationRecord = async (req, res) => {
    const { id } = req.params;
    const { cleaning_frequency } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE water_sanitation_facilities SET cleaning_frequency = $1 WHERE area_id = $2 RETURNING *',
            [cleaning_frequency, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sanitation record not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating sanitation record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    DELETE Delete sanitation record (admin only)
// @route   DELETE /api/sanitation/:id
// @access  Private/Admin
exports.deleteSanitationRecord = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM water_sanitation_facilities WHERE area_id = $1 RETURNING area_id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sanitation record not found' });
        }
        res.json({ message: 'Sanitation record deleted successfully' });
    } catch (error) {
        console.error('Error deleting sanitation record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};