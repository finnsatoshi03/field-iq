import { type FeedIntakeSummary } from "../constants";
import { getBehaviorIcon, getBehaviorLabel } from "../utils";

interface BehaviorSummaryProps {
  summary: FeedIntakeSummary;
}

export const BehaviorSummary = ({ summary }: BehaviorSummaryProps) => {
  const behaviorTypes = [
    {
      type: "eating_well",
      count: summary.eatingWellCount,
      icon: getBehaviorIcon("eating_well"),
      label: getBehaviorLabel("eating_well"),
    },
    {
      type: "picking_only",
      count: summary.pickingOnlyCount,
      icon: getBehaviorIcon("picking_only"),
      label: getBehaviorLabel("picking_only"),
    },
    {
      type: "not_eating",
      count: summary.notEatingCount,
      icon: getBehaviorIcon("not_eating"),
      label: getBehaviorLabel("not_eating"),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {behaviorTypes.map(({ type, count, icon, label }) => (
        <div
          key={type}
          className="text-center p-3 rounded-lg bg-muted/20 border"
        >
          <div className="text-lg mb-1">{icon}</div>
          <div className="text-lg font-bold text-blue-600">{count}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
};
