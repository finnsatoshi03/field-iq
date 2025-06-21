import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Header } from "@/components/custom/header";

export const Route = createFileRoute("/_public")({
  component: PublicLayoutComponent,
});

function PublicLayoutComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
