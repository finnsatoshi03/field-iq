import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus, TrendingUp } from "lucide-react";
import {
  DetailViewDialog,
  HealthStatusIndicator,
  PerformanceChart,
  PerformanceMetrics,
} from "./components";
import { ANIMAL_TYPES } from "./constants";
import { useGrowthPerformance } from "./hooks";

export const GrowthPerformanceLog = () => {
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
  } = useGrowthPerformance();

  const { openGrowthMetricsReport } = useChatWidgetStore();

  const handleAddRecordClick = () => {
    openGrowthMetricsReport();
  };

  return (
    <div className="bg-card rounded-lg border border-border py-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-4">
        <div>
          <h3 className="font-display font-medium text-base tracking-tight">
            Growth & Performance Log
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your animal's growth and performance over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={animalType} onValueChange={setAnimalType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANIMAL_TYPES.BROILER}>Broiler</SelectItem>
              <SelectItem value={ANIMAL_TYPES.LAYER}>Layer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleAddRecordClick}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 px-4">
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

      <DetailViewDialog
        isOpen={isDetailViewOpen}
        onOpenChange={setIsDetailViewOpen}
        animalType={animalType}
        stats={stats}
        chartData={chartData}
        records={records}
      />
    </div>
  );
};
