import DaysLeftBar from './DaysLeftBar';
import AssigneeAvatars from './AssigneeAvatars';

// Helper for the Priority tag
const PriorityTag = ({ priority }) => {
  let styles = '';
  switch (priority?.toLowerCase()) {
    case 'high': styles = 'bg-red-500/10 text-red-400'; break;
    case 'medium': styles = 'bg-yellow-500/10 text-yellow-400'; break;
    case 'low': styles = 'bg-green-500/10 text-green-400'; break;
    default: styles = 'bg-gray-700/20 text-gray-400';
  }
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles}`}>{priority}</span>;
};

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// The component now receives `isExpanded` and `onToggleExpand` as props from its parent.
const EngineerProjectCard = ({ project, isExpanded, onToggleExpand }) => {
  return (
    <div className="bg-[#101010] border border-[#1a1f29] rounded-xl p-5 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-[#EAEAEA] pr-2">{project.name}</h3>
          <PriorityTag priority={project.priority || 'Medium'} />
        </div>
        
        <p className="text-sm text-[#A9A9A9] leading-relaxed line-clamp-2 mt-2">
          {project.description || 'No description provided.'}
        </p>

        {/* Project Dates */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <div className="text-[#A9A9A9]">
              <span className="font-medium text-[#EAEAEA]">Start:</span> {formatDate(project.startDate)}
            </div>
            <div className="text-[#A9A9A9]">
              <span className="font-medium text-[#EAEAEA]">Due:</span> {formatDate(project.dueDate)}
            </div>
          </div>
        </div>

        <DaysLeftBar 
          startDate={project.createdAt?.toDate().toISOString().split('T')[0]} 
          dueDate={project.dueDate} 
        />
      </div>

      {/* The visibility of this section is now controlled by the `isExpanded` prop */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#1a1f29] animate-fade-in">
          <h4 className="text-sm font-semibold text-[#EAEAEA] mb-2">Acceptance Criteria</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#A9A9A9]">
            {project.acceptanceCriteria.split('\n').map((line, index) => (
              <li key={index}>{line.replace(/^- /, '')}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1a1f29]">
        <AssigneeAvatars assigneeIds={project.assigneeIds} />
        {/* The button now calls the function passed down from the parent */}
        <button 
          onClick={onToggleExpand}
          className="py-2 px-4 text-[#e4ddbc] text-xs font-semibold rounded-lg hover:bg-[#1f1f1f] transition-colors cursor-pointer"
        >
          {isExpanded ? 'Hide Criteria' : 'View Acceptance Criteria'}
        </button>
      </div>
    </div>
  );
};

export default EngineerProjectCard;