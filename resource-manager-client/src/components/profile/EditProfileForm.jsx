import { useState } from 'react';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';

const EditProfileForm = ({ engineer, onUpdateComplete }) => {
  const [name, setName] = useState(engineer.name);
  const [skills, setSkills] = useState(engineer.skills.join(', ')); 
  const [duration, setDuration] = useState(engineer.duration);


  const { updateProfile, isLoading, error } = useUpdateProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { name, skills, duration};
    const success = await updateProfile(engineer.id, updateData);
    if (success) {
      onUpdateComplete();
    }
  };

  const inputStyles = "mt-2 block w-full bg-transparent border-b-2 border-[#1a1b26] focus:border-white focus:outline-none p-2 text-white placeholder:text-[#84858c]";
  const selectStyles = `${inputStyles} bg-[#101010] rounded-md`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-[#84858c]" htmlFor="name">Full Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputStyles} />
      </div>
      
      <div>
        <label className="text-sm font-medium text-[#84858c]" htmlFor="skills">Skills (comma-separated)</label>
        <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className={inputStyles} />
      </div>
        <div>
          <label className="text-sm font-medium text-[#84858c]" htmlFor="duration">Availability</label>
          <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className={selectStyles}>
            <option value="full-time" className="bg-[#1a1b26]">Full-time</option>
            <option value="part-time" className="bg-[#1a1b26]">Part-time</option>
          </select>
        </div>
      
      
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onUpdateComplete} disabled={isLoading} className="py-2 px-4 bg-[#2D2D2D] hover:bg-[#3f3f3f] text-[#EAEAEA] font-semibold rounded-lg disabled:opacity-50 cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="py-2 px-4 bg-[#1a1b26] hover:bg-black text-[#e4ddbc] font-semibold rounded-lg disabled:opacity-50 cursor-pointer">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
