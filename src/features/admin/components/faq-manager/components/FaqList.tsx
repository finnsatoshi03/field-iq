import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import type { FaqItem } from "../constants";
import {
  formatDate,
  formatNumber,
  getStatusColor,
  getCategoryColor,
  truncateText,
} from "../utils";

interface FaqListProps {
  faqs: FaqItem[];
  onEdit: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
  onView: (faq: FaqItem) => void;
  className?: string;
}

type SortField =
  | "question"
  | "category"
  | "status"
  | "priority"
  | "views"
  | "lastUpdated";
type SortOrder = "asc" | "desc";

const FaqList = ({
  faqs,
  onEdit,
  onDelete,
  onView,
  className,
}: FaqListProps) => {
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const isMobile = useIsMobile();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedFaqs = [...faqs].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "question":
        aValue = a.question.toLowerCase();
        bValue = b.question.toLowerCase();
        break;
      case "category":
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "priority":
        aValue = a.priority;
        bValue = b.priority;
        break;
      case "views":
        aValue = a.views;
        bValue = b.views;
        break;
      case "lastUpdated":
        aValue = new Date(a.lastUpdated);
        bValue = new Date(b.lastUpdated);
        break;
      default:
        aValue = a.question.toLowerCase();
        bValue = b.question.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(field)}
        className="h-8 px-2 lg:px-3 font-medium"
      >
        {children}
        {getSortIcon(field)}
      </Button>
    </TableHead>
  );

  // Mobile Card View
  const MobileCardView = () => {
    if (sortedFaqs.length === 0) {
      return (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium font-display">No FAQs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedFaqs.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium font-display text-sm leading-5">
                      {truncateText(faq.question, 80)}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {truncateText(faq.answer, 100)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0 ml-2"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(faq)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(faq)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(faq)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getCategoryColor(faq.category))}
                    >
                      {faq.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getStatusColor(faq.status))}
                    >
                      {faq.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(faq.views)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        faq.priority <= 3
                          ? "destructive"
                          : faq.priority <= 6
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      P{faq.priority}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>by {faq.createdBy}</span>
                  <span>{formatDate(faq.lastUpdated)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-muted/30 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortableHeader field="question">Question</SortableHeader>
                <SortableHeader field="category">Category</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="priority">Priority</SortableHeader>
                <SortableHeader field="views">Views</SortableHeader>
                <SortableHeader field="lastUpdated">
                  Last Updated
                </SortableHeader>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
          <Table>
            <TableBody>
              {sortedFaqs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground h-32"
                  >
                    No FAQs found
                  </TableCell>
                </TableRow>
              ) : (
                sortedFaqs.map((faq) => (
                  <TableRow key={faq.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium min-w-[300px] max-w-[400px]">
                      <div className="space-y-1">
                        <div className="font-medium font-display">
                          {truncateText(faq.question, 60)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {truncateText(faq.answer, 80)}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {faq.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {faq.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{faq.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          getCategoryColor(faq.category)
                        )}
                      >
                        {faq.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(faq.status))}
                      >
                        {faq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <Badge
                        variant={
                          faq.priority <= 3
                            ? "destructive"
                            : faq.priority <= 6
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {faq.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatNumber(faq.views)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(faq.lastUpdated)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          by {faq.createdBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(faq)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(faq)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(faq)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {isMobile ? <MobileCardView /> : <DesktopTableView />}
    </div>
  );
};

export default FaqList;
