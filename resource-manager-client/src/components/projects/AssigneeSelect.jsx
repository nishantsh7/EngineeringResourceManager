import { useState, useMemo } from 'react';
import { useEngineers } from '../../hooks/useEngineers'; 
import { useAssignments } from '../../hooks/useAssignments';

const AssigneeSelector = ({ existingAssignments = [], onBack, onComplete, submitting }) => {
  const { engineers, loading: engineersLoading } = useEngineers();
  const { assignments, loading: assignmentsLoading } = useAssignments(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngineers, setSelectedEngineers] = useState({});

  const engineerWorkloads = useMemo(() => {
    if (!engineers || !assignments) return [];
    
    // Calculate the current workload for every engineer
    const assignmentMap = new Map();
    assignments.forEach(assignment => {
      // Handle both 'userId' and 'id' field names for flexibility
      const engineerId = assignment.userId || assignment.id;
      const currentHours = assignmentMap.get(engineerId) || 0;
      assignmentMap.set(engineerId, currentHours + assignment.allocatedHours);
    });

    // Create a detailed profile for each engineer
    return engineers.map(engineer => ({
      ...engineer,
      allocatedHours: assignmentMap.get(engineer.id) || 0,
      availableHours: engineer.capacity - (assignmentMap.get(engineer.id) || 0),
    }));
  }, [engineers, assignments]);

  const availableEngineers = useMemo(() => {
    if (!engineerWorkloads) return [];
    // Handle both 'userId' and 'id' field names for existing assignments
    const assignedIds = existingAssignments.map(a => a.userId || a.id);
    // Sort by most available hours first
    return engineerWorkloads
      .filter(e => !assignedIds.includes(e.id))
      .sort((a, b) => b.availableHours - a.availableHours);
  }, [engineerWorkloads, existingAssignments]);

  const handleHourChange = (engineerId, hours) => {
    const newHours = parseInt(hours, 10) || 0;
    setSelectedEngineers(prev => ({ ...prev, [engineerId]: newHours }));
  };
 
  const handleSelectEngineer = (engineerId) => {
    setSelectedEngineers(prev => {
      const newSelection = { ...prev };
      if (Object.prototype.hasOwnProperty.call(newSelection, engineerId)) {
        delete newSelection[engineerId]; // Deselect if already present
      } else {
        newSelection[engineerId] = 10; // Select with a default of 10 hours
      }
      return newSelection;
    });
  };

  const filteredEngineers = availableEngineers?.filter((engineer) =>
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    const assignments = Object.entries(selectedEngineers)
      .filter(([, hours]) => hours > 0) 
      .map(([userId, allocatedHours]) => ({ userId, allocatedHours }));
    onComplete(assignments);
  };

  // const handleAddClick =()=>{
  //   const assignments = Object.entries(selectedEngineers)
  //     .filter(([, hours]) => hours > 0) 
  //     .map(([userId, allocatedHours]) => ({ userId, allocatedHours }));
  //   addAssignments(existingAssignments[0]?.projectId, assignments);
  //   onComplete(assignments);
  // }

  const loading = engineersLoading || assignmentsLoading;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="text-[#A9A9A9] hover:text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h4 className="text-lg font-semibold text-[#EAEAEA]">Add Assignees & Capacity</h4>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search for an engineer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-[#161616] border border-[#2D2D2D] rounded-lg py-2 px-4 mb-4 text-[#EAEAEA] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
      />

      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {loading && <p className="text-center text-[#A9A9A9]">Loading engineers...</p>}
        
        {filteredEngineers && filteredEngineers.map((engineer) => {
          const newAllocation = selectedEngineers[engineer.id] || 0;
          const wouldBeOverCapacity = engineer.allocatedHours + newAllocation > engineer.capacity;
          const isSelected = Object.prototype.hasOwnProperty.call(selectedEngineers, engineer.id);
          
          return (
            <div key={engineer.id}>
              <div className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-colors ${isSelected ? 'bg-[#2D2D2D]' : ''}`}>
                <div 
                  className="flex items-center gap-4 flex-grow cursor-pointer"
                  onClick={() => handleSelectEngineer(engineer.id)}
                >
                  <div className={`w-10 h-10 rounded-full grid place-items-center flex-shrink-0 ${isSelected ? 'bg-[#e4ddbc]' : 'bg-gray-600'}`}>
                    <span className="font-bold text-gray-800">{engineer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${isSelected ? 'text-white' : 'text-[#EAEAEA]'}`}>{engineer.name}</p>
                    <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-[#A9A9A9]'}`}>{engineer.email}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={selectedEngineers[engineer.id]} 
                      onChange={(e) => handleHourChange(engineer.id, e.target.value)} 
                      className="w-16 bg-[#161616] border border-[#2D2D2D] rounded-md p-1 text-center text-[#EAEAEA]" 
                    />
                    <span className="text-sm text-[#A9A9A9]">hrs/wk</span>
                  </div>
                )}
              </div>
              
              {/* Capacity warning - properly positioned */}
              {isSelected && wouldBeOverCapacity && (
                <div className="flex items-center gap-2 mt-1 ml-14 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-semibold">Exceeds capacity!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        {existingAssignments.length === 0?
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedEngineers).length === 0 || submitting}
          className="py-2 px-6 bg-[#1a1b26] hover:bg-[black] text-[#e4ddbc] cursor-pointer font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating Project..." : "Create Project"}
        </button>:
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedEngineers).length === 0 || submitting}
          className="py-2 px-6 bg-[#1a1b26] hover:bg-[black] text-[#e4ddbc] cursor-pointer font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Adding..." : "Add"}
        </button>}

      </div>
    </div>
  );
};

export default AssigneeSelector;