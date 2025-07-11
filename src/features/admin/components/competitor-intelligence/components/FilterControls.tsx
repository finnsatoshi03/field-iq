import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { FilterOptions } from "../utils";
import {
  COMPETITOR_CATEGORIES,
  RISK_LEVELS,
  SENTIMENT_TYPES,
} from "../constants";

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  regions: string[];
  className?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  regions,
  className = "",
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    onFiltersChange({
      ...filters,
      dateRange: { start, end },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      sentiment: "all",
      riskLevel: "all",
      pricePoint: "all",
      region: "all",
      promoType: "all",
      promoStatus: "all",
      dateRange: { start: null, end: null },
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.sentiment !== "all") count++;
    if (filters.riskLevel !== "all") count++;
    if (filters.pricePoint !== "all") count++;
    if (filters.region !== "all") count++;
    if (filters.promoType !== "all") count++;
    if (filters.promoStatus !== "all") count++;
    if (filters.dateRange.start !== null || filters.dateRange.end !== null)
      count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-medium tracking-tight">
            Filters
          </span>
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
            className="text-xs px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="text-xs border-black">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(COMPETITOR_CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentiment Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Sentiment
          </label>
          <Select
            value={filters.sentiment}
            onValueChange={(value) => handleFilterChange("sentiment", value)}
          >
            <SelectTrigger className="text-xs border-black">
              <SelectValue placeholder="All Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              {Object.entries(SENTIMENT_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Risk Level
          </label>
          <Select
            value={filters.riskLevel}
            onValueChange={(value) => handleFilterChange("riskLevel", value)}
          >
            <SelectTrigger className="text-xs border-black">
              <SelectValue placeholder="All Risk Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              {Object.entries(RISK_LEVELS).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Point Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Price Point
          </label>
          <Select
            value={filters.pricePoint}
            onValueChange={(value) => handleFilterChange("pricePoint", value)}
          >
            <SelectTrigger className="text-xs border-black">
              <SelectValue placeholder="All Price Points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Price Points</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid-range">Mid-range</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Region
          </label>
          <Select
            value={filters.region}
            onValueChange={(value) => handleFilterChange("region", value)}
          >
            <SelectTrigger className="text-xs border-black">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        <div className="space-y-1 flex flex-col">
          <label className="text-xs font-semibold text-muted-foreground">
            Custom Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "text-xs justify-start w-fit text-left font-normal",
                  !filters.dateRange.start &&
                    !filters.dateRange.end &&
                    "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {filters.dateRange.start && filters.dateRange.end
                  ? `${format(filters.dateRange.start, "LLL dd")} - ${format(filters.dateRange.end, "LLL dd")}`
                  : "Date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-3">
                <div className="text-sm font-medium">Select Date Range</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Start Date
                    </div>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start || undefined}
                      onSelect={(date) =>
                        handleDateRangeChange(
                          date || null,
                          filters.dateRange.end
                        )
                      }
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      End Date
                    </div>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end || undefined}
                      onSelect={(date) =>
                        handleDateRangeChange(
                          filters.dateRange.start,
                          date || null
                        )
                      }
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateRangeChange(null, null)}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {filters.category !== "all" && (
            <Badge variant="outline" className="text-xs">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("category", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.sentiment !== "all" && (
            <Badge variant="outline" className="text-xs">
              Sentiment: {filters.sentiment}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("sentiment", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.riskLevel !== "all" && (
            <Badge variant="outline" className="text-xs">
              Risk: {filters.riskLevel}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("riskLevel", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.pricePoint !== "all" && (
            <Badge variant="outline" className="text-xs">
              Price: {filters.pricePoint}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleFilterChange("pricePoint", "all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.region !== "all" && (
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
          {(filters.dateRange.start || filters.dateRange.end) && (
            <Badge variant="outline" className="text-xs">
              Date Range
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => handleDateRangeChange(null, null)}
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
