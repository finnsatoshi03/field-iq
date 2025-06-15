import { useState } from "react";
import type { UserRole } from "../../lib/types";
import { getRoleDisplayName } from "../../lib/rbac";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher = ({
  currentRole,
  onRoleChange,
}: RoleSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles: UserRole[] = ["admin", "sales_rep", "farmer"];

  const handleRoleChange = (role: UserRole) => {
    // Update localStorage for testing
    const mockUser = {
      id: "1",
      email: "dev@fieldiq.com",
      name: "Development User",
      role: role,
      isEmailVerified: true,
    };

    localStorage.setItem("mockUser", JSON.stringify(mockUser));
    onRoleChange(role);
    setIsOpen(false);

    // Reload the page to apply the new role
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          🔧 Role: {getRoleDisplayName(currentRole)}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Switch Role (Dev)
            </div>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  role === currentRole
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {getRoleDisplayName(role)}
                {role === currentRole && (
                  <span className="ml-2 text-blue-500">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
