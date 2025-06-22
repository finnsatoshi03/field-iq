import { type FeedBehavior, FEED_BEHAVIOR } from "../constants";
import { getBehaviorColor, getBehaviorLabel } from "../utils";

interface BehaviorSliderProps {
  currentBehavior: FeedBehavior;
  onBehaviorChange: (behavior: FeedBehavior) => void;
}

export const BehaviorSlider = ({
  currentBehavior,
  onBehaviorChange,
}: BehaviorSliderProps) => {
  const behaviors = [
    {
      value: FEED_BEHAVIOR.EATING_WELL,
      label: getBehaviorLabel(FEED_BEHAVIOR.EATING_WELL),
    },
    {
      value: FEED_BEHAVIOR.PICKING_ONLY,
      label: getBehaviorLabel(FEED_BEHAVIOR.PICKING_ONLY),
    },
    {
      value: FEED_BEHAVIOR.NOT_EATING,
      label: getBehaviorLabel(FEED_BEHAVIOR.NOT_EATING),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Current Behavior
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${getBehaviorColor(currentBehavior)}`}
        >
          {getBehaviorLabel(currentBehavior)}
        </span>
      </div>

      <div className="flex gap-2">
        {behaviors.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onBehaviorChange(value)}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              currentBehavior === value
                ? `${getBehaviorColor(value)} border-current`
                : "bg-muted/20 border-border hover:bg-muted/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
