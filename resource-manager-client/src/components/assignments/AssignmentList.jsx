import { useMemo, useState } from 'react';
import { useEngineers } from '../../hooks/useEngineers';
import { useAssignmentsForProject } from '../../hooks/useAssignmentsForProject';

const AssignmentList = ({ project, onShowAddView, onUpdateHours, onRemove }) => {
  const { engineers, loading: engineersLoading } = useEngineers();
  const { assignments, loading: assignmentsLoading } = useAssignmentsForProject(project.id);
  
  // This state will track the locally changed, unsaved hour values.
  const [updatedHours, setUpdatedHours] = useState({});

  const detailedAssignments = useMemo(() => {
    if (!assignments || !engineers) return [];
    return assignments.map(assignment => ({
      ...assignment,
      engineerName: engineers.find(e => e.id === assignment.userId)?.name || 'Unknown',
    }));
  }, [assignments, engineers]);

  // When an input value changes, we store it in our local state.
  const handleHourChange = (assignmentId, hours) => {
    setUpdatedHours(prev => ({
      ...prev,
      [assignmentId]: parseInt(hours, 10) || 0,
    }));
  };

  // When the user clicks "Update", we send the change and clear the local state for that item.
  const handleUpdateClick = (assignmentId) => {
    const newHours = updatedHours[assignmentId];
    onUpdateHours(assignmentId, newHours);
    
    // By removing the key from our local state, the button will become disabled again.
    setUpdatedHours(prev => {
      const newState = { ...prev };
      delete newState[assignmentId];
      return newState;
    });
  };

  if (engineersLoading || assignmentsLoading) {
    return <p className="text-center text-[#A9A9A9]">Loading assignment data...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-semibold text-[#EAEAEA]">Current Assignees</h4>
          <button onClick={onShowAddView} className="py-1 px-3 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] text-xs font-semibold rounded-lg">
            + Add Assignee
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {detailedAssignments.length > 0 ? detailedAssignments.map(assign => {
            // This is the key logic: has the value in our local state
            // deviated from the original value from the database?
            const hasChanged = Object.prototype.hasOwnProperty.call(updatedHours,assign.id) && updatedHours[assign.id] !== assign.allocatedHours;
            
            return (
              <div key={assign.id} className="flex items-center justify-between bg-[#161616] p-2 rounded-lg">
                <span className="font-medium text-white">{assign.engineerName}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={updatedHours[assign.id] ?? assign.allocatedHours} 
                    onChange={(e) => handleHourChange(assign.id, e.target.value)}
                    className="w-16 bg-[#2D2D2D] border border-[#3D3D3D] rounded-md p-1 text-center text-sm" 
                  />
                  <button 
                    onClick={() => handleUpdateClick(assign.id)}
                    // The button is disabled if the value has NOT changed.
                    disabled={!hasChanged}
                    className="py-1 px-3 bg-[#007AFF] hover:bg-[#0056b3] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                  <button onClick={() => onRemove(assign.id)} className="text-red-500 hover:text-red-400 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </div>
              </div>
            );
          }) : <p className="text-sm text-center text-[#A9A9A9] py-4">No one is assigned to this project yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;

