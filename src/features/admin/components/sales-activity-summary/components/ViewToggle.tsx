import type { ViewMode } from "../constants";
import { VIEW_MODES } from "../constants";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

const ViewToggle = ({
  currentView,
  onViewChange,
  className,
}: ViewToggleProps) => {
  return (
    <div className={`flex gap-1 bg-muted rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange(VIEW_MODES.REGION)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentView === VIEW_MODES.REGION
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        By Region
      </button>
      <button
        onClick={() => onViewChange(VIEW_MODES.REP)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentView === VIEW_MODES.REP
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        By Rep
      </button>
    </div>
  );
};

export default ViewToggle;
