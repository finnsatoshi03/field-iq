import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "../constants";
import {
  FAQ_CATEGORIES,
  FAQ_STATUS,
  type FaqCategory,
  type FaqStatus,
} from "../constants";
import { validateFaqItem, generateId } from "../utils";

interface EditFaqDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FaqItem | null;
  onSave: (faq: FaqItem) => void;
  mode: "add" | "edit";
}

const EditFaqDialog = ({
  isOpen,
  onClose,
  faq,
  onSave,
  mode,
}: EditFaqDialogProps) => {
  const [formData, setFormData] = useState<Partial<FaqItem>>({
    question: "",
    answer: "",
    category: "General",
    status: "draft",
    priority: 5,
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "edit" && faq) {
      setFormData(faq);
    } else if (mode === "add") {
      setFormData({
        question: "",
        answer: "",
        category: "General",
        status: "draft",
        priority: 5,
        tags: [],
      });
    }
    setErrors([]);
  }, [mode, faq, isOpen]);

  const handleInputChange = (field: keyof FaqItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    const validationErrors = validateFaqItem(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const faqToSave: FaqItem = {
      id: faq?.id || generateId(),
      question: formData.question!,
      answer: formData.answer!,
      category: formData.category as FaqCategory,
      status: formData.status as FaqStatus,
      priority: formData.priority!,
      views: faq?.views || 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdBy: faq?.createdBy || "Admin",
      tags: formData.tags || [],
    };

    onSave(faqToSave);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
      status: "draft",
      priority: 5,
      tags: [],
    });
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold font-display text-lg">
            {mode === "add" ? "Add New FAQ" : "Edit FAQ"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new frequently asked question and answer."
              : "Edit the selected FAQ item."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              placeholder="Enter the question..."
              value={formData.question || ""}
              onChange={(e) => handleInputChange("question", e.target.value)}
              className={cn(
                errors.some((e) => e.includes("Question")) && "border-red-300",
              )}
            />
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer..."
              value={formData.answer || ""}
              onChange={(e) => handleInputChange("answer", e.target.value)}
              rows={6}
              className={cn(
                errors.some((e) => e.includes("Answer")) && "border-red-300",
              )}
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {FAQ_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FAQ_STATUS.ACTIVE}>Active</SelectItem>
                  <SelectItem value={FAQ_STATUS.DRAFT}>Draft</SelectItem>
                  <SelectItem value={FAQ_STATUS.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority * (1-10)</Label>
            <Select
              value={formData.priority?.toString()}
              onValueChange={(value) =>
                handleInputChange("priority", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((priority) => (
                  <SelectItem key={priority} value={priority.toString()}>
                    {priority} -{" "}
                    {priority <= 3 ? "High" : priority <= 6 ? "Medium" : "Low"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Enter a tag and press Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          {mode === "edit" && faq && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views:</span>
                  <span className="font-medium">
                    {faq.views.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created by:</span>
                  <span className="font-medium">{faq.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span className="font-medium">{faq.lastUpdated}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "add" ? "Add FAQ" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFaqDialog;
