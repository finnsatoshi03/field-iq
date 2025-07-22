import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface ExpandableCardProps {
  title: string;
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  showExpandButton?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  summary,
  children,
  className,
  defaultExpanded = false,
  showExpandButton = true,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle?.(newExpandedState);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border transition-all duration-200",
        className,
      )}
    >
      {/* Header with title and toggle */}
      <div
        className={cn(
          "p-4 cursor-pointer transition-colors hover:bg-muted/20",
          showExpandButton && "flex items-center justify-between",
        )}
        onClick={showExpandButton ? handleToggle : undefined}
      >
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
          {title}
        </h3>
        {showExpandButton && (
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Summary content - always visible */}
      <div className="px-4 pb-4">{summary}</div>

      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pb-4 space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableCard;
