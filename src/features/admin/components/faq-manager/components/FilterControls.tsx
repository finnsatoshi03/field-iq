import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FAQ_CATEGORIES } from "../constants";
import type { FilterOptions } from "../utils";

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const FilterControls = ({
  filters,
  onFiltersChange,
  className,
}: FilterControlsProps) => {
  // Local search state for immediate UI feedback
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search value
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update parent filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  // Sync local search state with external filters (for reset functionality)
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search);
    }
  }, [filters.search]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleCategoryChange = useCallback(
    (category: string) => {
      onFiltersChange({ ...filters, category: category as any });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      onFiltersChange({ ...filters, status: status as any });
    },
    [filters, onFiltersChange],
  );

  const handlePriorityChange = useCallback(
    (priority: string) => {
      onFiltersChange({
        ...filters,
        priority: priority === "all" ? "all" : parseInt(priority),
      });
    },
    [filters, onFiltersChange],
  );

  const handleDateRangeChange = useCallback(
    (field: "from" | "to", date: Date | undefined) => {
      onFiltersChange({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [field]: date || null,
        },
      });
    },
    [filters, onFiltersChange],
  );

  const clearFilters = useCallback(() => {
    setSearchInput(""); // Clear local search state immediately
    onFiltersChange({
      search: "",
      category: "all",
      status: "all",
      priority: "all",
      dateRange: { from: null, to: null },
    });
  }, [onFiltersChange]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    onFiltersChange({ ...filters, search: "" });
  }, [filters, onFiltersChange]);

  const clearCategory = useCallback(() => {
    handleCategoryChange("all");
  }, [handleCategoryChange]);

  const clearStatus = useCallback(() => {
    handleStatusChange("all");
  }, [handleStatusChange]);

  const clearPriority = useCallback(() => {
    handlePriorityChange("all");
  }, [handlePriorityChange]);

  const clearFromDate = useCallback(() => {
    handleDateRangeChange("from", undefined);
  }, [handleDateRangeChange]);

  const clearToDate = useCallback(() => {
    handleDateRangeChange("to", undefined);
  }, [handleDateRangeChange]);

  // Memoize active filters check to prevent unnecessary computations
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.category !== "all" ||
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.dateRange.from ||
      filters.dateRange.to
    );
  }, [filters]);

  // Memoize formatted category display
  const formattedCategories = useMemo(() => {
    return FAQ_CATEGORIES.map((category) => ({
      value: category,
      label: category
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    }));
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground " />
            <Input
              placeholder="Search FAQs..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="pl-10 bg-white"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {formattedCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority.toString()}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="1">1 - High</SelectItem>
            <SelectItem value="2">2 - High</SelectItem>
            <SelectItem value="3">3 - Medium</SelectItem>
            <SelectItem value="4">4 - Normal</SelectItem>
            <SelectItem value="5">5 - Normal</SelectItem>
            <SelectItem value="6">6 - Normal</SelectItem>
            <SelectItem value="7">7 - Low</SelectItem>
            <SelectItem value="8">8 - Low</SelectItem>
            <SelectItem value="9">9 - Low</SelectItem>
            <SelectItem value="10">10 - Low</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal bg-white",
                  !filters.dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, "PPP")
                ) : (
                  <span>From date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.from || undefined}
                onSelect={(date) => handleDateRangeChange("from", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal bg-white",
                  !filters.dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, "PPP")
                ) : (
                  <span>To date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.to || undefined}
                onSelect={(date) => handleDateRangeChange("to", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button onClick={clearSearch}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category:{" "}
              {formattedCategories.find((c) => c.value === filters.category)
                ?.label || filters.category}
              <button onClick={clearCategory}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status:{" "}
              {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
              <button onClick={clearStatus}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priority !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.priority}
              <button onClick={clearPriority}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1">
              From: {format(filters.dateRange.from, "MMM dd, yyyy")}
              <button onClick={clearFromDate}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange.to && (
            <Badge variant="secondary" className="gap-1">
              To: {format(filters.dateRange.to, "MMM dd, yyyy")}
              <button onClick={clearToDate}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;
