import React from "react";
import { Calendar, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Visit } from "../constants";
import {
  getUpcomingVisits,
  formatTimeOnly,
  getDayOfWeekLabel,
  formatDateOnly,
  getPriorityBadgeColor,
} from "../utils";
import { cn } from "@/lib/utils";
import DirectionsButton from "./DirectionsButton";

interface NextVisitsProps {
  visits: Visit[];
  className?: string;
}

const VisitCard: React.FC<{ visit: Visit }> = ({ visit }) => {
  const timeString = formatTimeOnly(visit.scheduledDate);

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center mr-3 relative">
        <div className="w-12 h-12 rounded-lg bg-muted/50 flex-shrink-0 flex items-center justify-center">
          <span className="text-xs font-medium text-foreground font-sans">
            {timeString}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-display font-medium text-sm tracking-tight truncate">
                {visit.farmName}
              </h4>
              <Badge
                className={cn(
                  "text-[10px] px-2 h-fit py-0 rounded-sm",
                  getPriorityBadgeColor(visit.priority)
                )}
              >
                {visit.priority}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {visit.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {visit.contactPerson}
                </span>
              </div>
              {visit.notes && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {visit.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <DirectionsButton visit={visit} variant="ghost" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DateSection: React.FC<{ date: Date; visits: Visit[] }> = ({
  date,
  visits,
}) => {
  const dayLabel = getDayOfWeekLabel(date);
  const dateString = formatDateOnly(date);
  const isToday = dayLabel === "Today";
  const isTomorrow = dayLabel === "Tomorrow";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-sm font-medium font-sans",
                isToday && "text-blue-600 dark:text-blue-400",
                isTomorrow && "text-green-600 dark:text-green-400"
              )}
            >
              {dayLabel}
            </span>
            {!isToday && !isTomorrow && (
              <span className="text-xs text-muted-foreground font-sans">
                {dateString}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 h-px bg-border" />
        <Badge variant="outline" className="text-xs">
          {visits.length} visit{visits.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-3 pl-6">
        {visits.map((visit, index) => (
          <div
            key={visit.id}
            className={cn(
              "relative",
              index < visits.length - 1 &&
                "after:content-[''] after:absolute after:left-[-12px] after:top-12 after:w-px after:h-4 after:bg-border"
            )}
          >
            <VisitCard visit={visit} />
          </div>
        ))}
      </div>
    </div>
  );
};

const NextVisits: React.FC<NextVisitsProps> = ({ visits, className }) => {
  const upcomingVisits = getUpcomingVisits(visits);

  // Group visits by date
  const visitsByDate = upcomingVisits.reduce(
    (acc, visit) => {
      const dateKey = visit.scheduledDate.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(visit);
      return acc;
    },
    {} as Record<string, Visit[]>
  );

  const sortedDates = Object.keys(visitsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (upcomingVisits.length === 0) {
    return (
      <div
        className={cn("bg-card rounded-lg border border-border p-4", className)}
      >
        <div className="mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Next Visits
          </h3>
        </div>
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <div className="text-muted-foreground text-sm">
            No upcoming visits scheduled
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("bg-card rounded-lg border border-border p-4", className)}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Next Visits
          </h3>
          <Badge variant="outline" className="text-xs">
            {upcomingVisits.length} scheduled
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Upcoming farm visits and appointments
        </p>
      </div>

      <div className="space-y-6">
        {sortedDates.slice(0, 3).map((dateKey) => (
          <DateSection
            key={dateKey}
            date={new Date(dateKey)}
            visits={visitsByDate[dateKey]}
          />
        ))}

        {sortedDates.length > 3 && (
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">
              +{sortedDates.length - 3} more day
              {sortedDates.length - 3 > 1 ? "s" : ""} with visits
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextVisits;
