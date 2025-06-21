import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";

export const Route = createFileRoute("/auth")({
  beforeLoad: checkAuthRedirect,
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full p-4 max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
