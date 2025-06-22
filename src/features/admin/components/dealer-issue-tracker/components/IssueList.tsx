import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import type { DealerIssue } from "../constants";
import {
  getSeverityBadgeClass,
  getIssueTypeBadgeClass,
  getStatusBadgeClass,
  getIssueTypeLabel,
  formatDate,
  getRelativeTime,
  hasDealerGpsCoordinates,
} from "../utils";
import DealerDirectionsButton from "./DealerDirectionsButton";
import DealerDirectionsModal from "./DealerDirectionsModal";

interface IssueListProps {
  dealers: DealerIssue[];
  onDealerSelect?: (dealer: DealerIssue) => void;
  className?: string;
}

interface DealerItemProps {
  dealer: DealerIssue;
  onSelect?: (dealer: DealerIssue) => void;
}

const DealerItem = ({ dealer, onSelect }: DealerItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasGpsCoordinates = hasDealerGpsCoordinates(dealer);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect?.(dealer);
  };

  const openIssues = dealer.issues.filter(
    (issue) => issue.status !== "resolved"
  );
  const resolvedIssues = dealer.issues.filter(
    (issue) => issue.status === "resolved"
  );

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground font-display">
              {dealer.dealerName}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs ${getSeverityBadgeClass(dealer.severity)}`}
            >
              {dealer.severity.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {dealer.location.address}
            </span>
            <span>{dealer.dealerCode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* GPS Direction Buttons */}
          {hasGpsCoordinates && (
            <div className="flex items-center gap-1">
              <DealerDirectionsButton
                dealer={dealer}
                variant="ghost"
                size="sm"
              />
              <DealerDirectionsModal dealer={dealer}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  title="Detailed directions"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </DealerDirectionsModal>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground font-sans">
            <span className="font-medium">{dealer.issues.length}</span> total
            issues
          </span>
          {openIssues.length > 0 && (
            <span className="text-sm text-red-600 font-sans">
              <span className="font-medium">{openIssues.length}</span> open
            </span>
          )}
          {resolvedIssues.length > 0 && (
            <span className="text-sm text-emerald-600 font-sans">
              <span className="font-medium">{resolvedIssues.length}</span>{" "}
              resolved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-sans">
            Updated {getRelativeTime(dealer.lastUpdated)}
          </span>
          {hasGpsCoordinates && (
            <span className="text-xs text-green-600 dark:text-green-400 font-sans">
              GPS Available
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-border">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-sans">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Contact:</span>
              <span className="text-foreground">{dealer.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-sans">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{dealer.phone}</span>
            </div>
            {hasGpsCoordinates && (
              <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm font-sans">
                <span className="text-sm">🌐</span>
                <span className="text-muted-foreground">GPS:</span>
                <span className="text-foreground font-mono text-xs">
                  {dealer.location.lat.toFixed(4)},{" "}
                  {dealer.location.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          {/* Issues */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground font-sans">
              Issues Details:
            </h4>

            {dealer.issues.map((issue, index) => (
              <div key={index} className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getIssueTypeBadgeClass(issue.type)}`}
                    >
                      {getIssueTypeLabel(issue.type)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusBadgeClass(issue.status)}`}
                    >
                      {issue.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <span className="text-xs text-muted-foreground font-sans">
                    {formatDate(issue.reportedDate)}
                  </span>
                </div>

                <p className="text-sm text-foreground font-sans">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              {hasGpsCoordinates && (
                <DealerDirectionsModal dealer={dealer}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Get Detailed Directions
                  </Button>
                </DealerDirectionsModal>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSelect}
              className="text-xs"
            >
              View on Map
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const IssueList = ({ dealers, onDealerSelect, className }: IssueListProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {dealers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground font-sans">
            No dealers with issues found
          </p>
        </div>
      ) : (
        dealers.map((dealer) => (
          <DealerItem
            key={dealer.id}
            dealer={dealer}
            onSelect={onDealerSelect}
          />
        ))
      )}
    </div>
  );
};

export default IssueList;
