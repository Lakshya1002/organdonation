const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const donorRoutes = require('./routes/donors');
const patientRoutes = require('./routes/patients');
const matchingRoutes = require('./routes/matching');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const organRoutes = require('./routes/organs');
const transplantRoutes = require('./routes/transplants');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows frontend to communicate
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/donors', donorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/matches', matchingRoutes);
// Alias so both /api/matches and /api/matching work
app.use('/api/matching', matchingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organs', organRoutes);
app.use('/api/transplants', transplantRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Organova Backend API is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`   - Donors API: http://localhost:${PORT}/api/donors`);
  console.log(`   - Patients API: http://localhost:${PORT}/api/patients`);
  console.log(`   - Matching API: http://localhost:${PORT}/api/matches/run\n`);
});