import { CircleDot, Utensils, X } from "lucide-react";
import { type FeedIntakeSummary } from "../constants";
import { getBehaviorLabel } from "../utils";

interface BehaviorSummaryProps {
  summary: FeedIntakeSummary;
}

export const BehaviorSummary = ({ summary }: BehaviorSummaryProps) => {
  const behaviorTypes = [
    {
      type: "eating_well",
      count: summary.eatingWellCount,
      icon: <Utensils className="size-4 text-green-500" />,
      label: getBehaviorLabel("eating_well"),
    },
    {
      type: "picking_only",
      count: summary.pickingOnlyCount,
      icon: <CircleDot className="size-4 text-orange-500" />,
      label: getBehaviorLabel("picking_only"),
    },
    {
      type: "not_eating",
      count: summary.notEatingCount,
      icon: <X className="size-4 text-red-500" />,
      label: getBehaviorLabel("not_eating"),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {behaviorTypes.map(({ type, count, icon, label }) => (
        <div
          key={type}
          className="text-center p-3 rounded-md bg-muted/50 space-y-2"
        >
          <div className="text-xl font-medium font-display">{count}</div>
          <div className="flex items-center justify-center gap-2">
            <div className="text-lg">{icon}</div>
            <div className="text-xs text-muted-foreground font-medium">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
