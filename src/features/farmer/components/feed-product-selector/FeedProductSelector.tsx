import { Info, Shield, Target, Wheat, Zap } from "lucide-react";
import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFeedProducts, type FeedProduct } from "@/hooks/use-feed-products";

interface FeedProductSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  companyId?: number;
  disabledProductId?: number;
}

export const FeedProductSelector: React.FC<FeedProductSelectorProps> = ({
  value,
  onValueChange,
  companyId,
  disabledProductId,
}) => {
  const id = useId();
  const { data: feedProducts, isLoading, error } = useFeedProducts(companyId);

  const getProductIcon = (product: FeedProduct) => {
    if (product.is_medicated) {
      return <Shield className="opacity-60" size={24} aria-hidden="true" />;
    }
    if (product.feed_stage?.includes("starter")) {
      return <Zap className="opacity-60" size={24} aria-hidden="true" />;
    }
    if (product.target_animal_type) {
      return <Target className="opacity-60" size={24} aria-hidden="true" />;
    }
    return <Wheat className="opacity-60" size={24} aria-hidden="true" />;
  };

  const getTooltipContent = (product: FeedProduct) => {
    return {
      goal: product.goal,
      stage: product.feed_stage?.replace(/_/g, " "),
      animal: product.target_animal_type?.replace(/_/g, " "),
      ageRange:
        product.age_range_start && product.age_range_end
          ? product.age_range_start === 1
            ? `Day 1 - ${product.age_range_end} days`
            : `${product.age_range_start} - ${product.age_range_end} days`
          : null,
      category: product.category,
      isMediated: product.is_medicated,
      usp: product.usp,
      format: product.product_format?.replace(/_/g, " "),
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Feed Product</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border rounded-md px-3 py-4 text-center animate-pulse"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Feed Product</Label>
        <div className="border border-red-200 rounded-md p-4 bg-red-50">
          <p className="text-sm text-red-700">
            Failed to load feed products. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!feedProducts || feedProducts.length === 0) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Feed Product</Label>
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            No feed products available. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            Select Feed Product ({feedProducts.length} available)
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4  cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Choose the feed product that best matches your animals' needs.
                Hover over each option for more details.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <RadioGroup
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          value={value}
          onValueChange={onValueChange}
        >
          {feedProducts.map((product) => {
            const isDisabled = disabledProductId === product.id;
            const isCurrentFeed = isDisabled;

            return (
              <Tooltip key={product.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-3 rounded-md border px-3 py-4 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed bg-muted"
                        : "cursor-pointer hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      id={`${id}-${product.id}`}
                      value={product.id.toString()}
                      className="sr-only"
                      disabled={isDisabled}
                    />
                    {getProductIcon(product)}
                    <label
                      htmlFor={`${id}-${product.id}`}
                      className={`text-xs leading-none font-medium after:absolute after:inset-0 ${
                        isDisabled
                          ? "text-muted-foreground cursor-not-allowed"
                          : "text-foreground cursor-pointer"
                      }`}
                    >
                      {product.name || "Unnamed Product"}
                      {isCurrentFeed && (
                        <span className="block text-xs text-green-600 font-medium mt-1">
                          Current Feed
                        </span>
                      )}
                    </label>
                    {product.is_medicated && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                    {isCurrentFeed && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      {product.product_line && (
                        <p className="text-xs ">{product.product_line}</p>
                      )}
                    </div>

                    {(() => {
                      const details = getTooltipContent(product);
                      return (
                        <div className="space-y-1">
                          {details.goal && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium  min-w-0">
                                Goal:
                              </span>
                              <span className="text-xs flex-1">
                                {details.goal}
                              </span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                            {details.stage && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium ">
                                  Stage:
                                </span>
                                <span className="text-xs capitalize">
                                  {details.stage}
                                </span>
                              </div>
                            )}

                            {details.animal && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium ">
                                  Animal:
                                </span>
                                <span className="text-xs capitalize">
                                  {details.animal}
                                </span>
                              </div>
                            )}

                            {details.ageRange && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium ">
                                  Age:
                                </span>
                                <span className="text-xs">
                                  {details.ageRange}
                                </span>
                              </div>
                            )}

                            {details.category && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium ">
                                  Type:
                                </span>
                                <span className="text-xs">
                                  {details.category}
                                </span>
                              </div>
                            )}

                            {details.format && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium ">
                                  Format:
                                </span>
                                <span className="text-xs capitalize">
                                  {details.format}
                                </span>
                              </div>
                            )}

                            {details.isMediated && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-red-600">
                                  ⚠️ Medicated
                                </span>
                              </div>
                            )}
                          </div>

                          {details.usp && (
                            <div className="pt-1 border-t border-border">
                              <p className="text-xs  italic">"{details.usp}"</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </RadioGroup>
      </div>
    </TooltipProvider>
  );
};
