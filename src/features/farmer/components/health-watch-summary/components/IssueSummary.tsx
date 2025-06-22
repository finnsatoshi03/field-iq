import { type HealthSummary } from "../constants";
import { getIssueTypeIcon } from "../utils";

interface IssueSummaryProps {
  summary: HealthSummary;
}

export const IssueSummary = ({ summary }: IssueSummaryProps) => {
  const issueTypes = [
    {
      type: "sick",
      count: summary.sickCount,
      icon: getIssueTypeIcon("sick"),
      label: "Sick",
    },
    {
      type: "mortality",
      count: summary.mortalityCount,
      icon: getIssueTypeIcon("mortality"),
      label: "Mortality",
    },
    {
      type: "notes",
      count: summary.notesCount,
      icon: getIssueTypeIcon("notes"),
      label: "Notes",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {issueTypes.map(({ type, count, icon, label }) => (
        <div
          key={type}
          className="text-center p-3 rounded-lg bg-muted/20 border"
        >
          <div className="text-lg mb-1">{icon}</div>
          <div className="text-lg font-bold text-blue-600">{count}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
};
