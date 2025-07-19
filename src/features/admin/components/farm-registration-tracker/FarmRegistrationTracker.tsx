import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2, TrendingUp, MapPin, Plus } from "lucide-react";
import {
  RegistrationChart,
  FarmMap,
  RegistrationStats,
  FilterControls,
  ViewToggle,
} from "./components";
import type { ViewMode, ChartType, TimePeriod } from "./constants";
import type { FilterOptions } from "./utils";
import {
  calculateRegistrationMetrics,
  getFilteredRegistrations,
  formatNumber,
} from "./utils";

const FarmRegistrationTracker: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>("map");
  const [chartType, setChartType] = useState<ChartType>("registrations");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const registrations = getFilteredRegistrations(undefined, filters);
  const metrics = calculateRegistrationMetrics(registrations);

  const renderCompactView = () => {
    switch (currentView) {
      case "chart":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select
                value={chartType}
                onValueChange={(value: ChartType) => setChartType(value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registrations">Registrations</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="farmSize">Farm Size</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={timePeriod}
                onValueChange={(value: TimePeriod) => setTimePeriod(value)}
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <RegistrationChart
                chartType={chartType}
                timePeriod={timePeriod}
              />
            </div>
          </div>
        );
      case "map":
        return (
          <div>
            <FarmMap filters={filters} />
          </div>
        );
      case "stats":
      default:
        return (
          <div className="space-y-2 p-2 rounded-lg border">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-accent rounded">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-green-600">
                  {formatNumber(metrics.newAccounts)}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  New
                </div>
              </div>
              {/* <div className="text-center p-2 bg-accent rounded">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-blue-600">
                  {formatNumber(metrics.expansions)}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  Expansions
                </div>
              </div> */}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-accent rounded">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-purple-600">
                  {formatNumber(metrics.conversions)}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  Conversions
                </div>
              </div>
              <div className="text-center p-2 bg-accent rounded">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-orange-600">
                  {formatNumber(metrics.thisMonth)}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  This Month
                </div>
              </div>
            </div>
            <div className="text-center p-2 bg-accent rounded">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-gray-700">
                {formatNumber(metrics.totalRegistrations)}
              </div>
              <div className="text-xs text-muted-foreground font-semibold">
                Total Farms
              </div>
            </div>
          </div>
        );
    }
  };

  const renderExpandedView = () => {
    return <RegistrationStats filters={filters} />;
  };

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
      <div className="px-4">
        <div className="flex flex-wrap gap-2 justify-between">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              Farm Registration Tracker
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Track farm registrations
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 p-0"
              title="Toggle Filters"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 -mx-4">
          <div className="p-4 bg-accent">
            <FilterControls filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      )}

      {/* Compact View */}
      <div className="px-4">{renderCompactView()}</div>

      {/* Expanded View Dialog */}
   
    </div>
  );
};

export default FarmRegistrationTracker;
