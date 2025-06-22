import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { type Visit } from "../constants";
import { getScheduledDates, getVisitsForDate } from "../utils";
import { cn } from "@/lib/utils";

interface ScheduleCalendarProps {
  visits: Visit[];
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  className?: string;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  visits,
  selectedDate,
  onDateSelect,
  className,
}) => {
  const scheduledDates = getScheduledDates(visits);

  const modifiers = {
    scheduled: scheduledDates,
  };

  const modifiersStyles = {
    scheduled: {
      position: "relative" as const,
      fontWeight: "bold",
    },
  };

  const modifiersClassNames = {
    scheduled:
      "relative after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full dark:after:bg-blue-400",
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect?.(date);
  };

  return (
    <div
      className={cn("bg-card rounded-lg border border-border p-4", className)}
    >
      <div className="mb-4">
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
          Visit Calendar
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Blue dots indicate scheduled visits
        </p>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        modifiersClassNames={modifiersClassNames}
        className="w-full"
        showOutsideDays={false}
      />
    </div>
  );
};

export default ScheduleCalendar;
