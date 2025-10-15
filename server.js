import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './config/db.js';

// Import all routes using ES module syntax
import authRoutes from './routes/authRoutes.js';
import checkupRoutes from './routes/checkupRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import sanitationRoutes from './routes/sanitationRoutes.js';
import sessionsRoutes from './routes/sessionsRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => res.send('🌿 Health Awareness API Running...'));

// Auth routes
app.use('/api/auth', authRoutes);

// Other routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/checkups', checkupRoutes);
app.use('/api/sanitation', sanitationRoutes);
app.use('/api/impact', impactRoutes);

// Function to start server after DB connection
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); // Exit process if DB fails
  }
};

startServer();
