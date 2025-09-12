import { useParams, Link } from 'react-router-dom';
import { useEngineerProfile } from '../hooks/useEngineerProfile';

// A helper component for the back arrow icon
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const CapacityBar = ({ allocated, capacity }) => {
  const percentage = capacity > 0 ? (allocated / capacity) * 100 : 0;
  let barColor = 'bg-emerald-500'; // Default to green
  if (percentage > 80) barColor = 'bg-[#e4ddbc]';
  if (percentage >= 100) barColor = 'bg-red-400';

  return (
    <div className="w-full bg-[#1a1d23] rounded-full h-2 border border-[#2a3038]">
      <div 
        className={`${barColor} h-2 rounded-full transition-all duration-300 ease-in-out shadow-sm`} 
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

const EngineerProfilePage = () => {
  const { engineerId } = useParams();
  const { engineer, assignedProjects, loading, error } = useEngineerProfile(engineerId);

  // Back arrow icon component
  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#e4ddbc] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#8b949e] text-sm">Loading engineer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-red-400 text-sm">Error: {error.message}</p>
      </div>
    );
  }

  if (!engineer) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-[#8b949e] text-sm">Engineer not found.</p>
      </div>
    );
  }

  // Calculate the total allocated hours and capacity percentage
  const totalAllocatedHours = assignedProjects.reduce((sum, project) => sum + project.allocatedHours, 0);
  const capacityPercentage = engineer.capacity > 0 ? (totalAllocatedHours / engineer.capacity) * 100 : 0;

  // Determine status based on capacity
  let statusColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  let statusText = 'Available';
  
  if (capacityPercentage > 80) {
    statusColor = 'text-[#e4ddbc] bg-[#e4ddbc]/10 border-[#e4ddbc]/20';
    statusText = 'Near Capacity';
  }
  if (capacityPercentage >= 100) {
    statusColor = 'text-red-400 bg-red-400/10 border-red-400/20';
    statusText = 'Overloaded';
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div>
        <Link 
          to="/team" 
          className="inline-flex items-center text-sm font-medium text-[#e4ddbc] hover:text-[#e4ddbc]/80 transition-colors duration-200"
        >
          <BackIcon />
          Back to Team Capacity
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-[#101010]  border border-[#1a1f29] rounded-xl p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#e4ddbc] border-2 border-[#1E1E1E] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-800">
              {engineer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Engineer Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-white">{engineer.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                {statusText}
              </span>
            </div>
            <p className="text-[#8b949e] mb-4">{engineer.email}</p>
            
            {/* Capacity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1a1f29] rounded-lg p-4">
                <div className="text-[#8b949e] text-sm mb-1">Total Workload</div>
                <div className="text-xl font-semibold text-white">
                  {totalAllocatedHours} / {engineer.capacity} hrs
                </div>
              </div>
              <div className="bg-[#1a1f29] rounded-lg p-4">
                <div className="text-[#8b949e] text-sm mb-1">Capacity Used</div>
                <div className="text-xl font-semibold text-white">
                  {capacityPercentage.toFixed(0)}%
                </div>
              </div>
              <div className="bg-[#1a1f29] rounded-lg p-4">
                <div className="text-[#8b949e] text-sm mb-1">Available Hours</div>
                <div className="text-xl font-semibold text-white">
                  {Math.max(0, engineer.capacity - totalAllocatedHours)} hrs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#8b949e] text-sm">Weekly Capacity</span>
            <span className="text-[#8b949e] text-sm">{capacityPercentage.toFixed(1)}%</span>
          </div>
          <CapacityBar allocated={totalAllocatedHours} capacity={engineer.capacity} />
        </div>
      </div>

      {/* Assigned Projects Card */}
      <div className="bg-[#101010]  border border-[#1a1f29] rounded-xl">
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
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-lg mb-1">
                      {project.projectName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                      <span>Weekly Allocation</span>
                      <div className="w-2 h-2 rounded-full bg-[#e4ddbc]"></div>
                      <span>{project.allocatedHours} hours</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white mb-1">
                      {project.allocatedHours} hrs
                    </div>
                    <div className="text-[#8b949e] text-xs">
                      {engineer.capacity > 0 ? ((project.allocatedHours / engineer.capacity) * 100).toFixed(0) : 0}% of capacity
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#1a1f29] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-white font-medium mb-2">No Projects Assigned</h3>
              <p className="text-[#8b949e] text-sm">
                This engineer is currently available for new project assignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineerProfilePage;
