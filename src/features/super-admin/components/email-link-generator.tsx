import { useState } from "react";
import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGenerateEmailLink } from "@/features/auth/mutations/admin-mutations";
import type {
  EmailLinkType,
  GenerateEmailLinkParams,
} from "@/services/admin-service";
import type { UserRole } from "@/lib/types";

const EMAIL_LINK_TYPES = [
  {
    value: "signup" as EmailLinkType,
    label: "Sign Up",
    description: "Create a new user account",
    requiresPassword: true,
    supportsRole: true,
  },
  {
    value: "invite" as EmailLinkType,
    label: "Invitation",
    description: "Invite user to join",
    requiresPassword: false,
    supportsRole: true,
  },
  {
    value: "magiclink" as EmailLinkType,
    label: "Magic Link",
    description: "Passwordless sign-in",
    requiresPassword: false,
    supportsRole: true,
  },
  {
    value: "recovery" as EmailLinkType,
    label: "Password Recovery",
    description: "Reset user password",
    requiresPassword: false,
    supportsRole: false,
  },
  {
    value: "email_change_current" as EmailLinkType,
    label: "Email Change (Current)",
    description: "Confirm current email for change",
    requiresPassword: false,
    requiresNewEmail: true,
    supportsRole: false,
  },
  {
    value: "email_change_new" as EmailLinkType,
    label: "Email Change (New)",
    description: "Confirm new email for change",
    requiresPassword: false,
    requiresNewEmail: true,
    supportsRole: false,
  },
];

const USER_ROLES = [
  {
    value: "farmer" as UserRole,
    label: "Farmer",
    description: "Field operations and crop management",
  },
  {
    value: "sales_rep" as UserRole,
    label: "Sales Representative",
    description: "Client relations and sales activities",
  },
  {
    value: "admin" as UserRole,
    label: "Administrator",
    description: "Full system administration access",
  },
  {
    value: "dev" as UserRole,
    label: "Developer",
    description: "Development and system maintenance",
  },
];

interface EmailLinkGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmailLinkGenerator = ({
  open,
  onOpenChange,
}: EmailLinkGeneratorProps) => {
  const [linkType, setLinkType] = useState<EmailLinkType>("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");

  const generateEmailLinkMutation = useGenerateEmailLink();
  const selectedType = EMAIL_LINK_TYPES.find((type) => type.value === linkType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    const params: GenerateEmailLinkParams = {
      type: linkType,
      email,
    };

    if (selectedType?.requiresPassword && password) {
      params.password = password;
    }

    if (selectedType?.requiresNewEmail && newEmail) {
      params.newEmail = newEmail;
    }

    // Set up options object
    if (redirectTo || selectedType?.supportsRole) {
      params.options = {
        ...(redirectTo && { redirectTo }),
        ...(selectedType?.supportsRole && {
          data: {
            role: selectedRole,
          },
        }),
      };
    }

    generateEmailLinkMutation.mutate(params);
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setNewEmail("");
    setRedirectTo("");
    setLinkType("invite");
    setSelectedRole("farmer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Link Generator
          </DialogTitle>
          <DialogDescription>
            Generate authentication email links for any email address with
            optional role assignment. Links will be copied to your clipboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link-type">Link Type</Label>
              <Select
                value={linkType}
                onValueChange={(value: string) =>
                  setLinkType(value as EmailLinkType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select link type" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_LINK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col text-left leading-none">
                        <span className="font-medium">{type.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {type.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          {selectedType?.requiresPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password for new account"
                required
              />
            </div>
          )}

          {selectedType?.requiresNewEmail && (
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email Address</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                required
              />
            </div>
          )}

          {selectedType?.supportsRole && (
            <div className="space-y-2">
              <Label htmlFor="user-role">User Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: string) =>
                  setSelectedRole(value as UserRole)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col text-left leading-none">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {role.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="redirect-to">Redirect URL (Optional)</Label>
            <Input
              id="redirect-to"
              type="url"
              value={redirectTo}
              onChange={(e) => setRedirectTo(e.target.value)}
              placeholder="https://yourapp.com/dashboard"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={generateEmailLinkMutation.isPending || !email}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {generateEmailLinkMutation.isPending
                ? "Generating..."
                : "Generate Link"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
