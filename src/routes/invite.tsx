import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { UpdatePasswordAlertDialog } from "@/features/auth/components/update-password-alert-dialog";
import { getDefaultDashboardRoute } from "@/lib/rbac";
import { authService } from "@/services/auth-service";
import { transformSupabaseUser, useUserStore } from "@/store/user-store";

export const Route = createFileRoute("/invite")({
  // No beforeLoad auth check for invite route
  component: InviteSetup,
});

function InviteSetup() {
  const [showInviteSetup, setShowInviteSetup] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [userRole, setUserRole] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(true);
  const { setUser } = useUserStore();

  // Manual auth sync function
  const syncAuthState = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (session?.user) {
        const userProfile = transformSupabaseUser(session.user);
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error syncing auth state:", error);
    }
  };

  useEffect(() => {
    // Parse hash parameters for invite flow
    const parseHashParams = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return Object.fromEntries(params);
    };

    const hashParams = parseHashParams();

    // Check if this is an invite flow
    if (
      hashParams.type === "invite" &&
      hashParams.access_token &&
      hashParams.refresh_token
    ) {
      const handleInviteFlow = async () => {
        try {
          // Set session with the tokens
          const { error } = await authService.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token,
          });

          if (error) {
            console.error("Error setting session:", error);
            // Redirect to sign-in on error
            window.location.href = "/auth/sign-in";
          } else {
            // Get user info to show email in dialog
            const user = await authService.getCurrentUser();
            setUserEmail(user?.email);
            setUserRole(user?.user_metadata?.role);
            setShowInviteSetup(true);
            setIsProcessing(false);

            // Sync user store with the new session
            await syncAuthState();

            // Clear the hash to clean up URL
            window.history.replaceState(null, "", window.location.pathname);
          }
        } catch (error) {
          console.error("Error handling invite flow:", error);
          // Redirect to sign-in on error
          window.location.href = "/auth/sign-in";
        }
      };

      handleInviteFlow();
    } else {
      // No valid invite parameters, redirect to sign-in
      window.location.href = "/auth/sign-in";
    }
  }, [setUser]);

  const handleInviteComplete = async () => {
    setShowInviteSetup(false);

    try {
      // Wait a moment for password update to complete and session to refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sync auth state first to get latest session info
      await syncAuthState();

      // Check if user is still authenticated after password setup
      const session = await authService.getCurrentSession();
      const user = await authService.getCurrentUser();

      if (session && user) {
        // User is still authenticated, redirect to their dashboard
        const dashboardRoute = getDefaultDashboardRoute(
          user.user_metadata?.role || userRole || "farmer",
        );
        window.location.href = dashboardRoute;
      } else {
        // Session was lost, redirect to sign-in
        window.location.href = "/auth/sign-in";
      }
    } catch (error) {
      console.error("Error checking session after password setup:", error);
      // Fallback to sign-in on error
      window.location.href = "/auth/sign-in";
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full p-4 max-w-md">
            <div className="space-y-10">
              <div className="space-y-2">
                <h1 className="text-2xl font-medium font-display">
                  Processing Invitation...
                </h1>
                <p className="text-sm max-w-xs leading-4">
                  Please wait while we set up your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full p-4 max-w-md">
          <div className="space-y-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium font-display">
                Welcome to the Platform!
              </h1>
              <p className="text-sm max-w-xs leading-4">
                Complete your account setup by creating a secure password.
              </p>
            </div>

            <UpdatePasswordAlertDialog
              open={showInviteSetup}
              onComplete={handleInviteComplete}
              userEmail={userEmail}
              type="invite"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
