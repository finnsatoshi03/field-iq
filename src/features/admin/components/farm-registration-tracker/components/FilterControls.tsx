import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { FilterOptions } from "../utils";
import { PHILIPPINE_REGIONS, MOCK_SALES_REPS } from "../constants";

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.registrationType && filters.registrationType !== "all") count++;
    if (filters.status && filters.status !== "all") count++;
    if (filters.salesRep && filters.salesRep !== "all") count++;
    if (filters.region && filters.region !== "all") count++;
    if (filters.timePeriod) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Registration Type Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            Registration Type
          </label>
          <Select
            value={filters.registrationType || "all"}
            onValueChange={(value) =>
              handleFilterChange("registrationType", value)
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="new">New Account</SelectItem>
              <SelectItem value="expansion">Expansion</SelectItem>
              <SelectItem value="conversion">Conversion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sales Rep Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Sales Rep</label>
          <Select
            value={filters.salesRep || "all"}
            onValueChange={(value) => handleFilterChange("salesRep", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Reps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reps</SelectItem>
              {MOCK_SALES_REPS.map((rep) => (
                <SelectItem key={rep.id} value={rep.id}>
                  {rep.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Region</label>
          <Select
            value={filters.region || "all"}
            onValueChange={(value) => handleFilterChange("region", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {PHILIPPINE_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Period Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            Time Period
          </label>
          <Select
            value={filters.timePeriod || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "timePeriod",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            Custom Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 text-xs justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd")} -{" "}
                      {format(filters.dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={(range) => handleFilterChange("dateRange", range)}
                numberOfMonths={1}
              />
              {filters.dateRange && (
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange("dateRange", undefined)}
                    className="w-full"
                  >
                    Clear Date Range
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {filters.registrationType && filters.registrationType !== "all" && (
            <Badge variant="outline" className="text-xs">
              Type: {filters.registrationType}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("registrationType", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.status && filters.status !== "all" && (
            <Badge variant="outline" className="text-xs">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("status", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.salesRep && filters.salesRep !== "all" && (
            <Badge variant="outline" className="text-xs">
              Rep:{" "}
              {MOCK_SALES_REPS.find((r) => r.id === filters.salesRep)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("salesRep", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.region && filters.region !== "all" && (
            <Badge variant="outline" className="text-xs">
              Region: {filters.region}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("region", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.timePeriod && (
            <Badge variant="outline" className="text-xs">
              Period: {filters.timePeriod}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("timePeriod", undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="outline" className="text-xs">
              Custom: {format(filters.dateRange.from!, "MMM dd")} -{" "}
              {format(filters.dateRange.to!, "MMM dd")}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("dateRange", undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;
