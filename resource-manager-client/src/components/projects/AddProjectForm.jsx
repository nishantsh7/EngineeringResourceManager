// // import { useState } from 'react';
// import { useCreateProject } from '../../hooks/useCreateProject';
// import usePersistentState from '../../hooks/usePersistentState';

// const AddProjectForm = ({ onProjectCreated }) => {
//   const [name, setName] = usePersistentState('addProjectForm_name', '');
//   const [description, setDescription] = usePersistentState('addProjectForm_description', '');
//   const [acceptanceCriteria, setAcceptanceCriteria] = usePersistentState('addProjectForm_criteria', '');
//   const [priority, setPriority] = usePersistentState('addProjectForm_priority', 'Medium');
//   const [dueDate, setDueDate] = usePersistentState('addProjectForm_dueDate', '');
//   const [tags, setTags] = usePersistentState('addProjectForm_tags', '');

//   const { createProject, isLoading, error } = useCreateProject();

//   // --- THIS IS THE CORRECTED FUNCTION ---
//   const clearForm = () => {
//     // 1. Define all the keys we use for this form in localStorage
//     const formKeys = [
//       'addProjectForm_name',
//       'addProjectForm_description',
//       'addProjectForm_criteria',
//       'addProjectForm_priority',
//       'addProjectForm_dueDate',
//       'addProjectForm_tags'
//     ];
//     // 2. Explicitly remove each item from localStorage
//     formKeys.forEach(key => window.localStorage.removeItem(key));

