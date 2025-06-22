import React, { useState } from "react";
import {
  ScheduleCalendar,
  OverdueVisits,
  NextVisits,
  DailyPlanner,
} from "./components";
import { mockVisits } from "./constants";
import { cn } from "@/lib/utils";

interface VisitScheduleProps {
  className?: string;
}

const VisitSchedule: React.FC<VisitScheduleProps> = ({ className }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [visits] = useState(mockVisits);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr] gap-6">
        {/* Left Column - Calendar and Overdue */}
        <div className="space-y-6">
          <ScheduleCalendar
            visits={visits}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          <OverdueVisits visits={visits} />
        </div>

        {/* Right Column - Next Visits and Daily Planner */}
        <div className="space-y-6">
          <NextVisits visits={visits} />
          <DailyPlanner />
        </div>
      </div>

      {/* Mobile-optimized stacked view on smaller screens */}
      <div className="lg:hidden">
        <div className="text-xs text-muted-foreground text-center py-2">
          Swipe or scroll to view all sections
        </div>
      </div>
    </div>
  );
};

export default VisitSchedule;
