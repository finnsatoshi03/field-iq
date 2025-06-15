import { RefreshCw } from "lucide-react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { DEV_MODE } from "@/lib/config";

import { AuthProvider } from "../features/auth/context";
import { ChatWidget } from "../features/chat-widget/ChatWidget";
import { Error, NotFound } from "../features/error";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Outlet />
            <ChatWidget />
          </div>
          <TanStackRouterDevtools />
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </AuthProvider>
      </QueryClientProvider>
    </>
  ),
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
