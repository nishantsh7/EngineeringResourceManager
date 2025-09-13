    const admin = require('firebase-admin');
    const db = admin.firestore();

    const updateUser = async (req, res) => {
        if (req.params.id !== req.user.uid) {
            return res.status(403).json({ error: 'Forbidden: You can only update your own profile.' });
        }

        try {
            const userId = req.params.id;
            const {name, skills, duration} = req.body;

            const updateData = {};
            // Only add fields to the update object if they were provided
            if (name) updateData.name = name;
            if (skills) updateData.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
            if (duration) {
                updateData.duration = duration;
                // Also update capacity based on duration
                updateData.capacity = duration === 'full-time' ? 100 : 50;
            }
            
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No valid fields provided for update.' });
            }

            const userRef = db.collection('users').doc(userId);
            await userRef.update(updateData);

            res.status(200).json({ message: `User ${userId} updated successfully.` });

        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: 'Failed to update user profile.' });
        }
    };

    module.exports = { updateUser };
    
