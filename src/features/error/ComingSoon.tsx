import React from "react";
import { Smartphone, Monitor } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export default function ComingSoon({
  title = "Coming Soon to Desktop",
  message = "We're building mobile-first! This feature is currently optimized for mobile devices. Desktop version coming soon.",
  children,
}: ComingSoonProps) {
  // const handleMobileRedirect = () => {
  //   // You can add logic here to redirect to mobile version or show instructions
  //   window.open(window.location.href, "_blank");
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     handleMobileRedirect();
  //   }
  // };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="relative">
        <Monitor className="text-muted-foreground size-16" />
        <Smartphone className="text-primary absolute -bottom-2 -right-2 size-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>

        <div className="text-muted-foreground mt-4 text-sm">
          <p>
            For the best experience, please access this site on a mobile device.
          </p>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>

      {/* <Button
        onClick={handleMobileRedirect}
        className="flex items-center gap-2"
        tabIndex={0}
        aria-label="Open in mobile view"
        onKeyDown={handleKeyDown}
      >
        <Smartphone className="size-4" />
        View Mobile Version
      </Button> */}
    </div>
  );
}
