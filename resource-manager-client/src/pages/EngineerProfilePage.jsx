import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEngineerProfile } from '../hooks/useEngineerProfile';
import useAuthStore from '../store/authStore';
import Modal from '../components/ui/Modal';
import EditProfileForm from '../components/profile/EditProfileForm';

// Helper component for the Back Icon
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const EngineerProfilePage = () => {
    const { engineerId: paramId } = useParams();
    const { profile: loggedInUserProfile } = useAuthStore();

    const engineerId = paramId || loggedInUserProfile.id;
    const isOwnProfile = engineerId === loggedInUserProfile.id;

    // This hook now correctly provides both the engineer's profile and their assigned projects
    const { engineer, assignedProjects, loading, error } = useEngineerProfile(engineerId);
    console.log('Assigned Projects to vansh', assignedProjects);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Your excellent loading and error handling
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="w-8 h-8 border-2 border-[#e4ddbc] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (error) { return <div className="flex items-center justify-center min-h-64"><p className="text-red-400">Error: {error.message}</p></div>; }
    if (!engineer) { return <div className="flex items-center justify-center min-h-64"><p className="text-[#8b949e]">Engineer not found.</p></div>; }

    return (
        <div className="space-y-6">
            {/* "Back" link only shows for managers viewing an engineer's profile */}
            {!isOwnProfile && (
                <Link to="/team" className="inline-flex items-center text-sm font-medium text-[#e4ddbc] hover:text-[#e4ddbc]/80">
                    <BackIcon /> Back to Team Capacity
                </Link>
            )}

            {/* Main Profile Card - This is shown for everyone */}
            <div className="bg-[#101010] border border-[#1a1f29] rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#e4ddbc] flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-gray-800">{engineer.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold text-white">{engineer.name}</h1>
                                <p className="text-[#8b949e]">{engineer.email}</p>
                                <div className="mt-1 text-sm text-white capitalize">{engineer.seniority} {engineer.role}</div>
                            </div>
                            {isOwnProfile && (
                                <button onClick={() => setIsEditModalOpen(true)} className="py-2 px-4 bg-[#1a1b26] hover:bg-black text-[#e4ddbc] font-semibold rounded-lg text-sm cursor-pointer">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#1a1f29]">
                            <h3 className="text-sm font-medium text-[#8b949e]">Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {engineer.skills && engineer.skills.length > 0 ? (
                                    engineer.skills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 text-xs font-medium text-[#e4ddbc] bg-[#1a1f29] rounded-full">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-[#8b949e]">No skills listed. Click "Edit Profile" to add them.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- THIS IS THE KEY --- */}
            {/* The "Assigned Projects" card is now conditionally rendered. */}
            {/* It will ONLY show if a manager is viewing another engineer's profile. */}
            {!isOwnProfile && (
                <div className="bg-[#101010] border border-[#1a1f29] rounded-xl">
                    <div className="p-6 border-b border-[#1a1f29]">
                        <h2 className="text-lg font-semibold text-white">Assigned Projects</h2>
                        <p className="text-[#8b949e] text-sm mt-1">
                            {assignedProjects.length} project{assignedProjects.length !== 1 ? 's' : ''} assigned
                        </p>
                    </div>
                    <div className="divide-y divide-[#1a1f29]">
                        {assignedProjects.length > 0 ? (
                            assignedProjects.map(project => (
                                <div key={project.id} className="p-6 hover:bg-[#1a1f29]/30 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-white text-lg">{project.projectName}</h3>
                                        <div className="text-lg font-semibold text-white">{project.allocatedHours} hrs</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-[#8b949e] text-sm">This engineer is currently available for new assignments.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Your Profile">
                <EditProfileForm engineer={engineer} onUpdateComplete={() => setIsEditModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default EngineerProfilePage;

