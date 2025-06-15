import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../features/auth/context";
import OnBoardingPage from "@/features/pages/OnBoarding";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  // If user is authenticated, show dashboard links
  if (isAuthenticated && user) {
    return <>Auth Dashboard</>;
  }

  // If not authenticated, show public landing page
  return <OnBoardingPage />;
}
