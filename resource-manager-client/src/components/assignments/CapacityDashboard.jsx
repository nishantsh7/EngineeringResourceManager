import { useMemo } from 'react';
import { useEngineers } from '../../hooks/useEngineers';
import { useAssignments } from '../../hooks/useAssignments';
import { Link } from 'react-router-dom';

// A helper component for the progress bar with new styling
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

// Status badge component
const StatusBadge = ({ allocated, capacity }) => {
  const percentage = capacity > 0 ? (allocated / capacity) * 100 : 0;
  let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let status = 'Available';
  
  if (percentage > 80) {
    badgeStyle = 'bg-[#e4ddbc]/10 text-[#e4ddbc] border-[#e4ddbc]/20';
    status = 'Near Capacity';
  }
  if (percentage >= 100) {
    badgeStyle = 'bg-red-400/10 text-red-400 border-red-400/20';
    status = 'Overloaded';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      {status}
    </span>
  );
};

const CapacityDashboard = () => {
  // 1. Fetch all engineers and all assignments from our hooks
  const { engineers, loading: engineersLoading, error: engineersError } = useEngineers();
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments();
  console.log('Engineers:', engineers);
  console.log('Assignments:', assignments);

  // 2. Perform the capacity calculation.
  // We use `useMemo` as a performance optimization. This calculation will only
  // re-run when the 'engineers' or 'assignments' data actually changes.
  const engineerWorkloads = useMemo(() => {
    if (!engineers || !assignments) return [];

    // Create a map to easily look up an engineer's total hours
    const assignmentMap = new Map();
    assignments.forEach(assignment => {
      const currentHours = assignmentMap.get(assignment.userId) || 0;
      assignmentMap.set(assignment.userId, currentHours + assignment.allocatedHours);
    });

    // Map over the engineers list and add their calculated workload
    return engineers.map(engineer => ({
      ...engineer,
      allocatedHours: assignmentMap.get(engineer.id) || 0,
    }));
  }, [engineers, assignments]);

  // Handle loading and error states for both data sources
  if (engineersLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-[#0f1419] rounded-2xl border border-[#1a1f29]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#e4ddbc] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#8b949e] text-sm">Loading team capacity data...</p>
        </div>
      </div>
    );
  }
  
  if (engineersError || assignmentsError) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-[#0f1419] rounded-2xl border border-red-900/20">
        <p className="text-red-400 text-sm">Error loading data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-[#8b949e]">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Available</span>
          <div className="w-2 h-2 rounded-full bg-[#e4ddbc]"></div>
          <span>Near Capacity</span>
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span>Overloaded</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {engineerWorkloads.map((engineer) => {
          const percentage = engineer.capacity > 0 ? (engineer.allocatedHours / engineer.capacity) * 100 : 0;
          
          return (
            <div 
              key={engineer.id}
              className="bg-[#0f1419] border border-[#1a1f29] rounded-xl p-6 hover:border-[#e4ddbc]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#e4ddbc]/5"
            >
              {/* Engineer Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg mb-1">{engineer.name}</h3>
                  <p className="text-[#8b949e] text-sm">{engineer.email}</p>
                </div>
                <StatusBadge allocated={engineer.allocatedHours} capacity={engineer.capacity} />
              </div>

              {/* Capacity Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8b949e] text-sm">Workload</span>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {engineer.allocatedHours} / {engineer.capacity} hrs
                    </div>
                    <div className="text-[#8b949e] text-xs">
                      {percentage.toFixed(0)}% utilized
                    </div>
                  </div>
                </div>
                
                <CapacityBar allocated={engineer.allocatedHours} capacity={engineer.capacity} />
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-[#1a1f29]">
                <Link 
                  to={`/team/${engineer.id}`} 
                  className="inline-flex items-center text-sm font-medium text-[#e4ddbc] hover:text-[#e4ddbc]/80 transition-colors duration-200"
                >
                  View Details
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="sr-only">, {engineer.name}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f1419] border border-[#1a1f29] rounded-xl p-4">
          <div className="text-[#8b949e] text-sm mb-1">Total Engineers</div>
          <div className="text-2xl font-semibold text-white">{engineerWorkloads.length}</div>
        </div>
        <div className="bg-[#0f1419] border border-[#1a1f29] rounded-xl p-4">
          <div className="text-[#8b949e] text-sm mb-1">Available Capacity</div>
          <div className="text-2xl font-semibold text-emerald-400">
            {engineerWorkloads.reduce((acc, eng) => acc + (eng.capacity - eng.allocatedHours), 0)} hrs
          </div>
        </div>
        <div className="bg-[#0f1419] border border-[#1a1f29] rounded-xl p-4">
          <div className="text-[#8b949e] text-sm mb-1">Overloaded</div>
          <div className="text-2xl font-semibold text-red-400">
            {engineerWorkloads.filter(eng => eng.allocatedHours > eng.capacity).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityDashboard;