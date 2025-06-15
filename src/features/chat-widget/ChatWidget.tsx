import { useAuth } from "../auth/context";

export const ChatWidget = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Show chat widget on all pages (both authenticated and public)
  return <div className="fixed bottom-4 right-4 z-50">Button</div>;
};
