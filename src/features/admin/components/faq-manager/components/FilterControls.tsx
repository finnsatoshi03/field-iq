import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { FilterOptions } from "../utils";
import { FAQ_CATEGORIES, FAQ_STATUS, PRIORITY_LEVELS } from "../constants";

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const FilterControls = ({
  filters,
  onFiltersChange,
  className,
}: FilterControlsProps) => {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category as any });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status as any });
  };

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority === "all" ? "all" : parseInt(priority),
    });
  };

  const handleDateRangeChange = (
    field: "from" | "to",
    date: Date | undefined
  ) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date || null,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      status: "all",
      priority: "all",
      dateRange: { from: null, to: null },
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {FAQ_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={FAQ_STATUS.ACTIVE}>Active</SelectItem>
            <SelectItem value={FAQ_STATUS.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={FAQ_STATUS.DRAFT}>Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority.toString()}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {PRIORITY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value.toString()}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !filters.dateRange.from && "text-muted-foreground"
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
                  "w-[140px] justify-start text-left font-normal",
                  !filters.dateRange.to && "text-muted-foreground"
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
              <button onClick={() => handleSearchChange("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <button onClick={() => handleCategoryChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button onClick={() => handleStatusChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priority !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.priority}
              <button onClick={() => handlePriorityChange("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1">
              From: {format(filters.dateRange.from, "MMM dd, yyyy")}
              <button onClick={() => handleDateRangeChange("from", undefined)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange.to && (
            <Badge variant="secondary" className="gap-1">
              To: {format(filters.dateRange.to, "MMM dd, yyyy")}
              <button onClick={() => handleDateRangeChange("to", undefined)}>
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
