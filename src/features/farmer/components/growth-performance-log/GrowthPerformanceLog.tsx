import { useState } from "react";
import { TrendingUp, Plus, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MOCK_BROILER_RECORDS,
  MOCK_LAYER_RECORDS,
  ANIMAL_TYPES,
  type PerformanceRecord,
  type AnimalType,
} from "./constants";
import {
  calculateStats,
  formatWeight,
  formatEggProduction,
  formatFCR,
  formatGrowthRate,
  formatProductionRate,
  formatMortalityRate,
  getPerformanceLabel,
  getPerformanceColor,
  generateChartData,
  getLatestRecord,
} from "./utils";

export const GrowthPerformanceLog = () => {
  const [animalType, setAnimalType] = useState<AnimalType>(
    ANIMAL_TYPES.BROILER
  );
  const [records, setRecords] = useState<PerformanceRecord[]>(
    animalType === ANIMAL_TYPES.BROILER
      ? MOCK_BROILER_RECORDS
      : MOCK_LAYER_RECORDS
  );
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<PerformanceRecord>>({
    date: new Date().toISOString().split("T")[0],
    ageInDays: 0,
    measurements: {},
    notes: "",
  });

  // Calculate performance stats
  const stats = calculateStats(records, animalType);
  const latestRecord = getLatestRecord(records);
  const chartData = generateChartData(
    records,
    animalType === ANIMAL_TYPES.BROILER ? "weight" : "eggProduction"
  );

  const handleAnimalTypeChange = (type: AnimalType) => {
    setAnimalType(type);
    setRecords(
      type === ANIMAL_TYPES.BROILER ? MOCK_BROILER_RECORDS : MOCK_LAYER_RECORDS
    );
  };

  const handleAddRecord = () => {
    if (!newRecord.date || !newRecord.ageInDays) return;

    const record: PerformanceRecord = {
      id: Date.now().toString(),
      date: newRecord.date!,
      ageInDays: newRecord.ageInDays!,
      measurements: newRecord.measurements || {},
      notes: newRecord.notes,
    };

    setRecords((prev) =>
      [...prev, record].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      ageInDays: 0,
      measurements: {},
      notes: "",
    });
    setIsAddRecordOpen(false);
  };

  const getProgressValue = () => {
    if (
      animalType === ANIMAL_TYPES.BROILER &&
      latestRecord?.measurements.weight &&
      latestRecord?.expectedWeight
    ) {
      return Math.min(
        (latestRecord.measurements.weight / latestRecord.expectedWeight) * 100,
        100
      );
    }
    if (animalType === ANIMAL_TYPES.LAYER && stats.productionRate) {
      return Math.min(stats.productionRate, 100);
    }
    return 0;
  };

  return (
    <div className="bg-card rounded-lg border border-border py-4 space-y-6">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Growth & Performance Log
        </h3>
        <div className="flex items-center gap-2">
          <Select value={animalType} onValueChange={handleAnimalTypeChange}>
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

      <div className="space-y-4 px-4">
        {/* Current Performance Display */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-green-800 mb-1">
                Current Performance
              </h4>
              <Badge className={getPerformanceColor(stats.performanceIndex)}>
                {getPerformanceLabel(stats.performanceIndex)} (
                {stats.performanceIndex}/100)
              </Badge>
            </div>
            <div className="text-right">
              {animalType === ANIMAL_TYPES.BROILER ? (
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {latestRecord?.measurements.weight
                      ? formatWeight(latestRecord.measurements.weight)
                      : "N/A"}
                  </p>
                  <p className="text-sm text-green-700">Current Weight</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatProductionRate(stats.productionRate)}
                  </p>
                  <p className="text-sm text-green-700">Production Rate</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Progress vs Target</span>
              <span className="text-green-600">
                {getProgressValue().toFixed(1)}%
              </span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {animalType === ANIMAL_TYPES.BROILER ? (
            <>
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="text-lg font-bold text-blue-600">
                  {formatGrowthRate(stats.growthRate)}
                </div>
                <div className="text-xs text-muted-foreground">Growth Rate</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="text-lg font-bold text-orange-600">
                  {formatFCR(stats.currentFcr)}
                </div>
                <div className="text-xs text-muted-foreground">Current FCR</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="text-lg font-bold text-blue-600">
                  {latestRecord?.measurements.eggProduction
                    ? formatEggProduction(
                        latestRecord.measurements.eggProduction
                      )
                    : "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Daily Production
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card border">
                <div className="text-lg font-bold text-green-600">
                  {formatProductionRate(stats.productionRate)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Production Rate
                </div>
              </div>
            </>
          )}
        </div>

        {/* Performance Chart */}
        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Performance Trend</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailViewOpen(true)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>

          {/* Line Chart */}
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(value) => {
                    if (animalType === ANIMAL_TYPES.BROILER) {
                      return value < 1
                        ? `${Math.round(value * 1000)}g`
                        : `${value.toFixed(1)}kg`;
                    }
                    return `${value}`;
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                          <p className="text-sm font-medium text-foreground mb-2">
                            {label}
                          </p>
                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {entry.name}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-foreground">
                                {animalType === ANIMAL_TYPES.BROILER
                                  ? entry.value &&
                                    typeof entry.value === "number" &&
                                    entry.value < 1
                                    ? `${Math.round(entry.value * 1000)}g`
                                    : `${Number(entry.value).toFixed(2)}kg`
                                  : `${entry.value} eggs/day`}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  name={
                    animalType === ANIMAL_TYPES.BROILER
                      ? "Actual Weight"
                      : "Actual Production"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#e5e7eb" }}
                  name={
                    animalType === ANIMAL_TYPES.BROILER
                      ? "Target Weight"
                      : "Target Production"
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

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

      {/* Add Record Dialog */}
      <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Add Performance Record
            </DialogTitle>
            <DialogDescription>
              Record new{" "}
              {animalType === ANIMAL_TYPES.BROILER
                ? "weight"
                : "egg production"}{" "}
              data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) =>
                    setNewRecord((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="age">Age (days)</Label>
                <Input
                  id="age"
                  type="number"
                  value={newRecord.ageInDays}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      ageInDays: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="e.g., 21"
                />
              </div>
            </div>

            {animalType === ANIMAL_TYPES.BROILER ? (
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={newRecord.measurements?.weight || ""}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      measurements: {
                        ...prev.measurements,
                        weight: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="e.g., 1.25"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="eggs">Egg Production (eggs/day)</Label>
                <Input
                  id="eggs"
                  type="number"
                  value={newRecord.measurements?.eggProduction || ""}
                  onChange={(e) =>
                    setNewRecord((prev) => ({
                      ...prev,
                      measurements: {
                        ...prev.measurements,
                        eggProduction: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="e.g., 85"
                />
              </div>
            )}

            <div>
              <Label htmlFor="feedIntake">Feed Intake (kg/day)</Label>
              <Input
                id="feedIntake"
                type="number"
                step="0.01"
                value={newRecord.measurements?.feedIntake || ""}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    measurements: {
                      ...prev.measurements,
                      feedIntake: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
                placeholder="e.g., 0.12"
              />
            </div>

            <div>
              <Label htmlFor="mortality">Mortality Count</Label>
              <Input
                id="mortality"
                type="number"
                value={newRecord.measurements?.mortality || ""}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    measurements: {
                      ...prev.measurements,
                      mortality: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={newRecord.notes || ""}
                onChange={(e) =>
                  setNewRecord((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any observations or notes..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddRecordOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddRecord} className="flex-1">
                Add Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Performance Analytics
            </DialogTitle>
            <DialogDescription>
              Detailed {animalType} performance analysis and trends
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-bold text-blue-600">
                  {stats.totalRecords}
                </p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-bold text-green-600">
                  {animalType === ANIMAL_TYPES.BROILER
                    ? formatWeight(stats.averageWeight)
                    : formatEggProduction(stats.averageEggProduction)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg{" "}
                  {animalType === ANIMAL_TYPES.BROILER
                    ? "Weight"
                    : "Production"}
                </p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-bold text-orange-600">
                  {formatMortalityRate(stats.mortalityRate)}
                </p>
                <p className="text-xs text-muted-foreground">Mortality Rate</p>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-lg font-bold text-purple-600">
                  {stats.performanceIndex}
                </p>
                <p className="text-xs text-muted-foreground">
                  Performance Index
                </p>
              </div>
            </div>

            <Separator />

            {/* Detailed Performance Chart */}
            <div className="bg-muted/10 rounded-lg p-4">
              <h4 className="font-semibold mb-4">Performance Chart</h4>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="formattedDate"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                      tickFormatter={(value) => {
                        if (animalType === ANIMAL_TYPES.BROILER) {
                          return value < 1
                            ? `${Math.round(value * 1000)}g`
                            : `${value.toFixed(1)}kg`;
                        }
                        return `${value}`;
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-4">
                              <p className="text-sm font-medium text-foreground mb-3">
                                {label}
                              </p>
                              {payload.map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-6 mb-2"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-3"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-foreground">
                                    {animalType === ANIMAL_TYPES.BROILER
                                      ? entry.value &&
                                        typeof entry.value === "number" &&
                                        entry.value < 1
                                        ? `${Math.round(entry.value * 1000)}g`
                                        : `${Number(entry.value).toFixed(2)}kg`
                                      : `${entry.value} eggs/day`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "14px" }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#3b82f6" }}
                      activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
                      name={
                        animalType === ANIMAL_TYPES.BROILER
                          ? "Actual Weight"
                          : "Actual Production"
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ r: 4, fill: "#9ca3af" }}
                      name={
                        animalType === ANIMAL_TYPES.BROILER
                          ? "Target Weight"
                          : "Target Production"
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Records */}
            <div>
              <h4 className="font-semibold mb-3">Recent Records</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {records
                  .slice(-10)
                  .reverse()
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString()} (Day{" "}
                          {record.ageInDays})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {animalType === ANIMAL_TYPES.BROILER
                            ? `Weight: ${record.measurements.weight ? formatWeight(record.measurements.weight) : "N/A"}`
                            : `Production: ${record.measurements.eggProduction ? formatEggProduction(record.measurements.eggProduction) : "N/A"}`}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        {record.notes && (
                          <p className="text-muted-foreground">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
