const admin = require('firebase-admin');

// IMPORTANT: Make sure this path points to your actual service account key file
const serviceAccount = require('./engineering-resource-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- SAMPLE DATA ---

const users = [
  // Managers
  { uid: 'manager-01', name: 'Alisha Sharma', displayName: 'Alisha Sharma', email: 'alisha.manager@example.com', role: 'Manager', seniority: 'Senior', duration: 'full-time', capacity: 40, skills: ['Project Management', 'Agile', 'System Design'] },
  { uid: 'manager-02', name: 'Raj Patel', displayName: 'Raj Patel', email: 'raj.manager@example.com', role: 'Manager', seniority: 'Mid-level', duration: 'full-time', capacity: 40, skills: ['Scrum', 'Team Leadership'] },
  
  // Engineers
  { uid: 'engineer-01', name: 'Vansh Gupta', displayName: 'Vansh Gupta', email: 'vansh.dev@example.com', role: 'Engineer', seniority: 'Senior', duration: 'full-time', capacity: 40, skills: ['React', 'Node.js', 'Firestore', 'GCP'] },
  { uid: 'engineer-02', name: 'Priya Singh', displayName: 'Priya Singh', email: 'priya.dev@example.com', role: 'Engineer', seniority: 'Mid-level', duration: 'full-time', capacity: 40, skills: ['React', 'TypeScript', 'UI/UX'] },
  { uid: 'engineer-03', name: 'Amit Kumar', displayName: 'Amit Kumar', email: 'amit.dev@example.com', role: 'Engineer', seniority: 'Mid-level', duration: 'part-time', capacity: 20, skills: ['Node.js', 'Express', 'MongoDB'] },
  { uid: 'engineer-04', name: 'Sunita Rao', displayName: 'Sunita Rao', email: 'sunita.dev@example.com', role: 'Engineer', seniority: 'Junior', duration: 'full-time', capacity: 40, skills: ['HTML', 'CSS', 'JavaScript'] },
  { uid: 'engineer-05', name: 'Karan Mehta', displayName: 'Karan Mehta', email: 'karan.dev@example.com', role: 'Engineer', seniority: 'Junior', duration: 'full-time', capacity: 40, skills: ['Python', 'Flask'] },
];

const projects = [
  { 
    id: 'project-01',
    createdBy: 'manager-01',
    name: 'Implement New Dashboard UI',
    description: 'An intuitive and responsive design with subtle styling and data visualizations.',
    acceptanceCriteria: '- UI matches the Figma designs\n- All charts are interactive\n- Deploys without errors',
    priority: 'High',
    status: 'Active',
    tags: ['React', 'UI', 'Frontend'],
    startDate: '2025-09-08',
    dueDate: '2025-09-22',
    assignments: [
      { userId: 'engineer-01', allocatedHours: 20 },
      { userId: 'engineer-02', allocatedHours: 20 },
      { userId: 'engineer-04', allocatedHours: 10 },
    ]
  },
  { 
    id: 'project-02',
    createdBy: 'manager-01',
    name: 'Setup API Rate Limiting',
    description: 'Implement a rate limiting middleware to protect our backend endpoints from abuse.',
    acceptanceCriteria: '- Limits are configurable\n- Throws a 429 error when exceeded\n- Does not affect authenticated test users',
    priority: 'Medium',
    status: 'Planning',
    tags: ['Node.js', 'Backend', 'Security'],
    startDate: '2025-09-15',
    dueDate: '2025-09-26',
    assignments: [
      { userId: 'engineer-01', allocatedHours: 10 },
      { userId: 'engineer-03', allocatedHours: 15 },
    ]
  },
  { 
    id: 'project-03',
    createdBy: 'manager-02',
    name: 'Database Schema Migration',
    description: 'Migrate the legacy user profiles to the new V2 schema without downtime.',
    acceptanceCriteria: '- All data is migrated successfully\n- No data loss is reported\n- The script is idempotent',
    priority: 'High',
    status: 'Planning',
    tags: ['Database', 'Backend'],
    startDate: '2025-09-20',
    dueDate: '2025-10-05',
    assignments: [
        { userId: 'engineer-05', allocatedHours: 25 },
    ]
  },
    { 
    id: 'project-04',
    createdBy: 'manager-02',
    name: 'Fix Login Page CSS Bug',
    description: 'The login button is misaligned on Safari mobile browsers.',
    acceptanceCriteria: '- The button is centered on all major browsers\n- No visual regressions on Chrome or Firefox',
    priority: 'Low',
    status: 'Completed',
    tags: ['CSS', 'Bugfix', 'Frontend'],
    startDate: '2025-09-01',
    dueDate: '2025-09-05', // Past due date
    assignments: [
        { userId: 'engineer-04', allocatedHours: 10 },
    ]
  },
];


// --- SEEDING LOGIC ---

async function seedDatabase() {
  console.log('Starting database seed process...');

  try {
    // 1. Clear existing collections
    console.log('Clearing existing data...');
    const collections = ['users', 'projects', 'assignments'];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log(`  - Cleared ${collectionName} collection.`);
    }

    // 2. Seed users
    console.log('Seeding users...');
    const userBatch = db.batch();
    users.forEach(user => {
      const userRef = db.collection('users').doc(user.uid);
      // We remove the uid from the object before setting it in the document
      const { uid, ...userData } = user;
      userBatch.set(userRef, userData);
    });
    await userBatch.commit();
    console.log(`  - Added ${users.length} users.`);

    // 3. Seed projects and their assignments
    console.log('Seeding projects and assignments...');
    for (const project of projects) {
      const projectRef = db.collection('projects').doc(project.id);
      
      const { assignments, id, ...projectData } = project;
      
      const newProjectDoc = {
        ...projectData,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(project.startDate)),
        assigneeIds: [],
        assigneeCount: 0
      };

      // Create the project document first
      await projectRef.set(newProjectDoc);

      // If there are assignments, create them and update the project doc
      if (assignments && assignments.length > 0) {
        const assignmentBatch = db.batch();
        const assigneeIds = assignments.map(a => a.userId);

        assignments.forEach(assignment => {
          const assignmentRef = db.collection('assignments').doc(); // Auto-generate ID
          assignmentBatch.set(assignmentRef, {
            projectId: project.id,
            userId: assignment.userId,
            allocatedHours: assignment.allocatedHours,
          });
        });
        await assignmentBatch.commit();

        // Denormalize the data by updating the project with the summary
        await projectRef.update({
            assigneeIds: assigneeIds,
            assigneeCount: assigneeIds.length
        });
      }
       console.log(`  - Created project "${project.name}" and ${assignments.length} assignments.`);
    }

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
