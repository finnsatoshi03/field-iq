import { RefreshCw } from "lucide-react";

import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { DEV_MODE } from "@/lib/config";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useAuthSync } from "@/hooks/use-auth-sync";

import { Toaster } from "@/components/ui/sonner";
import { ChatWidget } from "../features/chat-widget/ChatWidget";
import { Error, NotFound, ComingSoon } from "../features/error";

const RootComponent = () => {
  const isMobile = useIsMobile();

  // Sync auth state with Zustand store and React Query
  useAuthSync();

  if (!isMobile) {
    return <ComingSoon />;
  }

  return (
    <>
      <div className="h-screen p-4 bg-background">
        <Outlet />
        <ChatWidget />
        <Toaster />
      </div>
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => (
    <Error
      title="Something went wrong"
      message={error?.message || "An unexpected error occurred"}
      action={{
        label: "Reload Page",
        onClick: () => window.location.reload(),
        icon: <RefreshCw className="size-4" />,
      }}
    >
      {DEV_MODE && error && (
        <div className="bg-muted mt-4 max-w-md overflow-auto rounded-md p-4 text-left text-sm">
          <p className="font-mono text-xs">{error.toString()}</p>
        </div>
      )}
    </Error>
  ),
  notFoundComponent: () => <NotFound />,
});
