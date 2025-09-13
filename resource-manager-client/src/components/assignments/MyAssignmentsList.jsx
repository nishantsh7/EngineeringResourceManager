import { useState, useMemo } from 'react'; // <-- 1. Import useMemo
import { useMyProjects } from '../../hooks/useMyProjects';
import EngineerProjectCard from '../projects/EngineerProjectCard';

const MyAssignmentsList = ({ searchTerm }) => {
  const { myProjects, loading, error } = useMyProjects();
  const [expandedCardId, setExpandedCardId] = useState(null);

  const handleToggleExpand = (projectId) => {
    setExpandedCardId(prevId => (prevId === projectId ? null : projectId));
  };
  const displayProjects = useMemo(() => {
    if (!myProjects) return [];
    
    const today = new Date();
    const lowercasedTerm = searchTerm.toLowerCase();

    return myProjects
      .filter(project => {
        if (!searchTerm.trim()) return true;
        return (
          project.name.toLowerCase().includes(lowercasedTerm) ||
          (project.description || '').toLowerCase().includes(lowercasedTerm) ||
          (project.tags || []).some(tag => tag.toLowerCase().includes(lowercasedTerm))||
          (project.priority || '').toLowerCase().includes(lowercasedTerm) ||
          (project.status || '').toLowerCase().includes(lowercasedTerm)
        );
      })
      .filter(project => {
        if (!project.dueDate) return true; 
        const due = new Date(project.dueDate);
        return due >= today;
      });
  }, [myProjects, searchTerm]);

  if (loading) { 
    return <p className="text-center mt-8 text-[#A9A9A9]">Loading your assignments...</p>; 
  }
  if (error) { 
    return <p className="text-center mt-8 text-red-500">Error loading assignments: {error.message}</p>; 
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* --- 3. We now map over the final `displayProjects` array --- */}
      {displayProjects && displayProjects.length > 0 ? (
        displayProjects.map((project) => (
          <EngineerProjectCard 
            key={project.id} 
            project={project}
            isExpanded={expandedCardId === project.id}
            onToggleExpand={() => handleToggleExpand(project.id)}
          />
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-10 bg-[#101010] rounded-xl border border-[#1a1f29]">
          {/* A smarter message for when no projects are found */}
          {searchTerm ? (
             <p className="text-[#A9A9A9]">No active assignments found matching "{searchTerm}".</p>
          ) : (
             <p className="text-[#A9A9A9]">You have no active projects assigned to you.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAssignmentsList;