//     // 3. Reset the component's current state for an immediate UI update
//     setName('');
//     setDescription('');
//     setAcceptanceCriteria('');
//     setPriority('Medium');
//     setDueDate('');
//     setTags('');
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const projectData = {
//       name,
//       description,
//       acceptanceCriteria,
//       priority,
//       dueDate,
//       tags: tags.split(',').map(tag => tag.trim()),
//     };
//     const success = await createProject(projectData);
//    if (success) {
//       clearForm(); 
//       onProjectCreated(); 
//     }
//   };

//   const handleCancel = () => {
//     clearForm(); // Clear localStorage on cancel
//     onProjectCreated(); // Close the modal
//   };

//   // Shared styles for form inputs using direct hex codes
//   const inputStyles = "mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none  p-2 text-[#EAEAEA] placeholder:text-[#242635] focus:ring-0 focus:border-[#007AFF]";

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Reduced vertical gap for a more compact layout */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
//         {/* Title (Project Name) */}
//         <div className="sm:col-span-2">
//           <label htmlFor="name" className="block text-sm font-medium text-[#84858c]">Title</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="e.g., Implement new dashboard UI"
//             className={inputStyles}
//           />
//         </div>

//         {/* Priority */}
//         <div className="sm:col-span-1">
//           <label htmlFor="priority" className="block text-sm font-medium text-[#84858c]">Priority</label>
//           <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={`${inputStyles} bg-[#1E1E1E]`}>
//             <option className="bg-[#1E1E1E]">High</option>
//             <option className="bg-[#1E1E1E]">Medium</option>
//             <option className="bg-[#1E1E1E]">Low</option>
//           </select>
//         </div>

//         {/* Due Date */}
//         <div className="sm:col-span-1">
//           <label htmlFor="dueDate" className="block text-sm font-medium text-[#84858c]">Due Date</label>
//           <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`${inputStyles} [color-scheme:dark]`} />
//         </div>

//         {/* Description */}
//         <div className="sm:col-span-2">
//           <label htmlFor="description" className="block text-sm font-medium text-[#84858c]">Description</label>
//           <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputStyles} placeholder="Summarize the task" />
//         </div>

//         {/* Acceptance Criteria */}
//         <div className="sm:col-span-2">
//           <label htmlFor="criteria" className="block text-sm font-medium text-[#84858c]">Acceptance Criteria</label>
//           <textarea id="criteria" value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} rows={3} className={inputStyles} placeholder="- UI matches the design file&#10;- All buttons are functional&#10;- Deploys without errors" />
//         </div>

//         {/* Tags */}
//         <div className="sm:col-span-2">
//           <label htmlFor="tags" className="block text-sm font-medium text-[#84858c]">Labels / Tags</label>
//           <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className={inputStyles} placeholder="frontend, bugfix, UI (comma-separated)" />
//         </div>
//       </div>
      
//       {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      
//       {/* Reduced margin-top for a more compact layout */}
//       <div className="flex justify-end gap-4 mt-6">
//           <button type="button" onClick={handleCancel} disabled={isLoading} className="py-2 cursor-pointer px-4 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] font-semibold rounded-lg disabled:opacity-50 transition-colors">
//               Cancel
//           </button>
//           <button type="submit" disabled={isLoading} className="py-2 px-4 cursor-pointer bg-[#1a1b26] hover:bg-[black] text-[#e4ddbc] font-semibold rounded-lg disabled:opacity-50 transition-colors">
//               {isLoading ? 'Creating...' : 'Create Project'}
//           </button>
//       </div>
//     </form>
//   );
// };

// export default AddProjectForm;

import { useState } from 'react';
const AddProjectForm = ({ projectData, setProjectData, onFormComplete, onCancel }) => {
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProjectData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };
  const validate = () => {
    const newErrors = {};
    if (!projectData.name?.trim()) newErrors.name = 'Title is required.';
    if (!projectData.dueDate) newErrors.dueDate = 'Due date is required.';
    if (!projectData.description?.trim()) newErrors.description = 'Description is required.';
    if (!projectData.acceptanceCriteria?.trim()) newErrors.acceptanceCriteria = 'Acceptance criteria are required.';
    // Priority has a default, so it's always valid. Tags are optional.
    return newErrors;
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop the submission if there are errors
    }
    setErrors({}); // Clear any old errors
    onFormComplete(); 
  };
  // Shared styles for form inputs using direct hex codes
  const getInputStyles = (fieldName) => {
    const baseStyles = "mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none  p-2 text-[#EAEAEA] placeholder:text-[#242635] focus:ring-0 focus:border-[#007AFF]";
    return errors[fieldName] 
      ? `${baseStyles} border-red-500 focus:border-red-500` 
      : `${baseStyles} border-[#3D3D3D] focus:border-[#007AFF]`;
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* <div className="flex items-center gap-4 mb-4">
        <div>
            <h4 className="text-lg font-semibold text-[#EAEAEA]">Project Details</h4>
            <p className="text-sm text-[#A9A9A9]">Step 1 of 2</p>
        </div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        {/* Title (Project Name) */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-[#84858c]">Title</label>
          <input
            type="text"
            id="name"
            value={projectData.name || ''}
            onChange={handleChange} 
            required
            placeholder="e.g., Implement new dashboard UI"
            className={getInputStyles('name')}
          />
           {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Priority */}
        <div className="sm:col-span-1">
          <label htmlFor="priority" className="block text-sm font-medium text-[#84858c]">Priority</label>
          <select id="priority" value={projectData.priority || 'Medium'} onChange={handleChange} className={`${getInputStyles('priority')} bg-[#1E1E1E]`}>
            <option className="bg-[#1E1E1E]">High</option>
            <option className="bg-[#1E1E1E]">Medium</option>
            <option className="bg-[#1E1E1E]">Low</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="sm:col-span-1">
          <label htmlFor="dueDate" className="block text-sm font-medium text-[#84858c]">Due Date</label>
          <input type="date" id="dueDate" value={projectData.dueDate || ''} onChange={handleChange}  className={`${getInputStyles('dueDate')} [color-scheme:dark]`} />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-[#84858c]">Description</label>
          <textarea id="description" value={projectData.description || ''} onChange={handleChange} rows={2} className={getInputStyles('description')} placeholder="Summarize the task" />
        </div>

        {/* Acceptance Criteria */}
        <div className="sm:col-span-2">
          <label htmlFor="criteria" className="block text-sm font-medium text-[#84858c]">Acceptance Criteria</label>
          <textarea id="acceptanceCriteria" value={projectData.acceptanceCriteria || ''} onChange={handleChange} rows={3} className={getInputStyles('acceptanceCriteria')} placeholder="- UI matches the design file&#10;- All buttons are functional&#10;- Deploys without errors" />
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-[#84858c]">Labels / Tags</label>
          <input type="text" id="tags" value={projectData.tags || ''} onChange={handleChange} className={getInputStyles('tags')} placeholder="frontend, bugfix, UI (comma-separated)" />
        </div>
      </div>
      {/* Reduced margin-top for a more compact layout */}
      <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onCancel} className="py-2 cursor-pointer px-4 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] font-semibold rounded-lg disabled:opacity-50 transition-colors">
              Cancel
          </button>
          <button type="submit" className="py-2 px-4 cursor-pointer bg-[#1a1b26] hover:bg-[black] text-[#e4ddbc] font-semibold rounded-lg disabled:opacity-50 transition-colors">
              Add Assignees
          </button>
      </div>
    </form>
  );
};

export default AddProjectForm;