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
  const [currentView, setCurrentView] = useState<ViewMode>("chart");
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
              <div className="text-center p-2 bg-accent rounded">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold font-display text-blue-600">
                  {formatNumber(metrics.expansions)}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  Expansions
                </div>
              </div>
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
              Track farm registrations and expansions
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
      <div className="px-4 bg-muted/20 py-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <h4 className="text-foreground font-display font-medium tracking-tight">
            Penetration & Expansion Tracking
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground font-sans">Growth</span>
              <span className="font-medium text-foreground font-sans">
                {formatNumber(metrics.newAccounts + metrics.expansions)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground font-sans">Coverage</span>
              <span className="font-medium text-foreground font-sans">
                {metrics.penetrationRate}%
              </span>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center cursor-pointer hover:bg-muted/30 rounded transition-colors">
              <div className="flex flex-col items-center mr-3 relative">
                <div className="size-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-background">
                  <Plus className="size-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1 py-2">
                <span className="text-sm text-muted-foreground font-sans">
                  View detailed analytics and full dashboard
                </span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="gap-0 space-y-0">
              <DialogTitle className="font-semibold font-display text-lg">
                Farm Registration Analytics
              </DialogTitle>
              <DialogDescription>
                View detailed analytics and full dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {/* Filters in expanded view */}
              <div className="-mx-10 px-4">
                <div className="bg-accent p-4">
                  <FilterControls
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {renderExpandedView()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FarmRegistrationTracker;
