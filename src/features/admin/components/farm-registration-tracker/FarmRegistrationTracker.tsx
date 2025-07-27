import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Settings2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  FarmMap,
  FilterControls,
  RegistrationChart,
  RegistrationStats,
  ViewToggle,
} from "./components";
import type { ChartType, TimePeriod, ViewMode } from "./constants";
import { useAdminFarms } from "./hooks";
import type { FilterOptions } from "./utils";
import {
  calculateRegistrationMetrics,
  formatNumber,
  getFilteredRegistrations,
  transformApiDataToFarmRegistrations,
  transformApiDataToSalesReps,
} from "./utils";

interface FarmRegistrationTrackerProps {
  className?: string;
  companyId: number;
}

const FarmRegistrationTracker: React.FC<FarmRegistrationTrackerProps> = ({
  className,
  companyId,
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>("chart");
  const [chartType, setChartType] = useState<ChartType>("registrations");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [salesRepsOpen, setSalesRepsOpen] = useState(false);

  // Fetch data using our hook
  const {
    data: farmsData,
    isLoading,
    error,
    refetch,
  } = useAdminFarms(companyId);

  // Transform API data to component format
  const allRegistrations = farmsData
    ? transformApiDataToFarmRegistrations(farmsData.data)
    : [];
  const allSalesReps = farmsData
    ? transformApiDataToSalesReps(farmsData.data)
    : [];

  const registrations = getFilteredRegistrations(allRegistrations, filters);
  const metrics = calculateRegistrationMetrics(registrations);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Farm Registration Tracker
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading farm registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Farm Registration Tracker
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load farm registrations: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (allRegistrations.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Farm Registration Tracker
          </h3>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No farm registrations found
            </h3>
            <p className="text-sm">
              Farm registration data will appear here once available for company
              ID {companyId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                <SelectTrigger className="w-auto min-w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registrations">Registrations</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={timePeriod}
                onValueChange={(value: TimePeriod) => setTimePeriod(value)}
              >
                <SelectTrigger className="w-auto min-w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <RegistrationChart chartType={chartType} timePeriod={timePeriod} />
          </div>
        );

      case "map":
        return <FarmMap filters={filters} />;

      case "stats":
        return <RegistrationStats filters={filters} />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-card rounded-lg border border-border p-4 space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Farm Registration Tracker
          </h3>
          <p className="text-xs text-muted-foreground">
            Track and analyze farm registrations across territories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Settings2 className="h-3 w-3" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Registrations</DialogTitle>
                <DialogDescription>
                  Customize the view by applying filters to the data
                </DialogDescription>
              </DialogHeader>
              <FilterControls filters={filters} onFiltersChange={setFilters} />
            </DialogContent>
          </Dialog>

          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-chart-1" />
            <span className="text-xs font-medium text-muted-foreground">
              Total Registrations
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground font-display">
            {formatNumber(metrics.totalRegistrations)}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-chart-2" />
            <span className="text-xs font-medium text-muted-foreground">
              This Month
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground font-display">
            {formatNumber(metrics.thisMonth)}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-chart-3" />
            <span className="text-xs font-medium text-muted-foreground">
              Avg. Farm Size
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground font-display">
            {Math.round(metrics.averageFarmSize)}ha
          </p>
        </div>
      </div>

      {/* Sales Representatives Section */}
      <Collapsible open={salesRepsOpen} onOpenChange={setSalesRepsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-10 px-4"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Sales Representatives</span>
              <Badge variant="secondary" className="ml-2">
                {allSalesReps.length}
              </Badge>
            </div>
            {salesRepsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="bg-muted/20 rounded-lg p-4 space-y-3">
            {allSalesReps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sales representatives found
              </p>
            ) : (
              <div className="grid gap-3">
                {allSalesReps.map((salesRep) => (
                  <div
                    key={salesRep.id}
                    className="bg-card border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">
                          {salesRep.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          ID: {salesRep.id} • Territory: {salesRep.territory}
                        </p>
                      </div>
                      <Badge
                        variant={
                          salesRep.registrationsThisMonth > 0
                            ? "default"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BarChart3 className="h-3 w-3 text-blue-600" />
                          <span className="text-muted-foreground">
                            This Month
                          </span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {salesRep.registrationsThisMonth}
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">Total</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {salesRep.totalRegistrations}
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-3 w-3 text-orange-600" />
                          <span className="text-muted-foreground">Target</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {salesRep.targetRegistrations}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar for target achievement */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Target Progress
                        </span>
                        <span className="text-foreground">
                          {Math.round(
                            (salesRep.totalRegistrations /
                              salesRep.targetRegistrations) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (salesRep.totalRegistrations / salesRep.targetRegistrations) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content */}
      <div className="min-h-80">{renderCompactView()}</div>
    </div>
  );
};

export default FarmRegistrationTracker;
