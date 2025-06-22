import { Button } from "@/components/ui/button";
import { PieChart, Building2, AlertTriangle } from "lucide-react";
import type { ViewMode } from "../constants";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const views = [
    {
      id: "chart" as ViewMode,
      label: "Charts",
      shortLabel: "C",
      icon: PieChart,
      description: "Market share & mentions analysis",
    },
    {
      id: "brands" as ViewMode,
      label: "Brands",
      shortLabel: "B",
      icon: Building2,
      description: "Brand rankings & intelligence",
    },
    {
      id: "risks" as ViewMode,
      label: "Risks",
      shortLabel: "R",
      icon: AlertTriangle,
      description: "Switching risk analysis",
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      {views.map((view) => {
        const IconComponent = view.icon;
        const isActive = currentView === view.id;

        return (
          <Button
            key={view.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={`
              flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all text-xs sm:text-sm
              ${
                isActive
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
            aria-pressed={isActive}
            title={view.description}
          >
            <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium hidden sm:inline">{view.label}</span>
            <span className="font-medium sm:hidden">{view.shortLabel}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
