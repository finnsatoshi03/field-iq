import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="grid">
      <h1>Sign In</h1>
      <Link to="/">Back</Link>
    </div>
  );
}
