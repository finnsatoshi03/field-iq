import { createFileRoute } from "@tanstack/react-router";

import OnBoardingPage from "@/features/pages/OnBoarding";
import { checkAuthRedirect } from "@/hooks/use-auth-redirect";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    checkAuthRedirect(location.pathname);
  },
  component: LandingPage,
});

function LandingPage() {
  return <OnBoardingPage />;
}
