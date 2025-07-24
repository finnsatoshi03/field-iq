import ExpandableCard from "@/components/ui/expandable-card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
  DailyPlanner,
  NextVisits,
  OverdueVisits,
  ScheduleCalendar,
} from "./components";
import { useVisitSchedule } from "./hooks";
import { getOverdueVisits, transformApiDataToVisits } from "./utils";

interface VisitScheduleProps {
  className?: string;
  userId: number;
}

const VisitSchedule: React.FC<VisitScheduleProps> = ({ className, userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Fetch data using our hook
  const {
    data: visitData,
    isLoading,
    error,
    refetch,
  } = useVisitSchedule(userId);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Loading state
  if (isLoading) {
    const summaryContent = (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading schedule...</span>
      </div>
    );

    return (
      <ExpandableCard
        title="My Visit Schedule"
        summary={summaryContent}
        className="sm:h-fit"
      >
        <div className="h-32 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading visit schedule...</p>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Error state
  if (error) {
    const summaryContent = (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Error loading schedule</span>
      </div>
    );

    return (
      <ExpandableCard
        title="My Visit Schedule"
        summary={summaryContent}
        className="sm:h-fit"
      >
        <div className="h-32 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load schedule: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Transform API data to the format expected by components
  const visits = visitData ? transformApiDataToVisits(visitData.data) : [];
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
      {/* Show empty state if no visits */}
      {visits.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-display font-medium text-foreground mb-2">
            No visits scheduled
          </h3>
          <p className="text-sm text-muted-foreground">
            Your visit schedule is empty. New visits will appear here once
            scheduled.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
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
