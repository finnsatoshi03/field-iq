import React from "react";
import { AlertTriangle, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Visit } from "../constants";
import {
  getOverdueVisits,
  formatVisitDate,
  getPriorityBadgeColor,
} from "../utils";
import { cn } from "@/lib/utils";
import DirectionsButton from "./DirectionsButton";

interface OverdueVisitsProps {
  visits: Visit[];
  className?: string;
}

const VisitItem: React.FC<{ visit: Visit }> = ({ visit }) => {
  const { dateString, timeString } = formatVisitDate(visit.scheduledDate);

  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex gap-2 mb-1">
                <h4 className="font-display font-medium text-sm tracking-tight">
                  {visit.farmName}
                </h4>
                <Badge
                  className={cn(
                    "text-[10px] px-2 mt-0.5 h-fit py-0 rounded-sm",
                    getPriorityBadgeColor(visit.priority)
                  )}
                >
                  {visit.priority}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {visit.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {visit.contactPerson}
                  </span>
                </div>
                {visit.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {visit.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
              <div>
                <span className="text-xs font-medium text-foreground font-sans">
                  {dateString}
                </span>
                <br />
                <span className="text-xs text-muted-foreground font-sans">
                  {timeString}
                </span>
              </div>
              <DirectionsButton visit={visit} variant="ghost" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MoreButton: React.FC<{ count: number }> = ({ count }) => (
  <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 px-3 py-2 cursor-pointer hover:border-muted-foreground/50 transition-colors">
    <div className="flex items-center justify-center">
      <span className="text-sm text-muted-foreground font-sans">
        +{count} more overdue
      </span>
    </div>
  </div>
);

const OverdueVisits: React.FC<OverdueVisitsProps> = ({ visits, className }) => {
  const overdueVisits = getOverdueVisits(visits);
  const visibleOverdue = overdueVisits.slice(0, 3);
  const remainingOverdue = overdueVisits.slice(3);

  if (overdueVisits.length === 0) {
    return (
      <div
        className={cn("bg-card rounded-lg border border-border p-4", className)}
      >
        <div className="mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Overdue Follow-ups
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm">
            No overdue visits! Great job staying on track.
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
            Overdue Follow-ups
          </h3>
          <Badge className="bg-red-600 text-red-50 text-xs">
            {overdueVisits.length} overdue
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Visits that need immediate attention
        </p>
      </div>

      <div className="space-y-3">
        {visibleOverdue.map((visit) => (
          <VisitItem key={visit.id} visit={visit} />
        ))}

        {remainingOverdue.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <MoreButton count={remainingOverdue.length} />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Overdue Visits</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {overdueVisits.map((visit) => (
                  <VisitItem key={visit.id} visit={visit} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default OverdueVisits;
