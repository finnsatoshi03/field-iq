import { AlertTriangle, FileText, Skull } from "lucide-react";
import { type HealthSummary } from "../constants";

interface IssueSummaryProps {
  summary: HealthSummary;
}

export const IssueSummary = ({ summary }: IssueSummaryProps) => {
  const issueTypes = [
    {
      type: "sick",
      count: summary.sickCount,
      icon: <AlertTriangle className="size-4 text-orange-500" />,
      label: "Sick",
    },
    {
      type: "mortality",
      count: summary.mortalityCount,
      icon: <Skull className="size-4 text-red-500" />,
      label: "Mortality",
    },
    {
      type: "notes",
      count: summary.notesCount,
      icon: <FileText className="size-4 text-blue-500" />,
      label: "Notes",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {issueTypes.map(({ type, count, icon, label }) => (
        <div key={type} className="text-center p-2 rounded-md bg-muted/50">
          <div className="text-xl font-medium font-display">{count}</div>
          <div className="flex items-center justify-center gap-2">
            <div className="text-lg">{icon}</div>
            <div className="text-xs text-muted-foreground font-medium">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
