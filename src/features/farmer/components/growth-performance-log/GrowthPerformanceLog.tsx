import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ANIMAL_TYPES } from "./constants";
import { useGrowthPerformance } from "./hooks";
import {
  HealthStatusIndicator,
  PerformanceMetrics,
  PerformanceChart,
  AddRecordDialog,
  DetailViewDialog,
} from "./components";

export const GrowthPerformanceLog = () => {
  const {
    animalType,
    records,
    isAddRecordOpen,
    isDetailViewOpen,
    newRecord,
    stats,
    latestRecord,
    chartData,
    progressValue,
    setAnimalType,
    setNewRecord,
    setIsAddRecordOpen,
    setIsDetailViewOpen,
    handleAddRecord,
  } = useGrowthPerformance();

  return (
    <div className="bg-card rounded-lg border border-border py-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Growth & Performance Log
        </h3>
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
            onClick={() => setIsAddRecordOpen(true)}
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress vs Target</span>
            <span className="font-medium">{progressValue.toFixed(1)}%</span>
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
            className="flex-1"
            onClick={() => setIsAddRecordOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsDetailViewOpen(true)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddRecordDialog
        isOpen={isAddRecordOpen}
        onOpenChange={setIsAddRecordOpen}
        animalType={animalType}
        newRecord={newRecord}
        onNewRecordChange={setNewRecord}
        onAddRecord={handleAddRecord}
      />

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
