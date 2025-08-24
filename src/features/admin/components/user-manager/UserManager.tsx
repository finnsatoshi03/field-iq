import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  ChevronDownIcon,
  Clock,
  Mail,
  MapPinIcon,
  Maximize2,
  Send,
  Shield,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  useCreateUser,
  useGenerateEmailLink,
  useGetFarmersByCompanyId,
  useGetUsers,
  useInviteUserByEmail,
} from "@/features/auth/mutations/admin-mutations";
import { REGIONS_BY_ISLAND, type RegionCode } from "@/lib/consts";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import type {
  EmailLinkType,
  GenerateEmailLinkParams,
  InviteUserParams,
} from "@/services/admin-service";
import { useUserStore } from "@/store";
import { toast } from "sonner";
import { formatDate } from "../faq-manager/utils";

const EMAIL_LINK_TYPES = [
  {
    value: "signup" as EmailLinkType,
    label: "Sign Up",
    description: "Create a new user account",
    requiresPassword: true,
    supportsRole: true,
    icon: UserPlus,
  },
  {
    value: "invite" as EmailLinkType,
    label: "Invitation",
    description: "Invite user to join (passwordless)",
    requiresPassword: false,
    supportsRole: true,
    icon: Mail,
  },
];

const USER_ROLES = [
  {
    value: "sales_rep" as UserRole,
    label: "Sales Representative",
    description: "Client relations and sales activities",
  },
];

interface UserManagerProps {
  className?: string;
  companyId?: number | null;
}

