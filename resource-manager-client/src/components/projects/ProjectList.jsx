import { useProjects } from '../../hooks/useProjects';
import Dropdown from '../ui/Dropdown';
import DaysLeftBar from './DaysLeftBar'; // <-- Import the new helper components
import AssigneeAvatars from './AssigneeAvatars';

const ProjectStatusTag = ({ status }) => {
  let styles = '';
  // The color of the tag is based on the project's priority
  switch (status?.toLowerCase()) {
    case 'high': styles = 'bg-[--color-tag-high-bg] text-[--color-tag-high-text]'; break;
    case 'medium': styles = 'bg-[--color-tag-medium-bg] text-[--color-tag-medium-text]'; break;
    case 'low': styles = 'bg-[--color-tag-low-bg] text-[--color-tag-low-text]'; break;
    default: styles = 'bg-gray-700 text-gray-300';
  }
  return <span className={`px-2 py-1 text-xs font-medium rounded-md ${styles}`}>{status}</span>;
};

const ProjectList = ({ onManageClick, onEditClick, onDeleteClick }) => {
  const { projects, loading, error } = useProjects();
  const today = new Date();

   const activeProjects = projects.filter(project => {
    if (!project.dueDate) return true; // keep if no due date
    const due = new Date(project.dueDate);
    return due >= today; // only keep if due date is today or in the future
  });


  if (loading) { return <p className="text-center mt-8 text-[#A9A9A9]">Loading projects...</p>; }
  if (error) { return <p className="text-center mt-8 text-red-500">Error: {error}</p>; }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {activeProjects && activeProjects.length > 0 ? (
        activeProjects.map((project) => (
          <div key={project.id} className="bg-[#101010] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#EAEAEA] pr-2">{project.name}</h3>
                </div>
                <Dropdown>
                  <button onClick={() => onEditClick(project)} className="block w-full text-left px-4 py-2 text-sm text-[#EAEAEA] hover:bg-[#2D2D2D]">Edit</button>
                  <button onClick={() => onDeleteClick(project)} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#2D2D2D]">Delete</button>
                </Dropdown>
              </div>
              <ProjectStatusTag status={project.priority || 'Medium'} />
              <p className="text-sm text-[#A9A9A9] leading-relaxed line-clamp-2 mt-2">
                {project.description || 'No description provided.'}
              </p>
              
              {/* --- New DaysLeftBar is added here --- */}
              {/* It needs the Firestore timestamp converted to a string */}
              <DaysLeftBar 
                startDate={project.createdAt?.toDate().toISOString().split('T')[0]} 
                dueDate={project.dueDate} 
              />
            </div>
            
            <div className="flex justify-between items-center mt-6">
              {/* --- The simple text count is replaced with the new Avatars component --- */}
              <AssigneeAvatars assigneeIds={project.assigneeIds} />

              <button 
                onClick={() => onManageClick(project)} 
                className="py-2 px-4 bg-[#1f1f1f] hover:bg-[#3f3f3f] text-[#e4ddbc] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Manage Project
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-10 bg-[#1E1E1E] rounded-xl border-[#2D2D2D]">
          <p className="text-[#A9A9A9]">No active projects found. Click "Add New Project" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

