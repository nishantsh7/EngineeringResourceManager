import { useMyProjects } from '../../hooks/useMyProjects'; 
const ProjectStatusTag = ({ status }) => {
  let styles = '';
  switch (status.toLowerCase()) {
    case 'active': styles = 'bg-[--color-tag-high-bg] text-[--color-tag-high-text]'; break;
    case 'planning': styles = 'bg-[--color-tag-medium-bg] text-[--color-tag-medium-text]'; break;
    case 'completed': styles = 'bg-[--color-tag-low-bg] text-[--color-tag-low-text]'; break;
    default: styles = 'bg-gray-700 text-gray-300';
  }
  return <span className={`px-2 py-1 text-xs font-medium rounded-md ${styles}`}>{status}</span>;
};

const MyAssignmentsList = () => {
  // Use our new hook to get the projects assigned to the current user
  const { myProjects, loading, error } = useMyProjects();

  if (loading) {
    return <p className="text-center mt-8 text-[#A9A9A9]">Loading your assignments...</p>;
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">Error loading assignments: {error.message}</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {myProjects && myProjects.length > 0 ? (
        myProjects.map((project) => (
          <div key={project.id} className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-xl p-5 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-[#EAEAEA]">{project.name}</h3>
                <ProjectStatusTag status={project.status || 'Planning'} />
              </div>
              {/* Card Description */}
              <p className="text-sm text-[#A9A9A9] leading-relaxed line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
            </div>
            
            {/* Card Footer (simplified for the engineer's view for now) */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-[#A9A9A9]">
                <span className="font-semibold">Priority: {project.priority}</span>
              </div>
              <div className="text-sm text-[#A9A9A9]">
                <span>Due: {project.dueDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-10 bg-[#1E1E1E] rounded-xl border border-[#2D2D2D]">
          <p className="text-[#A9A9A9]">You have no projects assigned to you.</p>
        </div>
      )}
    </div>
  );
};

export default MyAssignmentsList;
