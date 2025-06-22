import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { SeverityLevel, IssueTypeKey } from "../constants";
import { SEVERITY_LEVELS, ISSUE_TYPES } from "../constants";
import { getIssueTypeLabel } from "../utils";

interface FilterControlsProps {
  selectedSeverity?: SeverityLevel;
  selectedIssueType?: IssueTypeKey;
  onSeverityChange: (severity?: SeverityLevel) => void;
  onIssueTypeChange: (issueType?: IssueTypeKey) => void;
  className?: string;
}

const FilterControls = ({
  selectedSeverity,
  selectedIssueType,
  onSeverityChange,
  onIssueTypeChange,
  className,
}: FilterControlsProps) => {
  const handleClearFilters = () => {
    onSeverityChange(undefined);
    onIssueTypeChange(undefined);
  };

  const hasActiveFilters = selectedSeverity || selectedIssueType;

  return (
    <div className={`space-y-4 ${className}`}>
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-sans">
            Active filters
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-6 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Severity Filter */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-sans">
          Severity Level
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.values(SEVERITY_LEVELS).map((severity) => (
            <Badge
              key={severity}
              variant={selectedSeverity === severity ? "default" : "outline"}
              className={`cursor-pointer text-xs transition-all hover:scale-105 ${
                selectedSeverity === severity
                  ? "bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
              onClick={() =>
                onSeverityChange(
                  selectedSeverity === severity ? undefined : severity
                )
              }
            >
              {severity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Issue Type Filter */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-sans">
          Issue Type
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.values(ISSUE_TYPES).map((issueType) => (
            <Badge
              key={issueType}
              variant={selectedIssueType === issueType ? "default" : "outline"}
              className={`cursor-pointer text-xs transition-all hover:scale-105 ${
                selectedIssueType === issueType
                  ? "bg-foreground text-background"
                  : "hover:bg-muted"
              }`}
              onClick={() =>
                onIssueTypeChange(
                  selectedIssueType === issueType ? undefined : issueType
                )
              }
            >
              {getIssueTypeLabel(issueType)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-border">
          <div className="space-y-2">
            {selectedSeverity && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground font-sans">
                  {selectedSeverity} severity
                </span>
              </div>
            )}
            {selectedIssueType && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground font-sans">
                  {getIssueTypeLabel(selectedIssueType)} issues
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
