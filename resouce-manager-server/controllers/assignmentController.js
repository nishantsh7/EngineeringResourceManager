const admin = require('firebase-admin');
const db = admin.firestore();

// POST /api/assignments - Create a single new assignment for an existing project
const createAssignment = async (req, res) => {
    try {
        const { projectId, userId, allocatedHours } = req.body;
        if (!projectId || !userId || allocatedHours === undefined) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const newAssignment = { projectId, userId, allocatedHours };
        const projectRef = db.collection('projects').doc(projectId);
        const batch = db.batch();
        const assignmentRef = db.collection('assignments').doc();
        batch.set(assignmentRef, newAssignment);

        batch.update(projectRef, {
            assigneeIds: admin.firestore.FieldValue.arrayUnion(userId),
            assigneeCount: admin.firestore.FieldValue.increment(1)
        });

        await batch.commit();

        res.status(201).json({ id: assignmentRef.id, ...newAssignment });
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: 'Failed to create assignment.' });
    }
};

// --- DELETE an assignment and UPDATE the project summary ---
const deleteAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const assignmentRef = db.collection('assignments').doc(assignmentId);
        const assignmentDoc = await assignmentRef.get();

        if (!assignmentDoc.exists) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        const { projectId, userId } = assignmentDoc.data();
        const projectRef = db.collection('projects').doc(projectId);

        const batch = db.batch();

        // 1. Delete the document from the 'assignments' collection
        batch.delete(assignmentRef);

        // 2. Atomically update the summary on the 'project' document
        // FieldValue.arrayRemove removes all instances of the userId.
        batch.update(projectRef, {
            assigneeIds: admin.firestore.FieldValue.arrayRemove(userId),
            assigneeCount: admin.firestore.FieldValue.increment(-1)
        });

        await batch.commit();

        res.status(200).json({ message: `Assignment ${assignmentId} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        res.status(500).json({ error: 'Failed to delete assignment.' });
    }
};


// PUT /api/assignments/:id - Update an existing assignment (e.g., change hours)
const updateAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const { allocatedHours } = req.body;

        if (allocatedHours === undefined) {
            return res.status(400).json({ error: 'Allocated hours are required.' });
        }

        const assignmentRef = db.collection('assignments').doc(assignmentId);
        await assignmentRef.update({ allocatedHours });

        res.status(200).json({ message: `Assignment ${assignmentId} updated successfully.` });
    } catch (error) {
        console.error("Error updating assignment:", error);
        res.status(500).json({ error: 'Failed to update assignment.' });
    }
};

module.exports = {
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
