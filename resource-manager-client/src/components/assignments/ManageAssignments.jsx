import { useState} from 'react';
import AssignmentList from './AssignmentList'; 
import AssigneeSelector from '../projects/AssigneeSelect'; 
import { useAssignmentsForProject } from '../../hooks/useAssignmentsForProject'; 
import { useManageAssignments } from '../../hooks/useManageAssignments';

const ManageAssignments = ({ project }) => {
  const [view, setView] = useState('list');
  const { addAssignments, updateAssignmentHours, removeAssignment, isLoading } = useManageAssignments();
  
  const { assignments } = useAssignmentsForProject(project.id);
   const handleAddAssignments = async (newAssignments) => {
    await addAssignments(project.id, newAssignments);
    setView('list'); 
  };

   return (
    <div>
      {view === 'list' && (
        <AssignmentList 
          project={project} 
          onShowAddView={() => setView('add')}
          onUpdateHours={updateAssignmentHours}
          onRemove={removeAssignment}
        />
      )}
      {view === 'add' && (
        <AssigneeSelector
          existingAssignments={assignments}
          onBack={() => setView('list')}
          onComplete={handleAddAssignments}
          submitting={isLoading} 
        />
      )}
    </div>
  );
};

export default ManageAssignments;

