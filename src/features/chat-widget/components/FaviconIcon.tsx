import { cn } from "@/lib/utils";

interface FaviconIconProps {
  className?: string;
}

export const FaviconIcon = ({ className }: FaviconIconProps) => (
  <img
    src="/favicon.png"
    alt="FieldIQ Brand Logo"
    className={cn("h-8 w-9", className)}
  />
);
