import { AlertTriangle } from "lucide-react";
import { type HealthIssue } from "../constants";
import { getIssueTypeIcon, getSeverityColor, formatDate } from "../utils";

interface IssueListProps {
  issues: HealthIssue[];
  maxItems?: number;
}

export const IssueList = ({ issues, maxItems = 5 }: IssueListProps) => {
  const displayIssues = issues.slice(0, maxItems);

  return (
    <div className="space-y-2">
      {displayIssues.map((issue) => (
        <div
          key={issue.id}
          className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">{getIssueTypeIcon(issue.type)}</div>
            <div>
              <p className="font-medium text-sm">{issue.description}</p>
              <p className="text-xs text-muted-foreground">
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
