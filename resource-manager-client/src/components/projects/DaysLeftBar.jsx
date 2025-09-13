import { useMemo } from 'react';

// A new helper function to format the remaining hours into a clean string.
// This keeps our main component's JSX much cleaner.
const formatTimeLeft = (totalHours) => {
  if (totalHours <= 0) {
    return 'Past Due';
  }

  const days = Math.floor(totalHours / 24);
  const hours = Math.round(totalHours % 24);

  const dayString = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
  const hourString = hours > 0 ? `${hours} ${hours === 1 ? 'hr' : 'hrs'}` : '';

  // Join the parts with a space, and trim any leading/trailing whitespace.
  const finalString = [dayString, hourString].join(' ').trim();

  return `${finalString} left`;
};

const DaysLeftBar = ({ startDate, dueDate }) => {
  const { displayString, percentage } = useMemo(() => {
    if (!startDate || !dueDate) {
      return { displayString: 'No timeframe', percentage: 0 };
    }

    const start = new Date(startDate);
    const due = new Date(dueDate);
    const now = new Date();

    const hoursInMs = 1000 * 60 * 60;

    // --- All calculations are now based on hours for precision ---
    const totalDurationInHours = (due - start) / hoursInMs;
    const elapsedDurationInHours = (now - start) / hoursInMs;
    const remainingHours = (due - now) / hoursInMs;
    
    // Handle cases where duration is 0 to prevent division by zero
    if (totalDurationInHours <= 0) {
      return { displayString: 'Due', percentage: 100 };
    }
    
    // The progress percentage is now based on the precise passage of time
    const progressPercentage = Math.min(100, (elapsedDurationInHours / totalDurationInHours) * 100);

    // Use our helper function to get the display string
    const formattedTime = formatTimeLeft(remainingHours);

    return { displayString: formattedTime, percentage: Math.max(0, progressPercentage) };
  }, [startDate, dueDate]);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-xs text-[#A9A9A9] mb-1">
        <span>{displayString}</span>
        <span className="font-semibold">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-[#2D2D2D] rounded-full h-1.5">
        <div 
          className="bg-[#e4ddbc] h-1.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DaysLeftBar;

