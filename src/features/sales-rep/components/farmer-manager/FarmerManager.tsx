import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CheckCircle,
  Clock,
  Mail,
  Send,
  Shield,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ExpandableCard from "@/components/ui/expandable-card";
import {
  useCreateUser,
  useGenerateEmailLink,
  useGetFarmersByCompanyId,
  useInviteUserByEmail,
} from "@/features/auth/mutations/admin-mutations";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import type {
  EmailLinkType,
  GenerateEmailLinkParams,
  InviteUserParams,
} from "@/services/admin-service";
import { useUserStore } from "@/store";
import { toast } from "sonner";
import { formatDate } from "../../../admin/components/faq-manager/utils";
import { useFeedProducts } from "./hooks/useFeedProducts";

const EMAIL_LINK_TYPES = [
  {
    value: "invite" as EmailLinkType,
    label: "Invitation",
    description: "Invite farmer to join (passwordless)",
    requiresPassword: false,
    icon: Mail,
  },
  {
    value: "signup" as EmailLinkType,
    label: "Sign Up",
    description: "Create a new farmer account",
    requiresPassword: true,
    icon: UserPlus,
  },
];

interface FarmerManagerProps {
  className?: string;
  companyId?: number | null;
}

export const FarmerManager = ({ className, companyId }: FarmerManagerProps) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [linkType, setLinkType] = useState<EmailLinkType>("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [selectedFeedProductId, setSelectedFeedProductId] =
    useState<string>("");

  const { user } = useUserStore();
  const {
    data: farmersData = [],
    isLoading,
    error,
  } = useGetFarmersByCompanyId(companyId || undefined);
  const { data: feedProducts = [], isLoading: isLoadingFeedProducts } =
    useFeedProducts({ onlyActive: true });
  const generateEmailLinkMutation = useGenerateEmailLink();
  const createUserMutation = useCreateUser();
  const inviteUserMutation = useInviteUserByEmail();

  const selectedType = EMAIL_LINK_TYPES.find((type) => type.value === linkType);

  // Calculate metrics from farmers data
  const metrics = useMemo(() => {
    const total = farmersData.length;
    const active = farmersData.filter(
      (farmer) => farmer.last_sign_in_at,
    ).length;
    const pending = farmersData.filter(
      (farmer) => !farmer.last_sign_in_at,
    ).length;

    return { total, active, pending };
  }, [farmersData]);

  // Get recent farmers (last 5)
  const recentFarmers = useMemo(() => {
    return farmersData
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [farmersData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;
    if (!selectedFeedProductId) {
      toast.error("Please select a feed product");
      return;
    }

    // For signup, use createUser mutation
    if (linkType === "signup") {
      if (!password) {
        toast.error("Password is required for signup");
        return;
      }

      const userParams = {
        email,
        password,
        user_metadata: {
          role: "farmer" as UserRole,
          created_by: user?.id || null,
          feed_product_id: Number(selectedFeedProductId),
        }, // Always farmer for sales reps
        email_confirm: true,
      };

      createUserMutation.mutate(userParams);
      return;
    }

    // For invite, use inviteUserByEmail mutation
    if (linkType === "invite") {
      const inviteParams: InviteUserParams = {
        email,
        options: {
          redirectTo: redirectTo || "https://www.fieldiq.ph/invite",
          data: {
            role: "farmer", // Always farmer
            created_by: user?.id || null,
            feed_product_id: Number(selectedFeedProductId),
          },
        },
      };

      inviteUserMutation.mutate(inviteParams);
      return;
    }

    // For other link types, use generateEmailLink mutation
    const params: GenerateEmailLinkParams = {
      type: linkType,
      email,
    };

    if (selectedType?.requiresPassword && password) {
      params.password = password;
    }

    // Set up options object
    if (redirectTo) {
      params.options = {
        ...(redirectTo && { redirectTo }),
        data: {
          role: "farmer", // Always farmer
          created_by: user?.id || null,
          feed_product_id: Number(selectedFeedProductId),
        },
      };
    } else {
      params.options = {
        data: {
          role: "farmer",
          created_by: user?.id || null,
          feed_product_id: Number(selectedFeedProductId),
        },
      };
    }

    generateEmailLinkMutation.mutate(params);
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setRedirectTo("");
    setLinkType("invite");
    setSelectedFeedProductId("");
  };

  const handleSuccess = () => {
    handleReset();
    setIsInviteDialogOpen(false);
  };

  // Listen for successful mutation using useEffect
  useEffect(() => {
    if (
      generateEmailLinkMutation.isSuccess ||
      createUserMutation.isSuccess ||
      inviteUserMutation.isSuccess
    ) {
      handleSuccess();
    }
  }, [
    generateEmailLinkMutation.isSuccess,
    createUserMutation.isSuccess,
    inviteUserMutation.isSuccess,
  ]);

  // Check if any mutation is pending
  const isPending =
    generateEmailLinkMutation.isPending ||
    createUserMutation.isPending ||
    inviteUserMutation.isPending;

  const getUserStatusIcon = (lastSignIn: string | null) => {
    if (lastSignIn) {
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    }
    return <Clock className="h-3 w-3 text-orange-500" />;
  };

  const getUserStatusColor = (lastSignIn: string | null) => {
    if (lastSignIn) {
      return "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    }
    return "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
  };

  // Summary content - show invite button and farmer count
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {metrics.total} farmer{metrics.total !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span className="text-xs text-muted-foreground">
            {metrics.active} active
          </span>
        </div>
      </div>
      <Button
        onClick={() => setIsInviteDialogOpen(true)}
        size="sm"
        className="h-8"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite New Farmer
      </Button>
    </div>
  );

  // Full content
  const fullContent = (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="text-center p-3 rounded-lg border border-border bg-muted/20 animate-pulse"
              >
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-muted/20 rounded-lg p-4 border border-border animate-pulse">
            <div className="h-4 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Unable to load farmers</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg border border-border bg-background">
              <div className="text-2xl font-semibold text-foreground">
                {metrics.total}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Total Farmers
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border border-border bg-background">
              <div className="text-2xl font-semibold text-green-600">
                {metrics.active}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Active
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border border-border bg-background">
              <div className="text-2xl font-semibold text-orange-600">
                {metrics.pending}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Pending
              </div>
            </div>
          </div>

          {/* Recent Farmers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Recent Farmers</h4>
              <Badge
                variant="outline"
                className="font-medium rounded-full border-border bg-background text-foreground text-xs"
              >
                {metrics.total} Total
              </Badge>
            </div>

            {/* Mini User Previews */}
            <div className="space-y-3">
              {recentFarmers.length > 0 ? (
                recentFarmers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-background rounded-lg p-3 border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Farmer
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getUserStatusColor(user.last_sign_in_at)}`}
                      >
                        {getUserStatusIcon(user.last_sign_in_at)}
                        <span className="ml-1">
                          {user.last_sign_in_at ? "Active" : "Pending"}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {formatDate(user.created_at)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No farmers registered yet</p>
                  <p className="text-xs">Start by inviting your first farmer</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Farmer management and onboarding
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <ExpandableCard
        title="Farmer Manager"
        summary={summaryContent}
        className="sm:h-fit"
      >
        {fullContent}
      </ExpandableCard>

      {/* Email Link Generator Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {selectedType?.label} Farmer
            </DialogTitle>
            <DialogDescription>
              {linkType === "invite"
                ? "Send an invitation email to a farmer to join your territory."
                : "Create a new farmer account with login credentials."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feed-product">Feed Product</Label>
              <Select
                value={selectedFeedProductId}
                onValueChange={(value: string) =>
                  setSelectedFeedProductId(value)
                }
                disabled={isLoadingFeedProducts}
                required
              >
                <SelectTrigger
                  id="feed-product"
                  aria-label="Select feed product"
                >
                  <SelectValue
                    placeholder={
                      isLoadingFeedProducts
                        ? "Loading products..."
                        : "Select a feed product"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {feedProducts.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No feed products found
                    </div>
                  ) : (
                    feedProducts.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{p.name}</span>
                          {p.category ? (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {p.category}
                            </span>
                          ) : null}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-type">Invitation Type</Label>
              <Select
                value={linkType}
                onValueChange={(value: string) =>
                  setLinkType(value as EmailLinkType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invitation type" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_LINK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <div className="flex flex-col text-left leading-none">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Farmer Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                required
              />
            </div>

            {selectedType?.requiresPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password for new farmer account"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="redirect-to">Redirect URL (Optional)</Label>
              <Input
                id="redirect-to"
                type="url"
                value={redirectTo}
                onChange={(e) => setRedirectTo(e.target.value)}
                disabled={linkType === "invite"}
                placeholder={
                  linkType === "invite"
                    ? "https://www.fieldiq.ph/invite (default for invites)"
                    : "https://yourapp.com/dashboard"
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending || !email || !selectedFeedProductId}
                className="flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                {isPending
                  ? linkType === "signup"
                    ? "Creating Farmer..."
                    : "Sending Invite..."
                  : linkType === "signup"
                    ? "Create Farmer"
                    : "Send Invitation"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
