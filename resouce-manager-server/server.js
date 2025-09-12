// index.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- INITIALIZATION ---
const serviceAccount = require('./engineering-resource-service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

// --- IMPORT ROUTES ---
const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');

// --- USE ROUTES ---
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
