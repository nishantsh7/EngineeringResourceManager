import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { seedData } from './data.js';


const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedDatabase() {
  try {
    console.log("Starting Firebase Firestore seeding...");

   
    if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken);
        console.log("Successfully signed in with custom token.");
    } else {
        console.log("No custom auth token provided. Seeding will proceed without authentication.");
    }

    
    console.log("Seeding 'users' collection...");
    for (const userData of seedData.users) {
      const userRef = doc(db, 'users', userData.id);
      await setDoc(userRef, userData);
      console.log(`User ${userData.id} seeded successfully.`);
    }

    
    console.log("Seeding 'projects' collection...");
    for (const projectData of seedData.projects) {
      const projectRef = doc(collection(db, 'projects'));
      await setDoc(projectRef, projectData);
      console.log(`Project "${projectData.name}" seeded successfully.`);
    }

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  }
}


seedDatabase();
