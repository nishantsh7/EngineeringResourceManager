import { useMemo } from 'react';
import { doc, collection, query, where } from 'firebase/firestore';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';

export const useEngineerProfile = (engineerId) => {
  console.log('🔍 Hook called with engineerId:', engineerId);

  // --- Step 1: Fetch the engineer's profile ---
  const userRef = engineerId ? doc(db, 'users', engineerId) : null;
  const [engineerSnapshot, engineerLoading, engineerError] = useDocument(userRef);
  const engineer = engineerSnapshot ? { id: engineerSnapshot.id, ...engineerSnapshot.data() } : null;
  
  console.log('👤 Engineer data:', engineer);
  console.log('👤 Engineer loading:', engineerLoading);
  console.log('👤 Engineer error:', engineerError);

  // --- Step 2: Fetch all assignments for this specific engineer ---
  const assignmentsQuery = engineerId 
    ? query(collection(db, 'assignments'), where('userId', '==', engineerId))
    : null;
    
  console.log('📋 Assignments query created:', !!assignmentsQuery);
  console.log('📋 Query engineerId:', engineerId);

  // FIXED: Destructure correctly from useCollection
  const [assignmentsSnapshot, assignmentsLoading, assignmentsError] = useCollection(assignmentsQuery);
  
  const assignments = useMemo(() => {
    console.log('📋 Assignments snapshot:', assignmentsSnapshot);
    console.log('📋 Assignments docs length:', assignmentsSnapshot?.docs?.length || 0);
    
    if (assignmentsSnapshot?.docs) {
      assignmentsSnapshot.docs.forEach((doc, index) => {
        console.log(`📋 Assignment ${index}:`, { id: doc.id, ...doc.data() });
      });
    }
    
    return assignmentsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
  }, [assignmentsSnapshot]);
  
  console.log('📋 Final assignments array:', assignments);
  console.log('📋 Assignments loading:', assignmentsLoading);
  console.log('📋 Assignments error:', assignmentsError);

  // --- Step 3: Extract the unique project IDs from the assignments ---
  const projectIds = useMemo(() => {
    if (!assignments || assignments.length === 0) {
      console.log('🎯 No assignments found, no project IDs to fetch');
      return [];
    }
    const ids = [...new Set(assignments.map(a => a.projectId))];
    console.log('🎯 Project IDs extracted:', ids);
    return ids;
  }, [assignments]);

  // --- Step 4: Fetch all the project documents that match the extracted IDs ---
  const projectsQuery = projectIds.length > 0 
    ? query(collection(db, 'projects'), where('__name__', 'in', projectIds))
    : null;
    
  console.log('🏗️ Projects query created:', !!projectsQuery);
  console.log('🏗️ Project IDs for query:', projectIds);

  // FIXED: Destructure correctly from useCollection  
  const [projectsSnapshot, projectsLoading, projectsError] = useCollection(projectsQuery);
  
  const projects = useMemo(() => {
    console.log('🏗️ Projects snapshot:', projectsSnapshot);
    console.log('🏗️ Projects docs length:', projectsSnapshot?.docs?.length || 0);
    
    return projectsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
  }, [projectsSnapshot]);
  
  console.log('🏗️ Final projects array:', projects);
  console.log('🏗️ Projects loading:', projectsLoading);
  console.log('🏗️ Projects error:', projectsError);

  // --- Step 5: Combine the assignment and project data ---
  const assignedProjects = useMemo(() => {
    if (!assignments || !projects) {
      console.log('🔗 Missing data for combining - assignments:', !!assignments, 'projects:', !!projects);
      return [];
    }
    
    const projectsMap = new Map(projects.map(p => [p.id, p]));
    console.log('🔗 Projects map:', projectsMap);
    
    const combined = assignments.map(assignment => ({
      ...assignment,
      projectName: projectsMap.get(assignment.projectId)?.name || 'Unknown Project',
    }));
    
    console.log('🔗 Combined assigned projects:', combined);
    return combined;
  }, [assignments, projects]);

  // --- Step 6: Consolidate the loading and error states ---
  const loading = engineerLoading || assignmentsLoading || projectsLoading;
  const error = engineerError || assignmentsError || projectsError;
  
  console.log('⏳ Final loading state:', loading);
  console.log('❌ Final error state:', error);
  console.log('✅ Final assigned projects:', assignedProjects);

  return { engineer, assignedProjects, loading, error };
};