// const db = require('../config/db'); // Assume this is imported

// @desc    GET logged-in user info
// @route   GET /api/auth/profile
// @access  Private (Handled by authMiddleware)
exports.getUserProfile = async (req, res) => {
    try {
        // User data is attached to req.user by authMiddleware
        const { user_id } = req.user; 
        
        const result = await db.query(
            'SELECT user_id, username, email, full_name, role, phone_number FROM users WHERE user_id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    PUT Update own profile (health_worker or user)
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const { full_name, phone_number } = req.body;
    const userIdToUpdate = req.params.id; // User ID from URL
    const loggedInUserId = req.user.user_id; // User ID from token/middleware

    // Only allow a user to update their OWN profile
    if (userIdToUpdate !== String(loggedInUserId)) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    try {
        const result = await db.query(
            'UPDATE users SET full_name = $1, phone_number = $2 WHERE user_id = $3 RETURNING user_id, username, email, full_name, role, phone_number',
            [full_name, phone_number, loggedInUserId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    GET Admin only: Get any user info
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    // Role check for 'admin' should be done in a separate middleware
    // If it reaches here, we assume the admin check has passed for this route.
    const userId = req.params.id;

    try {
        const result = await db.query(
            'SELECT user_id, username, email, full_name, role, phone_number FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};