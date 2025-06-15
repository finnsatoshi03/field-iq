import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../features/auth/context";

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
  return (
    <div className="grid">
      <h1>Landing Page</h1>
      <Link to="/auth/sign-in">Sign-in</Link>
    </div>
  );
}
