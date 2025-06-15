import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../../lib/types";
import { DEV_MODE, AUTH_BYPASS_CONFIG } from "@/lib/config";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth based on bypass configuration
  useEffect(() => {
    const initializeAuth = () => {
      setIsLoading(true);

      try {
        // If auth bypass is enabled and we're in dev mode
        if (DEV_MODE && AUTH_BYPASS_CONFIG.enabled) {
          const { activeScenario, scenarios } = AUTH_BYPASS_CONFIG;

          if (activeScenario && scenarios[activeScenario]) {
            const bypassUser = scenarios[activeScenario];
            setUser(bypassUser);
          } else {
            // No user scenario (unauthenticated)
            setUser(null);
          }
        } else {
          // Real auth mode - start unauthenticated
          setUser(null);
          console.log("🔐 Real auth mode - user needs to sign in");
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    console.log(email, password);

    try {
      if (DEV_MODE && AUTH_BYPASS_CONFIG.enabled) {
        // In bypass mode, always succeed with the active scenario user
        const { activeScenario, scenarios } = AUTH_BYPASS_CONFIG;

        if (activeScenario && scenarios[activeScenario]) {
          const bypassUser = scenarios[activeScenario];
          setUser(bypassUser);
        } else {
          throw new Error("No active user scenario configured for bypass");
        }
      } else {
        // TODO: Implement real authentication
        throw new Error("Real authentication not implemented yet");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);

    // If bypass is enabled, show what happens next
    if (DEV_MODE && AUTH_BYPASS_CONFIG.enabled) {
      if (AUTH_BYPASS_CONFIG.activeScenario) {
        console.log(
          "🔧 Note: In bypass mode, refresh to get the configured user back"
        );
      } else {
        console.log("🔧 Staying in unauthenticated bypass mode");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
