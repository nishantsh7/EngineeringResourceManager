const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- PRODUCTION-READY INITIALIZATION ---
// Check if the environment variable is set
if (!process.env.FIREBASE_SERVICE_KEY_BASE64) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

// Decode the base64 encoded key from the environment variable
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_KEY_BASE64;
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// --- The rest of your index.js file remains exactly the same ---
const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run uses 8080 by default

app.use(cors()); 
app.use(express.json());

const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
