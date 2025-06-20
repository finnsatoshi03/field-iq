import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "logo-word" | "logo";
  theme?: "default" | "light" | "white";
  className?: string;
}

export const Header = ({
  variant = "logo-word",
  theme = "default",
  className,
}: HeaderProps) => {
  const getSrc = () => {
    if (variant === "logo-word") {
      return "/logo.word.svg";
    }

    // For logo variant, handle theme variations
    switch (theme) {
      case "light":
        return "/favicon.light.svg";
      case "white":
        return "/favicon.light.white.svg";
      default:
        return "/favicon.svg";
    }
  };

  const getAltText = () => {
    return variant === "logo-word" ? "FieldIQ Brand Logo" : "FieldIQ Icon";
  };

  return (
    <div className="flex items-center">
      <img
        src={getSrc()}
        alt={getAltText()}
        className={cn("h-12 w-auto", className)}
      />
    </div>
  );
};
