import { useState } from "react";
import { Users, Mail, Database } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { UsersTable } from "@/features/admin/components/users-table";
import { EmailLinkGenerator } from "@/features/admin/components/email-link-generator";
import { useGetUsers } from "@/features/auth/mutations/admin-mutations";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/_authenticated/dev/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsers();
  const { user } = useUser();

  // Security check - only dev users should see this page
  if (user?.role !== "dev") {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            Developer role required to access this page.
          </p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.email_confirmed_at).length;
  const recentUsers = users.filter((u) => {
    const created = new Date(u.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Developer Console
          </h1>
          <p className="text-muted-foreground">
            Manage users, generate email links, and oversee system operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Links
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Users</h3>
          </div>
          <div className="text-2xl font-bold">
            {usersLoading ? "Loading..." : usersError ? "Error" : totalUsers}
          </div>
          <p className="text-xs text-muted-foreground">
            {verifiedUsers} verified
          </p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Recent Users</h3>
          </div>
          <div className="text-2xl font-bold">
            {usersLoading ? "..." : recentUsers}
          </div>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Database</h3>
          </div>
          <div className="text-2xl font-bold">
            {usersError ? "Error" : "Active"}
          </div>
          <p className="text-xs text-muted-foreground">Supabase admin API</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Your Role</h3>
          </div>
          <div className="text-2xl font-bold">Developer</div>
          <p className="text-xs text-muted-foreground">Full admin access</p>
        </div>
      </div>

      {/* Users Management Section */}
      <div className="space-y-4">
        <UsersTable />
      </div>

      {/* Email Link Generator Dialog */}
      <EmailLinkGenerator
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
      />
    </div>
  );
}
