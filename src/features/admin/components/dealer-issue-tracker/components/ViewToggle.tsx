import { Map, Flame, List } from "lucide-react";
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
        onClick={() => onViewChange(VIEW_MODES.MAP)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentView === VIEW_MODES.MAP
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Map className="w-3 h-3" />
        Map
      </button>
      <button
        onClick={() => onViewChange(VIEW_MODES.HEATMAP)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentView === VIEW_MODES.HEATMAP
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Flame className="w-3 h-3" />
        Heatmap
      </button>
      <button
        onClick={() => onViewChange(VIEW_MODES.LIST)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentView === VIEW_MODES.LIST
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <List className="w-3 h-3" />
        List
      </button>
    </div>
  );
};

export default ViewToggle;
