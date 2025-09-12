import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useEngineerProfile = (engineerId) => {
  const [engineer, setEngineer] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!engineerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Fetch the engineer's main profile document
        const engineerRef = doc(db, 'users', engineerId);
        const engineerSnap = await getDoc(engineerRef);

        if (!engineerSnap.exists()) {
          throw new Error('Engineer not found');
        }
        setEngineer({ id: engineerSnap.id, ...engineerSnap.data() });

        // 2. Fetch all assignments for this engineer
        const assignmentsQuery = query(collection(db, 'assignments'), where('userId', '==', engineerId));
        const assignmentsSnap = await getDocs(assignmentsQuery);
        const assignments = assignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        if (assignments.length > 0) {
          // 3. Get the unique IDs of all projects they are assigned to
          const projectIds = [...new Set(assignments.map(a => a.projectId))];

          // 4. Fetch all those project documents in a single, efficient query
          const projectsQuery = query(collection(db, 'projects'), where('__name__', 'in', projectIds));
          const projectsSnap = await getDocs(projectsQuery);
          const projectsMap = new Map(projectsSnap.docs.map(d => [d.id, d.data()]));

          // 5. Combine the assignment and project data
          const detailedAssignments = assignments.map(assignment => ({
            ...assignment,
            projectName: projectsMap.get(assignment.projectId)?.name || 'Unknown Project',
          }));
          setAssignedProjects(detailedAssignments);
        } else {
            setAssignedProjects([]);
        }

      } catch (err) {
        console.error("Error fetching engineer profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [engineerId]); // Re-run this effect if the engineerId changes

  return { engineer, assignedProjects, loading, error };
};
