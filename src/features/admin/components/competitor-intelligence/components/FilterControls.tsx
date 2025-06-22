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
}

const FilterControls = ({
  filters,
  onFiltersChange,
  regions,
}: FilterControlsProps) => {
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

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "dateRange") {
      return value.start !== null || value.end !== null;
    }
    return value !== "all";
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Category" />
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

        <Select
          value={filters.sentiment}
          onValueChange={(value) => handleFilterChange("sentiment", value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Sentiment" />
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

        <Select
          value={filters.riskLevel}
          onValueChange={(value) => handleFilterChange("riskLevel", value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Risk Level" />
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

        <Select
          value={filters.pricePoint}
          onValueChange={(value) => handleFilterChange("pricePoint", value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Price Point" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Price Points</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="mid-range">Mid-range</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.region}
          onValueChange={(value) => handleFilterChange("region", value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Region" />
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-xs justify-start">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {filters.dateRange.start && filters.dateRange.end
                ? `${format(filters.dateRange.start, "MMM dd")} - ${format(filters.dateRange.end, "MMM dd")}`
                : "Date Range"}
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
                      handleDateRangeChange(date || null, filters.dateRange.end)
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

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.category !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Category: {filters.category}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("category", "all")}
              />
            </Badge>
          )}
          {filters.sentiment !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Sentiment: {filters.sentiment}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("sentiment", "all")}
              />
            </Badge>
          )}
          {filters.riskLevel !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Risk: {filters.riskLevel}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("riskLevel", "all")}
              />
            </Badge>
          )}
          {filters.region !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Region: {filters.region}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("region", "all")}
              />
            </Badge>
          )}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <Badge variant="secondary" className="text-xs">
              Date Range
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleDateRangeChange(null, null)}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
