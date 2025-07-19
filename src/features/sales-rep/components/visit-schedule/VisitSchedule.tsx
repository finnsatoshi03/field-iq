import ExpandableCard from "@/components/ui/expandable-card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import {
  DailyPlanner,
  NextVisits,
  OverdueVisits,
  ScheduleCalendar,
} from "./components";
import { mockVisits } from "./constants";
import { getOverdueVisits } from "./utils";

interface VisitScheduleProps {
  className?: string;
}

const VisitSchedule: React.FC<VisitScheduleProps> = ({ className }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [visits] = useState(mockVisits);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const overdueVisits = getOverdueVisits(visits);

  // Summary content - show overdue count or success message
  const summaryContent = (
    <div className="flex items-center gap-4">
      {overdueVisits.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">
              {overdueVisits.length} overdue visit
              {overdueVisits.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Need immediate attention
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">
              No overdue visits
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Great job staying on track!
          </div>
        </>
      )}
    </div>
  );

  // Full content
  const fullContent = (
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

  return (
    <ExpandableCard
      title="My Visit Schedule"
      summary={summaryContent}
      className="sm:h-fit"
    >
      {fullContent}
    </ExpandableCard>
  );
};

export default VisitSchedule;
