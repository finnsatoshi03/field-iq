import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGrowthPerformance } from "@/hooks/use-farmer-v2";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus, TrendingUp } from "lucide-react";
import {
  DetailViewDialog,
  HealthStatusIndicator,
  PerformanceChart,
  PerformanceMetrics,
} from "./components";
import { ANIMAL_TYPES } from "./constants";
import { useGrowthPerformance as useGrowthPerformanceLogic } from "./hooks";

interface GrowthPerformanceLogProps {
  farmerUserProfileId: number;
}

export const GrowthPerformanceLog: React.FC<GrowthPerformanceLogProps> = ({
  farmerUserProfileId,
}) => {
  // Fetch growth performance data from V2 API
  const { data: growthPerformanceData, isLoading } =
    useGrowthPerformance(farmerUserProfileId);

  const {
    animalType,
    records,
    isDetailViewOpen,
    stats,
    latestRecord,
    chartData,
    progressValue,
    setAnimalType,
    setIsDetailViewOpen,
  } = useGrowthPerformanceLogic(growthPerformanceData?.data);

  const { openGrowthMetricsReport } = useChatWidgetStore();

  const handleAddRecordClick = () => {
    openGrowthMetricsReport();
  };

  // Show loading state if no data
  if (isLoading || !growthPerformanceData?.data) {
    return (
      <ExpandableCard
        title="Growth Performance Log"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Loading performance data...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No performance data available</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - show key performance metrics
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            {animalType} Performance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {records.length} records
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">
          {progressValue.toFixed(1)}% target
        </span>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Growth Performance Log"
      summary={summaryContent}
      className="h-fit"
    >
      <div className="space-y-4">
        {/* Header with animal type selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={animalType} onValueChange={setAnimalType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANIMAL_TYPES.BROILER}>Broiler</SelectItem>
                <SelectItem value={ANIMAL_TYPES.LAYER}>Layer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {/* Health Status Indicator */}
          <HealthStatusIndicator
            stats={stats}
            animalType={animalType}
            latestRecord={latestRecord}
          />

          {/* Performance Metrics */}
          <PerformanceMetrics
            stats={stats}
            animalType={animalType}
            latestRecord={latestRecord}
          />

          {/* Progress Indicator */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Progress vs Target
              </span>
              <span className="font-medium font-display">
                {progressValue.toFixed(1)}%
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Performance Chart */}
          <PerformanceChart
            chartData={chartData}
            animalType={animalType}
            onViewDetails={() => setIsDetailViewOpen(true)}
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs text-muted-foreground"
              onClick={handleAddRecordClick}
            >
              <Plus className="size-3" />
              Add Record
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs text-muted-foreground"
              onClick={() => setIsDetailViewOpen(true)}
            >
              <TrendingUp className="size-3" />
              View Details
            </Button>
          </div>
        </div>
      </div>

      <DetailViewDialog
        isOpen={isDetailViewOpen}
        onOpenChange={setIsDetailViewOpen}
        animalType={animalType}
        stats={stats}
        chartData={chartData}
        records={records}
      />
    </ExpandableCard>
  );
};
