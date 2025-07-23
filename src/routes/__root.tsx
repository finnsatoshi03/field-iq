import { RefreshCw } from "lucide-react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { useAuthSync } from "@/hooks/use-auth-sync";
import { DEV_MODE } from "@/lib/config";

import { Toaster } from "@/components/ui/sonner";
import { ChatWidget } from "../features/chat-widget/ChatWidget";
import { Error, NotFound } from "../features/error";

const RootComponent = () => {
  // Sync auth state with Zustand store and React Query
  useAuthSync();

  // if (!isMobile) {
  //   return <ComingSoon />;
  // }

  return (
    <>
      <div className="h-screen bg-background">
        <Outlet />
        <ChatWidget />
        <Toaster richColors />
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
