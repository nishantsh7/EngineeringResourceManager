const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- PRODUCTION INITIALIZATION ---
// In the cloud, this environment variable is the ONLY source for the key.
if (!process.env.FIREBASE_SERVICE_KEY) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

// Decode the base64 key provided by the Cloud Run environment.
// const serviceAccountBase64 = process.env.FIREBASE_SERVICE_KEY_BASE64;
// const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccountJson = process.env.FIREBASE_SERVICE_KEY;
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
// Cloud Run provides the PORT environment variable, defaulting to 8080.
const PORT = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json());

// --- ROUTES ---
const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});