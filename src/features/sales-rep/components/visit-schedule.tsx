import React from "react";
import VisitSchedule from "./visit-schedule/VisitSchedule";

const VisitScheduleWrapper: React.FC = () => {
  return (
    <div className="bg-card space-y-6 rounded-lg border border-border p-4">
      <div>
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
          My Visit Schedule
        </h3>
      </div>
      <VisitSchedule />
    </div>
  );
};

export default VisitScheduleWrapper;
