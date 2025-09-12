import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useCreateProject } from '../hooks/useCreateProject';
import { useManageProject } from '../hooks/useManageProject';
import usePersistentState from '../hooks/usePersistentState';

// Import all the UI components this page will control
import Modal from '../components/ui/Modal';
import ConfirmDelete from '../components/projects/ConfirmDelete';
import ProjectList from '../components/projects/ProjectList';
import AddProjectForm from '../components/projects/AddProjectForm';
import AssigneeSelector from '../components/projects/AssigneeSelect';
import ManageAssignments from '../components/assignments/ManageAssignments';
import MyAssignmentsList from '../components/assignments/MyAssignmentsList';

const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#edeef4" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );
const initialProjectState = { name: '', description: '', acceptanceCriteria: '', priority: 'Medium', dueDate: '', tags: '' };

const DashboardPage = () => {
  const { profile } = useAuthStore();
  const { createProject, isLoading: isCreating } = useCreateProject();
  const { updateProject, deleteProject, isLoading: isManaging } = useManageProject();

  // --- State for controlling all modals ---
  const [modalView, setModalView] = useState(null); // Can be 'add', 'manage', 'edit', or 'delete'
  const [selectedProject, setSelectedProject] = useState(null);

  // Persistent state specifically for the multi-step "Add Project" flow
  const [modalStep, setModalStep] = usePersistentState('projectModal_step', 1);
  const [projectData, setProjectData] = usePersistentState('projectModal_data', initialProjectState);

  // --- Handler Functions ---

  // Opens a modal and sets which one to show and which project is selected (if any)
  const handleOpenModal = (view, project = null) => {
    setSelectedProject(project);
    setModalView(view);
  };

  // Closes any active modal and cleans up state
  const handleCloseModal = () => {
    setModalView(null);
    setSelectedProject(null);
    if (modalView === 'add') {
      setTimeout(() => {
        setProjectData(initialProjectState);
        setModalStep(1);
      }, 300);
    }
  };

  // Handles the final submission of a new project
  const handleCreateSubmit = async (assignments) => {
   const finalData = { 
  ...projectData, 
  tags: projectData.tags.split(',').map(tag => tag.trim()).filter(Boolean), 
  assignments  // Pass the full assignment objects with hours
};
    const success = await createProject(finalData);
    if (success) handleCloseModal();
  };
  
  // Handles submitting an updated project
  const handleUpdateSubmit = async (updatedDataFromForm) => {
    // We need to handle the fact that the form state might be different from the original project state
    const finalUpdateData = {
        ...updatedDataFromForm,
        tags: updatedDataFromForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    const success = await updateProject(selectedProject.id, finalUpdateData);
    if (success) handleCloseModal();
  };

  // Handles confirming the deletion of a project
  const handleDeleteConfirm = async () => {
    const success = await deleteProject(selectedProject.id);
    if (success) handleCloseModal();
  };

  return (
    // This is a React Fragment, as the parent layout provides the main container
    <>
      <header className="flex justify-between items-center mb-8">
        <div className="relative">
          <input type="text" placeholder="Search" className="bg-[#181818] rounded-lg py-2 pl-10 pr-4 w-full max-w-xs text-[#edeef4] focus:outline-none" />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
        </div>
        <div 
          className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0 bg-[#e4ddbc] border-2 border-[#1E1E1E]"
        >
          {/* Add a check for assignee.name before using it */}
          <span className="font-bold text-xs text-gray-800">
            {profile.name ? profile.name.charAt(0) : '?'}
          </span>
        </div>
      </header>
      
      <div>
        {profile?.role === 'Manager' && (
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
              <h2 className="text-2xl font-semibold text-white">Projects</h2>
              <button onClick={() => handleOpenModal('add')} className="py-2 px-4 bg-transparent text-[#e4ddbc] cursor-pointer font-bold rounded-lg">
                + Add New Project
              </button>
            </div>
            {/* Pass all the necessary handlers down to the ProjectList */}
            <ProjectList 
              onManageClick={(p) => handleOpenModal('manage', p)} 
              onEditClick={(p) => handleOpenModal('edit', p)} 
              onDeleteClick={(p) => handleOpenModal('delete', p)} 
            />
          </section>
        )}
        {profile?.role === 'Engineer' && <MyAssignmentsList />}
      </div>

      {/* A single Modal component that intelligently renders the correct content */}
      <Modal isOpen={!!modalView} onClose={handleCloseModal} title={
          modalView === 'add' ? (modalStep === 1 ? 'Add New Project' : 'Add Assignees') :
          modalView === 'edit' ? `Edit: "${selectedProject?.name}"` :
          modalView === 'manage' ? `Manage: "${selectedProject?.name}"` :
          modalView === 'delete' ? 'Confirm Deletion' : ''
        }>
        
        {modalView === 'add' && modalStep === 1 && <AddProjectForm projectData={projectData} setProjectData={setProjectData} onFormComplete={() => setModalStep(2)} onCancel={handleCloseModal} />}
        {modalView === 'add' && modalStep === 2 && <AssigneeSelector onBack={() => setModalStep(1)} onComplete={handleCreateSubmit} submitting={isCreating} />}
        {modalView === 'edit' && <AddProjectForm projectData={selectedProject} onFormComplete={handleUpdateSubmit} onCancel={handleCloseModal} isEditMode={true} />}
        {modalView === 'manage' && <ManageAssignments project={selectedProject} />}
        {modalView === 'delete' && <ConfirmDelete resourceName={selectedProject?.name} onConfirm={handleDeleteConfirm} onCancel={handleCloseModal} isDeleting={isManaging} />}
      </Modal>
    </>
  );
};

export default DashboardPage;

