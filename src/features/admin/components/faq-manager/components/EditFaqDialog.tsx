import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { FaqItem } from "../constants";
import { FAQ_CATEGORIES } from "../constants";

// Zod schema for FAQ validation
const faqFormSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(10, "Question must be at least 10 characters"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .min(20, "Answer must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  priority: z
    .number()
    .int()
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10"),
  is_featured: z.boolean(),
  tags: z.array(z.string()),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

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
  const [newTag, setNewTag] = useState("");

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "general_inquiry",
      status: "draft",
      priority: 4,
      is_featured: false,
      tags: [],
    },
  });

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && faq) {
        form.reset({
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          status: faq.status,
          priority: faq.priority,
          is_featured: faq.is_featured || false,
          tags: faq.tags || [],
        });
      } else if (mode === "add") {
        form.reset({
          question: "",
          answer: "",
          category: "general_inquiry",
          status: "draft",
          priority: 4,
          is_featured: false,
          tags: [],
        });
      }
    }
  }, [mode, faq, isOpen, form]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(newTag.trim())) {
        form.setValue("tags", [...currentTags, newTag.trim()]);
        setNewTag("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = (values: FaqFormValues) => {
    const faqToSave: FaqItem = {
      id: faq?.id || Date.now(),
      question: values.question,
      answer: values.answer,
      category: values.category,
      status: values.status,
      priority: values.priority,
      views: faq?.views || 0,
      lastUpdated: new Date().toISOString(),
      createdBy: faq?.createdBy || "Admin",
      tags: values.tags,
      is_featured: values.is_featured,
    };

    onSave(faqToSave);
    handleCancel();
  };

  const handleCancel = () => {
    form.reset();
    setNewTag("");
    onClose();
  };

  const currentTags = form.watch("tags");

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the question..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the answer..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FAQ_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Priority and Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority * (1-10)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (priority) => (
                            <SelectItem
                              key={priority}
                              value={priority.toString()}
                            >
                              {priority} -{" "}
                              {priority <= 2
                                ? "High"
                                : priority <= 3
                                  ? "Medium"
                                  : "Low"}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <div className="flex items-center space-x-2 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label className="text-sm font-normal">
                        Mark this FAQ as featured
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {currentTags && currentTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTags.map((tag) => (
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
                    <span className="font-medium">
                      {new Date(faq.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  {faq.is_featured && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Featured:</span>
                      <Badge variant="secondary" className="text-xs">
                        Featured FAQ
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? mode === "add"
                    ? "Adding..."
                    : "Saving..."
                  : mode === "add"
                    ? "Add FAQ"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFaqDialog;
