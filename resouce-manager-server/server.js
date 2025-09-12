const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

// --- PRODUCTION-GRADE INITIALIZATION ---
let serviceAccount;
const secretPath = '/etc/secrets/firebase-key';

console.log('Checking for Firebase service account...');
console.log('Secret path:', secretPath);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if secret file exists and log more details
if (fs.existsSync(secretPath)) {
    console.log('✅ Secret file found');
    try {
        const serviceAccountJson = fs.readFileSync(secretPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('✅ Service account loaded successfully');
    } catch (error) {
        console.error('❌ Error reading or parsing service account:', error.message);
        throw error;
    }
} else {
    console.error('❌ Secret file not found at:', secretPath);
    
    // List contents of /etc/secrets/ for debugging
    try {
        const secretsDir = '/etc/secrets';
        if (fs.existsSync(secretsDir)) {
            const files = fs.readdirSync(secretsDir);
            console.log('Files in /etc/secrets/:', files);
        } else {
            console.log('/etc/secrets/ directory does not exist');
        }
    } catch (err) {
        console.log('Could not list /etc/secrets/ contents:', err.message);
    }
    
    throw new Error(`Production environment detected, but secret file not found at ${secretPath}`);
}

// Initialize Firebase Admin
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    throw error;
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        firebase: 'initialized'
    });
});

// --- ROUTES ---
const projectRoutes = require('./routes/projects');
const assignmentRoutes = require('./routes/assignments');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});