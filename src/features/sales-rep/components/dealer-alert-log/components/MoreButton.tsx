import React from "react";

interface MoreButtonProps {
  count: number;
  onClick?: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = ({ count }) => (
  <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 px-3 py-2 cursor-pointer hover:border-muted-foreground/50 transition-colors">
    <div className="flex items-center justify-center">
      <span className="text-sm text-muted-foreground font-sans">
        +{count} more
      </span>
    </div>
  </div>
);

export default MoreButton;
