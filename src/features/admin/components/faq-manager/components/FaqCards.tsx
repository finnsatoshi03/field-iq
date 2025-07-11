import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  MessageCircle,
  Bot,
  User,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "../constants";
import {
  formatDate,
  formatNumber,
  getStatusColor,
  getCategoryColor,
  truncateText,
} from "../utils";

interface FaqCardsProps {
  faqs: FaqItem[];
  onEdit: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
  onView: (faq: FaqItem) => void;
  className?: string;
}

const FaqCards = ({
  faqs,
  onEdit,
  onDelete,
  onView,
  className,
}: FaqCardsProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium font-display">No FAQs found</h3>
        <p className="text-muted-foreground">
          Start by adding your first FAQ item.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {faqs.map((faq) => {
        const isExpanded = expandedCard === faq.id;

        return (
          <Card
            key={faq.id}
            className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
          >
            <CardContent className="p-0">
              {/* Question - User Side */}
              <div className="flex items-start gap-4 p-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          User
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs border-gray-300",
                              getCategoryColor(faq.category)
                            )}
                          >
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {faq.question}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(faq.views)} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(faq.lastUpdated)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
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
                </div>
              </div>

              {/* Answer - Bot Side */}
              <div className="flex items-start gap-4 p-6 bg-white">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      AI Assistant
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs border-gray-300",
                        getStatusColor(faq.status)
                      )}
                    >
                      {faq.status}
                    </Badge>
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
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {isExpanded ? faq.answer : truncateText(faq.answer, 150)}
                    </p>
                    {faq.answer.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(faq.id)}
                        className="mt-2 p-0 h-auto text-xs text-blue-600 hover:text-blue-800 hover:bg-transparent"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show more
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Tags and Additional Info */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex gap-1 flex-wrap">
                      {faq.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {faq.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          +{faq.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {faq.views > 1000 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">
                            Trending
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        by {faq.createdBy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FaqCards;
