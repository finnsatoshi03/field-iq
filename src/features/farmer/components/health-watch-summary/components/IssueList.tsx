import { AlertTriangle, FileText, Skull } from "lucide-react";
import { type HealthIssue } from "../constants";
import { formatDate, getSeverityColor } from "../utils";

interface IssueListProps {
  issues: HealthIssue[];
  maxItems?: number;
}

const getIssueTypeIcon = (type: string) => {
  switch (type) {
    case "sick":
      return <AlertTriangle className="size-4 text-orange-500" />;
    case "mortality":
      return <Skull className="size-4 text-red-500" />;
    case "notes":
      return <FileText className="size-4 text-blue-500" />;
    default:
      return <AlertTriangle className="size-4 text-gray-500" />;
  }
};

export const IssueList = ({ issues, maxItems = 5 }: IssueListProps) => {
  const displayIssues = issues.slice(0, maxItems);

  return (
    <div className="space-y-2">
      {displayIssues.map((issue) => (
        <div
          key={issue.id}
          className="flex justify-between p-3 rounded-md border-black/20 border"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">{getIssueTypeIcon(issue.type)}</div>
            <div>
              <p className="font-medium font-display text-sm">
                {issue.description}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {formatDate(issue.date)} • Count: {issue.count}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(issue.severity)}`}
            >
              {issue.severity}
            </span>
            {issue.severity === "high" && (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>
      ))}

      {issues.length > maxItems && (
        <div className="text-center text-xs text-muted-foreground py-2">
          +{issues.length - maxItems} more issues
        </div>
      )}
    </div>
  );
};
