import { AlertTriangle, FileText, Info, Skull } from "lucide-react";
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

  // Show empty state if no issues
  if (issues.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex flex-col items-center justify-center p-6 rounded-md border-2 border-dashed border-muted-foreground/20 bg-muted/10">
          <div className="text-muted-foreground mb-2">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="text-sm font-medium text-muted-foreground text-center">
            No recent health issues
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Your flock appears to be healthy! Keep monitoring for any changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayIssues.map((issue) => (
        <div
          key={issue.id}
          className="flex flex-col p-3 rounded-md border-black/20 border bg-white"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-lg mt-0.5">
                {getIssueTypeIcon(issue.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium font-display text-sm text-foreground">
                  {issue.description}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {formatDate(issue.date)} • Count: {issue.count}
                </p>
                {issue.notes && issue.notes !== "No additional notes" && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-md">
                    <div className="flex items-start gap-2">
                      <Info className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {issue.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(issue.severity)}`}
              >
                {issue.severity}
              </span>
              {issue.severity === "high" && (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
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
