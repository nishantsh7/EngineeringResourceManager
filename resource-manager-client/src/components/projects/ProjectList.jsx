import { useProjects } from '../../hooks/useProjects';
import Dropdown from '../ui/Dropdown';
import DaysLeftBar from './DaysLeftBar';
import AssigneeAvatars from './AssigneeAvatars';
import { useMemo } from 'react';

// Helper components (ProjectInfoItem, PriorityTag) are perfect and need no changes.
const ProjectInfoItem = ({ iconPath, text, textColor = 'text-[#A9A9A9]' }) => ( <div className="flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${textColor}`}><path strokeLinecap="round" strokeLinejoin="round" d={iconPath} /></svg> <span className={`text-xs font-medium ${textColor}`}>{text}</span> </div> );
const PriorityTag = ({ priority }) => { let styles = ''; switch (priority?.toLowerCase()) { case 'high': styles = 'bg-red-500/10 text-red-400'; break; case 'medium': styles = 'bg-yellow-500/10 text-yellow-400'; break; case 'low': styles = 'bg-green-500/10 text-green-400'; break; default: styles = 'bg-gray-700/20 text-gray-400'; } return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles}`}>{priority}</span>; };

const ProjectList = ({ searchTerm, onManageClick, onEditClick, onDeleteClick }) => {
  const { projects, loading, error } = useProjects();

  // We combine both filtering steps into a single, chained operation.
  const displayProjects = useMemo(() => {
    if (!projects) return [];
    const today = new Date();
    const lowercasedTerm = searchTerm.toLowerCase();

    return projects
      // Step 1: Filter by the search term first
      .filter(project => {
        if (!searchTerm.trim()) return true; // If search is empty, keep all projects
        return (
          project.name.toLowerCase().includes(lowercasedTerm) ||
          (project.description || '').toLowerCase().includes(lowercasedTerm) ||
          (project.tags || []).some(tag => tag.toLowerCase().includes(lowercasedTerm)) ||
          (project.priority || '').toLowerCase().includes(lowercasedTerm) ||
          (project.status || '').toLowerCase().includes(lowercasedTerm)
        );
      })
      // Step 2: Then, filter the result of the search by the due date
      .filter(project => {
        if (!project.dueDate) return true;
        const due = new Date(project.dueDate);
        return due >= today;
      });
  }, [projects, searchTerm]); // The dependency array is now correct.

  if (loading) { return <p className="text-center mt-8 text-[#A9A9A9]">Loading projects...</p>; }
  if (error) { return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>; }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* We now map over our final, correctly filtered `displayProjects` array */}
      {displayProjects && displayProjects.length > 0 ? (
        displayProjects.map((project) => (
          <div key={project.id} className="bg-[#101010] border border-[#1a1f29] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1"><h3 className="font-bold text-lg text-[#EAEAEA] pr-2">{project.name}</h3></div>
                <Dropdown>
                  <button onClick={() => onEditClick(project)} className="block w-full text-left px-4 py-2 text-sm text-[#EAEAEA] hover:bg-[#2D2D2D]">Edit</button>
                  <button onClick={() => onDeleteClick(project)} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#2D2D2D]">Delete</button>
                </Dropdown>
              </div>
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <PriorityTag priority={project.priority || 'Medium'} />
                {project.tags && project.tags.map(tag => ( <span key={tag} className="px-2 py-0.5 text-xs text-[#A9A9A9] bg-[#1a1f29] rounded-full">{tag}</span> ))}
              </div>
              <p className="text-sm text-[#A9A9A9] leading-relaxed line-clamp-2 mt-2">{project.description || 'No description provided.'}</p>
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-[#1a1f29]">
                <ProjectInfoItem iconPath="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0-2.25l2.25 1.313M4.5 20.25l2.25-1.313M6.75 18.938l-2.25-1.313M6.75 18.938V21.188m9-2.25l2.25-1.313M18.75 18.938l-2.25-1.313M18.75 18.938V21.188" text={project.status || 'N/A'} />
                <ProjectInfoItem iconPath="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" text={project.dueDate ? `Due: ${project.dueDate}` : 'No Due Date'} />
              </div>
              <DaysLeftBar startDate={project.createdAt?.toDate().toISOString().split('T')[0]} dueDate={project.dueDate} />
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1a1f29]">
              <AssigneeAvatars assigneeIds={project.assigneeIds} />
              <button onClick={() => onManageClick(project)} className="py-2 px-4 bg-[#1f1f1f] hover:bg-[#3f3f3f] text-[#e4ddbc] text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                Manage Project
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-10 bg-[#101010] rounded-xl border border-[#1a1f29]">
          {searchTerm ? (
             <p className="text-[#A9A9A9]">No active projects found matching "{searchTerm}".</p>
          ) : (
             <p className="text-[#A9A9A9]">No active projects found. Click "Add New Project" to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

