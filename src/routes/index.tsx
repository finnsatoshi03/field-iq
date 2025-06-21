import { createFileRoute } from "@tanstack/react-router";
import OnBoardingPage from "@/features/pages/OnBoarding";

import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated, user } = useUser();

  // If user is authenticated, show dashboard links
  if (isAuthenticated && user) {
    return <>Auth Dashboard</>;
  }

  // If not authenticated, show public landing page
  return <OnBoardingPage />;
}
