const admin = require('firebase-admin');
const db = admin.firestore();

// GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

// POST a new project
// This is just the createProject function. The others remain the same.



// --- This is the only function that needs to be updated ---
exports.createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            acceptanceCriteria,
            priority,
            startDate,
            dueDate,
            tags,
            assignments
        } = req.body;

        if (!name || !priority || !dueDate || !description || !acceptanceCriteria || !startDate) {
            return res.status(400).json({ error: 'Missing required project fields.' });
        }

        // 1. Prepare the main project document (without assignment summary yet).
        const newProject = {
            name,
            description,
            acceptanceCriteria,
            priority,
            startDate,
            dueDate,
            tags: tags || [],
            status: 'Planning',
            createdBy: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // 2. Create the project document to get its ID.
        const projectRef = await db.collection('projects').add(newProject);
        const projectId = projectRef.id;

        let assigneeIds = []; // 3. Initialize an empty array for our summary.

        // 4. If assignments exist, create them in the 'assignments' collection.
        if (assignments && assignments.length > 0) {
            const batch = db.batch();
            assignments.forEach(assignment => {
                const assignmentRef = db.collection('assignments').doc();
                batch.set(assignmentRef, {
                    projectId: projectId,
                    userId: assignment.userId,
                    allocatedHours: assignment.allocatedHours,
                    startDate:newProject.startDate,
                    dueDate:newProject.dueDate,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // 5. Add each engineer's ID to our summary array.
                assigneeIds.push(assignment.userId);
            });
            await batch.commit();
        }

        // 6. DENORMALIZATION STEP: Update the main project document with the summary.
        await projectRef.update({
            assigneeIds: assigneeIds,
            assigneeCount: assigneeIds.length,
            
        });

        res.status(201).json({ 
    id: projectId, 
    ...newProject, 
    assigneeIds,
    assigneeCount: assigneeIds.length 
});

    } catch (error) {
        console.error("Error creating project and assignments:", error);
        res.status(500).json({ error: 'Failed to create project and assignments.' });
    }
};
exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        // We only allow certain fields to be updated for security and simplicity.
        const { name, description, acceptanceCriteria, priority, dueDate, tags, status } = req.body;

        // Create an object with only the fields that were actually provided in the request
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (acceptanceCriteria) updateData.acceptanceCriteria = acceptanceCriteria;
        if (priority) updateData.priority = priority;
        if (dueDate) updateData.dueDate = dueDate;
        if (tags) updateData.tags = tags;
        if (status) updateData.status = status; // Allow updating status (e.g., to 'Active' or 'Completed')

        const projectRef = db.collection('projects').doc(projectId);
        await projectRef.update(updateData);

        res.status(200).json({ message: `Project ${projectId} updated successfully.` });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: 'Failed to update project.' });
    }
};
// DELETE a project
exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // 1. Find all assignment documents linked to this project.
        const assignmentsQuery = db.collection('assignments').where('projectId', '==', projectId);
        const assignmentsSnapshot = await assignmentsQuery.get();

        // 2. Create a batch operation to delete all found assignments.
        //    This is much more efficient than deleting them one by one.
        const batch = db.batch();
        assignmentsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // 3. Add the deletion of the main project document to the same batch.
        const projectRef = db.collection('projects').doc(projectId);
        batch.delete(projectRef);

        // 4. Commit all the deletions at once.
        await batch.commit();

        res.status(200).json({ message: `Project ${projectId} and all its assignments deleted successfully.` });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
};
