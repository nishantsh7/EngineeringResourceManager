    import { useMemo } from 'react';

    const DaysLeftBar = ({ startDate, dueDate }) => {
      const { daysLeft, percentage } = useMemo(() => {
        if (!startDate || !dueDate) return { daysLeft: null, percentage: 0 };

        const start = new Date(startDate);
        const due = new Date(dueDate);
        const today = new Date();
        
        const totalDuration = Math.max(1, (due - start) / (1000 * 60 * 60 * 24));
        const elapsedDuration = Math.max(0, (today - start) / (1000 * 60 * 60 * 24));
        
        const daysRemaining = Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)));
        const progressPercentage = Math.min(100, (elapsedDuration / totalDuration) * 100);

        return { daysLeft: daysRemaining, percentage: progressPercentage };
      }, [startDate, dueDate]);

      if (daysLeft === null) return null;

      return (
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-[#A9A9A9] mb-1">
            <span>{daysLeft} days left</span>
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
    
