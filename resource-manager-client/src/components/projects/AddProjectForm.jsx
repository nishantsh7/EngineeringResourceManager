import { useState } from 'react';

// Add isEditMode to the props to handle the "Save Changes" button text
const AddProjectForm = ({ projectData, setProjectData, onFormComplete, onCancel, isEditMode = false }) => {
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProjectData(prevData => ({
      ...prevData,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!projectData.name?.trim()) newErrors.name = 'Title is required.';
     if (!projectData.dueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else if (new Date(projectData.dueDate) < new Date(today)) {
      // Also check if the selected date is before today.
      newErrors.dueDate = 'Due date cannot be in the past.';
    }
    if (!projectData.startDate) {
      newErrors.startDate = 'Start date is required.';
    } else if (new Date(projectData.startDate) < new Date(today)) {
      // Also check if the selected date is before today.
      newErrors.startDate = 'Start date cannot be in the past.';
    }
    if (!projectData.description?.trim()) newErrors.description = 'Description is required.';
    if (!projectData.tags?.trim()) newErrors.tags = 'Add reuiqred skills or tags.';
    if (!projectData.acceptanceCriteria?.trim()) newErrors.acceptanceCriteria = 'Acceptance criteria are required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    if (isEditMode) {
        onFormComplete(projectData);
    } else {
        onFormComplete(); 
    }
  };
  const getInputStyles = (fieldName) => {
    const baseStyles = "mt-1 block w-full bg-transparent border-b-2 focus:outline-none p-2 text-[#EAEAEA] placeholder:text-[#242635] focus:ring-0";
    return errors[fieldName] 
      ? `${baseStyles} border-red-500 focus:border-red-500` 
      : `${baseStyles} border-[#1a1b26] focus:border-white`;
  };

  const errorTextClasses = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-[#84858c]">Title</label>
          <input type="text" id="name" value={projectData.name || ''} onChange={handleChange} required placeholder="e.g., Implement new dashboard UI" className={getInputStyles('name')} />
          {errors.name && <p className={errorTextClasses}>{errors.name}</p>}
        </div>

        {/* Priority */}
        <div className="sm:col-span-2">
          <label htmlFor="priority" className="block text-sm font-medium text-[#84858c]">Priority</label>
          <select id="priority" value={projectData.priority || 'Medium'} onChange={handleChange} className={`${getInputStyles('priority')} bg-[#1E1E1E]`}>
            <option className="bg-[#1E1E1E]">High</option>
            <option className="bg-[#1E1E1E]">Medium</option>
            <option className="bg-[#1E1E1E]">Low</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-[#84858c]">Start Date</label>
          <input type="date" id="startDate" value={projectData.startDate || ''} onChange={handleChange} min={today} className={`${getInputStyles('startDate')} [color-scheme:dark]`} />
          {errors.startDate && <p className={errorTextClasses}>{errors.startDate}</p>}
        </div>

        {/* Due Date */}
         <div className="sm:col-span-1">
          <label htmlFor="dueDate" className="block text-sm font-medium text-[#84858c]">Due Date</label>
          {/* --- 3. The 'min' attribute is added here --- */}
          {/* This prevents users from selecting a past date in the date picker UI. */}
          <input type="date" id="dueDate" value={projectData.dueDate || ''} onChange={handleChange} min={today} className={`${getInputStyles('dueDate')} [color-scheme:dark]`} />
          {errors.dueDate && <p className={errorTextClasses}>{errors.dueDate}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-[#84858c]">Description</label>
          <textarea id="description" value={projectData.description || ''} onChange={handleChange} rows={2} className={getInputStyles('description')} placeholder="Summarize the task" />
          {errors.description && <p className={errorTextClasses}>{errors.description}</p>}
        </div>

        {/* Acceptance Criteria */}
        <div className="sm:col-span-2">
          <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-[#84858c]">Acceptance Criteria</label>
          <textarea id="acceptanceCriteria" value={projectData.acceptanceCriteria || ''} onChange={handleChange} rows={2} className={getInputStyles('acceptanceCriteria')} placeholder="- UI matches the design file&#10;- All buttons are functional" />
          {errors.acceptanceCriteria && <p className={errorTextClasses}>{errors.acceptanceCriteria}</p>}
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-[#84858c]">Skills / Tags</label>
          <input type="text" id="tags" value={projectData.tags || ''} onChange={handleChange} className={getInputStyles('tags')} placeholder="frontend, bugfix, UI (comma-separated)" />
          {errors.tags && <p className={errorTextClasses}>{errors.tags}</p>}
      </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onCancel} className="py-2 cursor-pointer px-4 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] font-semibold rounded-lg">
              Cancel
          </button>
          <button type="submit" className="py-2 px-4 cursor-pointer bg-[#1a1b26] hover:bg-[black] text-[#e4ddbc] font-semibold rounded-lg">
              {isEditMode ? 'Save Changes' : 'Add Assignees'}
          </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
