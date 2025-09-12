import { useMemo } from 'react';
import { useUsers } from '../../hooks/useUsers';

const AssigneeAvatars = ({ assigneeIds = [] }) => {
  // Destructure loading and error from the hook
  const { users, loading, error } = useUsers();

  const assignees = useMemo(() => {
    if (!users || assigneeIds.length === 0) return [];
    // Your filtering logic is correct!
    return assigneeIds.map(id => users.find(u => u.id === id)).filter(Boolean);
  }, [users, assigneeIds]);

  // Handle the error state
  if (error) {
    console.error("Failed to fetch users:", error);
    return <span className="text-sm text-red-500">Error loading users</span>;
  }

  // Handle the loading state
  if (loading) {
    return <span className="text-sm text-[#A9A9A9]">Loading...</span>;
  }

  if (assignees.length === 0) {
    return <span className="text-sm text-[#A9A9A9]">No Assignees</span>;
  }
  
  const visibleAssignees = assignees.slice(0, 3);
  const remainingCount = assignees.length - visibleAssignees.length;

  return (
    <div className="flex items-center -space-x-2">
      {visibleAssignees.map(assignee => (
        <div 
          key={assignee.id}
          title={assignee.name}
          className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0 bg-[#e4ddbc] border-2 border-[#1E1E1E]"
        >
          {/* Add a check for assignee.name before using it */}
          <span className="font-bold text-xs text-gray-800">
            {assignee.name ? assignee.name.charAt(0) : '?'}
          </span>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 bg-[#2D2D2D] border-2 border-[#1E1E1E]">
          <span className="font-bold text-xs text-white">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

export default AssigneeAvatars;