export const UserManager = ({ className, companyId }: UserManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [linkType, setLinkType] = useState<EmailLinkType>("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("sales_rep");
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "">("");

  const { user } = useUserStore();
  const {
    data: users = [],
    isLoading,
    error,
  } = useGetUsers(companyId || undefined);
  const { data: farmers = [], isLoading: isLoadingFarmers } =
    useGetFarmersByCompanyId(companyId || undefined);

  const generateEmailLinkMutation = useGenerateEmailLink();
  const createUserMutation = useCreateUser();
  const inviteUserMutation = useInviteUserByEmail();

  const selectedType = EMAIL_LINK_TYPES.find((type) => type.value === linkType);

  // Calculate metrics from real user data
  const metrics = useMemo(() => {
    const total = users.length;
    const farmersCount = farmers.length;
    const salesReps = users.filter(
      (user) => user.user_metadata?.role === "sales_rep",
    ).length;
    const active = users.filter((user) => user.last_sign_in_at).length;
    const inactive = users.filter((user) => !user.last_sign_in_at).length;

    return { total, farmers: farmersCount, salesReps, active, inactive };
  }, [users, farmers]);

  // Get recent users (last 5)
  const recentUsers = useMemo(() => {
    return users
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    // Validate region is required for sales reps
    if (selectedType?.supportsRole && !selectedRegion) {
      toast.error("Region is required for sales representatives");
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
        user_metadata: selectedType?.supportsRole
          ? {
              role: selectedRole,
              created_by: user?.id || null,
              region: selectedRegion || null,
            }
          : undefined,
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
          // Always redirect invites to the dedicated invite route
          redirectTo: redirectTo || "https://www.fieldiq.ph/invite",
          ...(selectedType?.supportsRole && {
            data: {
              role: selectedRole,
              created_by: user?.id || null,
              region: selectedRegion || null,
            },
          }),
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
    if (redirectTo || selectedType?.supportsRole) {
      params.options = {
        ...(redirectTo && { redirectTo }),
        ...(selectedType?.supportsRole && {
          data: {
            role: selectedRole,
            created_by: user?.id || null,
            region: selectedRegion || null,
          },
        }),
      };
    }

    generateEmailLinkMutation.mutate(params);
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setRedirectTo("");
    setLinkType("invite");
    setSelectedRole("sales_rep");
    setSelectedRegion("");
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

  const getUserRoleIcon = (role?: string) => {
    switch (role) {
      case "farmer":
        return <Shield className="h-3 w-3 text-muted-foreground" />;
      case "sales_rep":
        return <TrendingUp className="h-3 w-3 text-muted-foreground" />;
      default:
        return <Users className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getUserStatusIcon = (lastSignIn: string | null) => {
    if (lastSignIn) {
      return <CheckCircle className="h-3 w-3 text-muted-foreground" />;
    }
    return <Clock className="h-3 w-3 text-muted-foreground" />;
  };

  const getUserStatusColor = (lastSignIn: string | null) => {
    if (lastSignIn) {
      return "bg-background text-foreground border-border";
    }
    return "bg-muted/50 text-muted-foreground border-border";
  };

  const renderCompactView = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
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
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Unable to load users</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      );
    }

    // Empty state
    if (users.length === 0) {
      return (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-display font-medium text-foreground mb-2">
            No users found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            User data will appear here once users are registered.
          </p>
          <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite first user
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg border border-border bg-background">
            <div className="text-2xl font-semibold text-foreground">
              {metrics.total}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total Users
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-background">
            <div className="text-2xl font-semibold text-foreground">
              {metrics.active}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Active Users
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-background">
            <div className="text-2xl font-semibold text-foreground">
              {metrics.farmers}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Farmers
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-background">
            <div className="text-2xl font-semibold text-foreground">
              {metrics.salesReps}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Sales Reps
            </div>
          </div>
        </div>

        {/* Sales Representatives */}
        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">
              Sales Representatives
            </h4>
            <Badge
              variant="outline"
              className="font-medium rounded-full border-border bg-background text-foreground text-xs"
            >
              {metrics.salesReps} Total
            </Badge>
          </div>

          {/* Mini User Previews */}
          <div className="space-y-3">
            {recentUsers
              .filter((user) => user.user_metadata?.role === "sales_rep")
              .map((user) => (
                <div
                  key={user.id}
                  className="bg-background rounded-lg p-3 border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-foreground">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1">
                          {getUserRoleIcon(user.user_metadata?.role)}
                          <p className="text-xs text-muted-foreground">
                            {user.user_metadata?.role === "farmer"
                              ? "Farmer"
                              : user.user_metadata?.role === "sales_rep"
                                ? "Sales Representative"
                                : "User"}
                          </p>
                        </div>
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
              ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">
              Sales representative management
            </span>
          </div>
        </div>

        {/* Farmers */}
        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Company Farmers</h4>
            <Badge
              variant="outline"
              className="font-medium rounded-full border-border bg-background text-foreground text-xs"
            >
              {metrics.farmers} Total
            </Badge>
          </div>

          {/* Mini Farmer Previews */}
          <div className="space-y-3">
            {isLoadingFarmers ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-background rounded-lg p-3 border border-border animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : farmers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No farmers found</p>
                <p className="text-xs">Created by sales representatives</p>
              </div>
            ) : (
              farmers.slice(0, 3).map((farmer) => (
                <div
                  key={farmer.id}
                  className="bg-background rounded-lg p-3 border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {farmer.email}
                        </p>
                        <p className="text-xs text-muted-foreground">Farmer</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getUserStatusColor(farmer.last_sign_in_at)}`}
                    >
                      {getUserStatusIcon(farmer.last_sign_in_at)}
                      <span className="ml-1">
                        {farmer.last_sign_in_at ? "Active" : "Pending"}
                      </span>
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined: {formatDate(farmer.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">
              Farmer visibility and oversight
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "bg-background rounded-lg border border-border pt-4 space-y-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-foreground font-medium text-base tracking-tight">
            User Manager
          </h3>
          <p className="text-muted-foreground text-xs">
            Manage sales representatives and view farmers under your company
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] flex flex-col lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="gap-0 space-y-0">
              <DialogTitle className="font-semibold text-lg">
                User Management Dashboard
              </DialogTitle>
              <DialogDescription>
                Manage sales representatives and view farmers under your company
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              {/* Quick Actions */}
              <div className="-mx-6 px-6 py-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setLinkType("invite");
                      setSelectedRole("sales_rep");
                      setIsInviteDialogOpen(true);
                    }}
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-background hover:bg-muted/50 text-foreground border-border"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span className="font-medium">Invite Sales Rep</span>
                    <span className="text-xs text-muted-foreground">
                      Send invitation email
                    </span>
                  </Button>

                  <Button
                    onClick={() => {
                      setLinkType("signup");
                      setIsInviteDialogOpen(true);
                    }}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 border-border text-foreground hover:bg-muted/50"
                  >
                    <UserCheck className="h-6 w-6" />
                    <span className="font-medium">Create Account</span>
                    <span className="text-xs text-muted-foreground">
                      Generate signup link
                    </span>
                  </Button>
                </div>

                {/* Note about farmer management */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Farmer Management
                      </p>
                      <p className="text-blue-700 dark:text-blue-300 text-xs">
                        Sales representatives are responsible for creating and
                        managing farmers. You can view all farmers under your
                        company below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User List */}
                  <Card className="border-border bg-background">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Recent Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border animate-pulse"
                            >
                              <div className="w-8 h-8 bg-muted rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {users.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                              <h3 className="font-display font-medium text-foreground mb-2">
                                No users found
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                User data will appear here once users are
                                registered.
                              </p>
                              <Button
                                onClick={() => setIsInviteDialogOpen(true)}
                                className="gap-2"
                              >
                                <UserPlus className="h-4 w-4" />
                                Invite first user
                              </Button>
                            </div>
                          ) : (
                            recentUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-foreground">
                                      {user.email.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {user.email}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      {getUserRoleIcon(
                                        user.user_metadata?.role,
                                      )}
                                      <p className="text-xs text-muted-foreground">
                                        {user.user_metadata?.role === "farmer"
                                          ? "Farmer"
                                          : user.user_metadata?.role ===
                                              "sales_rep"
                                            ? "Sales Representative"
                                            : "User"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={getUserStatusColor(
                                    user.last_sign_in_at,
                                  )}
                                >
                                  {getUserStatusIcon(user.last_sign_in_at)}
                                  <span className="ml-1">
                                    {user.last_sign_in_at
                                      ? "Active"
                                      : "Pending"}
                                  </span>
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Farmers List */}
                  <Card className="border-border bg-background">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Company Farmers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingFarmers ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border animate-pulse"
                            >
                              <div className="w-8 h-8 bg-muted rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {farmers.length === 0 ? (
                            <div className="text-center py-8">
                              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                              <h3 className="font-display font-medium text-foreground mb-2">
                                No farmers found
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Farmers will appear here once created by sales
                                representatives.
                              </p>
                            </div>
                          ) : (
                            farmers.slice(0, 5).map((farmer) => (
                              <div
                                key={farmer.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {farmer.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Farmer
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={getUserStatusColor(
                                    farmer.last_sign_in_at,
                                  )}
                                >
                                  {getUserStatusIcon(farmer.last_sign_in_at)}
                                  <span className="ml-1">
                                    {farmer.last_sign_in_at
                                      ? "Active"
                                      : "Pending"}
                                  </span>
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* User Statistics */}
                  <Card className="border-border bg-background">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        User Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 rounded-lg bg-background border border-border">
                            <div className="text-2xl font-bold text-foreground">
                              {metrics.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Users
                            </div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-background border border-border">
                            <div className="text-2xl font-bold text-foreground">
                              {metrics.active}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Active Users
                            </div>
                          </div>
                        </div>
                        <Separator className="bg-border" />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                Farmers
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {metrics.farmers}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                Sales Representatives
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {metrics.salesReps}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                Pending Activation
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {metrics.inactive}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compact View Content */}
      <div className="px-4">{renderCompactView()}</div>

      {/* Footer */}
      <div className="px-4 bg-muted/20 py-4">
        <div className="text-xs text-muted-foreground">
          Sales representative management and farmer visibility
        </div>
      </div>

      {/* Email Link Generator Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {selectedType?.label} Link Generator
            </DialogTitle>
            <DialogDescription>
              Generate authentication email links for sales representatives.
              Links will be copied to your clipboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
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

            {selectedType?.supportsRole && (
              <div className="space-y-2">
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-between")}
                    >
                      {selectedRegion
                        ? Object.values(REGIONS_BY_ISLAND)
                            .flat()
                            .find((region) => region.code === selectedRegion)
                            ?.name || selectedRegion
                        : "Select region"}
                      <ChevronDownIcon
                        className="ml-2 h-4 w-4 opacity-60"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[450px] max-h-[300px] overflow-y-auto">
                    {Object.entries(REGIONS_BY_ISLAND).map(
                      ([island, regions]) => (
                        <div key={island}>
                          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                            {island} Island Group
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            {regions.map((region) => (
                              <DropdownMenuItem
                                key={region.code}
                                onClick={() => setSelectedRegion(region.code)}
                                className="flex flex-col items-start py-2"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <MapPinIcon
                                    size={16}
                                    className="opacity-60 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {region.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {region.description}
                                    </span>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                        </div>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {!selectedRegion && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select a region for the sales representative
                  </p>
                )}
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
                    ? `https://www.fieldiq.ph/invite (default for invites)`
                    : "https://yourapp.com/dashboard"
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !email ||
                  (selectedType?.supportsRole && !selectedRegion)
                }
                className="flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                {isPending
                  ? linkType === "signup"
                    ? "Creating User..."
                    : "Generating..."
                  : linkType === "signup"
                    ? "Create User"
                    : "Generate Link"}
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
