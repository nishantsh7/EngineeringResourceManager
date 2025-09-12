const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs'); // <-- Import the Node.js file system module

// --- PRODUCTION-GRADE INITIALIZATION ---
let serviceAccount;
const secretPath = '/etc/secrets/firebase-key'; 


if (fs.existsSync(secretPath)) {
    const serviceAccountJson = fs.readFileSync(secretPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountJson);
} else
    throw new Error(`Production environment detected, but secret file not found at ${secretPath}`);


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