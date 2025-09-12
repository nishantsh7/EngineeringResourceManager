const admin = require('firebase-admin');

// Middleware to verify Firebase ID token
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the 'Authorization' header exists and starts with 'Bearer '
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using Firebase Admin SDK
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            // 4. Attach the user's information to the request object
            req.user = decodedToken;
            
            // 5. Use 'return' to proceed and exit the function
            return next();
        } catch (error) {
            console.error('Error while verifying Firebase ID token:', error);
            // 6. Use 'return' to send the response and exit the function
            return res.status(403).json({ message: 'Not authorized, token failed.' });
        }
    }

    // 7. If the initial 'if' fails, send a response and exit.
    return res.status(401).json({ message: 'Not authorized, no token.' });
};

// Middleware to check if the user is a Manager
const isManager = async (req, res, next) => {
    try {
        const { uid } = req.user; // This will now safely have a req.user object
        const userDoc = await admin.firestore().collection('users').doc(uid).get();

        if (userDoc.exists && userDoc.data().role === 'Manager') {
            return next(); // User is a manager, proceed
        } else {
            return res.status(403).json({ message: 'Not authorized. Manager role required.' });
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        return res.status(500).json({ message: 'Error verifying user role.' });
    }
};

module.exports = { protect, isManager };
