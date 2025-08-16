import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, HelpCircle, Loader2, Maximize2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EditFaqDialog,
  FaqCards,
  FaqList,
  FaqStats,
  FilterControls,
  ViewToggle,
} from "./components";
import { VIEW_MODES, type FaqItem, type ViewMode } from "./constants";
import {
  useAdminFaqs,
  useCreateFaq,
  useDeleteFaq,
  useUpdateFaq,
} from "./hooks";
import {
  calculateFaqMetrics,
  filterFaqItems,
  formatDate,
  formatNumber,
  getDefaultFilters,
  getFaqsByCategory,
  type FilterOptions,
} from "./utils";

interface FaqManagerProps {
  companyId: number;
}

const FaqManager = ({ companyId }: FaqManagerProps) => {
  const {
    data: faqResponse,
    isLoading,
    isError,
    error,
  } = useAdminFaqs(companyId);
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const [currentView, setCurrentView] = useState<ViewMode>(VIEW_MODES.LIST);
  const [filters, setFilters] = useState<FilterOptions>(getDefaultFilters());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Get FAQ data from API response
  const faqData = faqResponse?.data || [];

  // Filter FAQs based on current filters
  const filteredFaqs = useMemo(() => {
    return filterFaqItems(faqData, filters);
  }, [faqData, filters]);

  // Calculate metrics for filtered data
  const metrics = useMemo(() => {
    return calculateFaqMetrics(filteredFaqs);
  }, [filteredFaqs]);

  const categoryData = useMemo(() => {
    return getFaqsByCategory(filteredFaqs);
  }, [filteredFaqs]);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleAddFaq = () => {
    setSelectedFaq(null);
    setEditMode("add");
    setEditDialogOpen(true);
  };

  const handleEditFaq = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setEditMode("edit");
    setEditDialogOpen(true);
  };

  const handleViewFaq = (faq: FaqItem) => {
    setSelectedFaq(faq);
    // In a real app, you might show a read-only view dialog
    console.log("View FAQ:", faq);
  };

  const handleDeleteFaq = (faq: FaqItem) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFaq = async () => {
    if (faqToDelete) {
      const deletePromise = deleteFaqMutation.mutateAsync(faqToDelete.id);

      toast.promise(deletePromise, {
        loading: "Deleting FAQ...",
        success: "FAQ deleted successfully",
        error: "Failed to delete FAQ",
      });

      try {
        await deletePromise;
        setDeleteDialogOpen(false);
        setFaqToDelete(null);
      } catch (error) {
        console.error("Delete FAQ error:", error);
      }
    }
  };

  const handleSaveFaq = async (faq: FaqItem) => {
    const faqData = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      is_featured: faq.is_featured || false,
    };

    let savePromise: Promise<any>;
    let loadingMessage: string;
    let successMessage: string;

    if (editMode === "add") {
      savePromise = createFaqMutation.mutateAsync(faqData);
      loadingMessage = "Creating FAQ...";
      successMessage = "FAQ created successfully";
    } else {
      savePromise = updateFaqMutation.mutateAsync({
        faqId: faq.id,
        faqData,
      });
      loadingMessage = "Updating FAQ...";
      successMessage = "FAQ updated successfully";
    }

    toast.promise(savePromise, {
      loading: loadingMessage,
      success: successMessage,
      error: `Failed to ${editMode === "add" ? "create" : "update"} FAQ`,
    });

    try {
      await savePromise;
      setEditDialogOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      const action = editMode === "add" ? "create" : "update";
      console.error(`${action} FAQ error:`, error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              FAQ Manager
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Manage frequently asked questions from chat interactions
            </p>
          </div>
        </div>
        <div className="px-4 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading FAQs...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              FAQ Manager
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Manage frequently asked questions from chat interactions
            </p>
          </div>
        </div>
        <div className="px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Failed to load FAQs</p>
            <p className="text-xs text-muted-foreground">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - add this before renderCurrentView
  if (faqData.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              FAQ Manager
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Manage frequently asked questions from chat interactions
            </p>
          </div>
          <Button onClick={handleAddFaq} size="sm" className="gap-1">
            <Plus className="h-3 w-3" />
            Add FAQ
          </Button>
        </div>

        <div className="px-4 py-12 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No FAQs available
            </h3>
            <p className="text-sm mb-4">
              FAQ data will appear here once available from chat interactions.
            </p>
            <Button onClick={handleAddFaq} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first FAQ
            </Button>
          </div>
        </div>

        <div className="px-4 bg-muted/20 py-4">
          <div className="text-xs text-muted-foreground">
            FAQ insights from chat interactions
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEW_MODES.LIST:
        return (
          <FaqList
            faqs={filteredFaqs}
            onEdit={handleEditFaq}
            onDelete={handleDeleteFaq}
            onView={handleViewFaq}
          />
        );
      case VIEW_MODES.CATEGORIES:
        return (
          <div className="space-y-6">
            {/* Category Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryData.slice(0, 4).map((category) => (
                <div
                  key={category.category}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold font-display text-blue-900">
                      {category.category}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {category.count}
                    </Badge>
                  </div>
                  <div className="text-sm text-blue-700">
                    {category.percentage}% of total
                  </div>
                </div>
              ))}
            </div>

            {/* Chat-style FAQ Cards */}
            <div className="space-y-2">
              <h3 className="font-medium font-display text-lg">
                Chat Conversations
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                FAQs displayed as chat conversations between users and AI
                assistant
              </p>
              <FaqCards
                faqs={filteredFaqs}
                onEdit={handleEditFaq}
                onDelete={handleDeleteFaq}
                onView={handleViewFaq}
              />
            </div>
          </div>
        );
      case VIEW_MODES.STATS:
        return <FaqStats faqs={filteredFaqs} />;
      default:
        return (
          <FaqList
            faqs={filteredFaqs}
            onEdit={handleEditFaq}
            onDelete={handleDeleteFaq}
            onView={handleViewFaq}
          />
        );
    }
  };

  const renderCompactView = () => {
    const recentFaqs = filteredFaqs.slice(0, 3);

    return (
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-blue-600">
              {formatNumber(metrics.totalFaqs)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total FAQs
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-green-600">
              {formatNumber(metrics.activeFaqs)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Active FAQs
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-purple-600">
              {formatNumber(metrics.totalViews)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total Views
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-orange-600">
              {formatNumber(metrics.draftFaqs)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Draft FAQs
            </div>
          </div>
        </div>

        {/* Chat Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium font-display text-gray-900">
              Recent Chat Interactions
            </h4>
            <Badge
              variant="outline"
              className="font-display font-medium rounded-full border-blue-300 bg-white text-blue-700 text-xs"
            >
              {formatNumber(metrics.totalViews)} Total Interactions
            </Badge>
          </div>

          {/* Mini Chat Previews */}
          <div className="space-y-3">
            {recentFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">Q</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {faq.question.length > 50
                      ? faq.question.substring(0, 50) + "..."
                      : faq.question}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {formatNumber(faq.views)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(faq.lastUpdated)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-200">
            <HelpCircle className="size-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              AI-powered FAQ insights from user conversations
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            FAQ Manager
          </h3>
          <p className="text-muted-foreground text-xs font-sans">
            Manage frequently asked questions from chat interactions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] flex flex-col lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="gap-0 space-y-0">
              <DialogTitle className="font-semibold font-display text-lg">
                FAQ Management Analytics
              </DialogTitle>
              <DialogDescription>
                Manage frequently asked questions from chat interactions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              {/* Filter Controls */}
              <div className="-mx-6 px-6 py-4 bg-accent">
                <FilterControls
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              {/* View Toggle */}
              <ViewToggle
                currentView={currentView}
                onViewChange={handleViewChange}
              />

              {/* Current View */}
              <div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium font-display">
                    {currentView === VIEW_MODES.LIST
                      ? "Table View"
                      : currentView === VIEW_MODES.CATEGORIES
                        ? "Chat Conversations"
                        : "Analytics Dashboard"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-display font-medium rounded-full border-black text-xs"
                    >
                      {filteredFaqs.length} FAQs
                    </Badge>
                    <Button
                      onClick={handleAddFaq}
                      size="sm"
                      className="gap-1"
                      disabled={createFaqMutation.isPending}
                    >
                      {createFaqMutation.isPending ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          Add FAQ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {renderCurrentView()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compact View Content */}
      <div className="px-4">{renderCompactView()}</div>

      {/* Footer */}
      <div className="px-4 bg-muted/20 py-4">
        <div className="text-xs text-muted-foreground">
          FAQ insights from chat interactions
        </div>
      </div>

      {/* Edit Dialog */}
      <EditFaqDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        faq={selectedFaq}
        onSave={handleSaveFaq}
        mode={editMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ
              item.
              {faqToDelete && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Question:</strong> {faqToDelete.question}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFaqMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFaq}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteFaqMutation.isPending}
            >
              {deleteFaqMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FaqManager;
