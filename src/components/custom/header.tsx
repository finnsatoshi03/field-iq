import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { useSignOut } from "@/features/auth/mutations/sign-out";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  variant?: "logo-word" | "logo";
  theme?: "default" | "light" | "white";
  className?: string;
}

export const Header = ({
  variant = "logo",
  theme = "default",
  className,
}: HeaderProps) => {
  const { user, isAuthenticated, userName } = useUser();
  const signOutMutation = useSignOut();

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

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  // Don't render header for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex items-center">
        <img
          src={getSrc()}
          alt={getAltText()}
          className={cn("h-12 w-auto", className)}
        />
      </div>
    );
  }

  return (
    <header
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src={getSrc()} alt={getAltText()} className="h-8 w-auto" />
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 cursor-pointer">
              <AvatarImage src={user?.avatar_url || undefined} />
              <AvatarFallback className="size-10">
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="text-red-600 focus:text-red-600"
            >
              {signOutMutation.isPending ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
