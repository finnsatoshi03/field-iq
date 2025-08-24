import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  ChevronDownIcon,
  Clock,
  Info,
  Mail,
  MapPinIcon,
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
import { formatDate } from "../../../admin/components/faq-manager/utils";

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

const LIVESTOCK_TYPES = [
  {
    value: "broilers",
    label: "Broilers (Chicken)",
    description: "Fast-growing chickens raised primarily for meat production",
    disabled: false,
  },
  {
    value: "layers",
    label: "Layers (Chicken)",
    description: "Hens bred specifically for high egg production",
    disabled: false,
  },
  {
    value: "native",
    label: "Native (Chicken)",
    description: "Indigenous chicken breeds adapted to local conditions",
    disabled: false,
  },
  {
    value: "ducks",
    label: "Ducks",
    description: "Waterfowl raised for meat, eggs, or both",
    disabled: true, // Temporarily disabled
  },
  {
    value: "hogs",
    label: "Hogs (Pigs)",
    description: "Swine raised for pork production",
    disabled: true, // Temporarily disabled
  },
];

// Utility function to get island group from region code
const getIslandGroupFromRegion = (regionCode: RegionCode): string | null => {
  for (const [island, regions] of Object.entries(REGIONS_BY_ISLAND)) {
    if (regions.some((region) => region.code === regionCode)) {
      return island.toLowerCase();
    }
  }
  return null;
};

// Utility function to get available regions for sales rep based on their territory
const getAvailableRegionsForSalesRep = (
  salesRepRegion: string | null,
): RegionCode[] => {
  if (!salesRepRegion) {
    // If no region specified, return all regions
    return Object.values(REGIONS_BY_ISLAND)
      .flat()
      .map((region) => region.code);
  }

  // Find which island group the sales rep belongs to
  const islandGroup = getIslandGroupFromRegion(salesRepRegion as RegionCode);

  if (!islandGroup) {
    // If region not found, return all regions as fallback
    return Object.values(REGIONS_BY_ISLAND)
      .flat()
      .map((region) => region.code);
  }

  // Return only the region codes for the sales rep's island group
  const islandKey = islandGroup.charAt(0).toUpperCase() + islandGroup.slice(1);
  return (
    REGIONS_BY_ISLAND[islandKey as keyof typeof REGIONS_BY_ISLAND]?.map(
      (region) => region.code,
    ) || []
  );
};

// Helper function to get formatted island group name
const getFormattedIslandGroupName = (regionCode: string | null): string => {
  if (!regionCode) return "";
  const islandGroup = getIslandGroupFromRegion(regionCode as RegionCode);
  if (!islandGroup) return "";
  return islandGroup.charAt(0).toUpperCase() + islandGroup.slice(1);
};

// Helper function to get cities based on region code
const getCitiesForRegion = (regionCode: string): string[] => {
  if (!regionCode) return [];

  // Map of region codes to their cities
  const regionCities: Record<string, string[]> = {
    // National Capital Region (NCR)
    NCR: [
      "Caloocan",
      "Las Piñas",
      "Makati",
      "Malabon",
      "Mandaluyong",
      "Manila",
      "Marikina",
      "Muntinlupa",
      "Navotas",
      "Parañaque",
      "Pasay",
      "Pasig",
      "Quezon City",
      "San Juan",
      "Taguig",
      "Valenzuela",
    ],

    // Cordillera Administrative Region (CAR)
    CAR: ["Baguio"],

    // Region I - Ilocos Region
    "Region I": [
      "Batac",
      "Laoag",
      "Candon",
      "Vigan",
      "San Fernando",
      "Alaminos",
      "Dagupan",
      "San Carlos",
      "Urdaneta",
    ],

    // Region II - Cagayan Valley
    "Region II": ["Tuguegarao", "Cauayan", "Ilagan", "Santiago"],

    // Region III - Central Luzon
    "Region III": [
      "Balanga",
      "Malolos",
      "Meycauayan",
      "San Jose del Monte",
      "Cabanatuan",
      "Gapan",
      "Muñoz",
      "Palayan",
      "Angeles",
      "Mabalacat",
      "San Fernando",
      "Tarlac",
      "Olongapo",
    ],

    // Region IV-A - CALABARZON
    "Region IV-A": [
      "Batangas City",
      "Lipa",
      "Tanauan",
      "Bacoor",
      "Cavite City",
      "Dasmariñas",
      "Imus",
      "Tagaytay",
      "Trece Martires",
      "Biñan",
      "Cabuyao",
      "San Pablo",
      "Santa Rosa",
      "Lucena",
      "Tayabas",
      "Antipolo",
      "Calamba",
    ],

    // Region IV-B - MIMAROPA
    "Region IV-B": ["Calapan", "Puerto Princesa"],

    // Region V - Bicol Region
    "Region V": [
      "Legazpi",
      "Ligao",
      "Tabaco",
      "Iriga",
      "Naga",
      "Masbate City",
      "Sorsogon City",
    ],

    // Region VI - Western Visayas
    "Region VI": [
      "Roxas",
      "Iloilo City",
      "Passi",
      "Bacolod",
      "Bago",
      "Cadiz",
      "Escalante",
      "Himamaylan",
      "Kabankalan",
      "La Carlota",
      "Sagay",
      "San Carlos",
      "Silay",
      "Sipalay",
      "Talisay",
      "Victorias",
    ],

    // Region VII - Central Visayas
    "Region VII": [
      "Tagbilaran",
      "Bais",
      "Bayawan",
      "Canlaon",
      "Dumaguete",
      "Guihulngan",
      "Tanjay",
      "Toledo",
      "Talisay",
      "Naga",
      "Mandaue",
      "Lapu-Lapu",
      "Danao",
      "Cebu City",
      "Carcar",
      "Bogo",
    ],

    // Region VIII - Eastern Visayas
    "Region VIII": [
      "Borongan",
      "Calbayog",
      "Catbalogan",
      "Maasin",
      "Ormoc",
      "Tacloban",
    ],

    // Region IX - Zamboanga Peninsula
    "Region IX": ["Dapitan", "Dipolog", "Pagadian", "Zamboanga City"],

    // Region X - Northern Mindanao
    "Region X": [
      "Cagayan de Oro",
      "El Salvador",
      "Gingoog",
      "Iligan",
      "Malaybalay",
      "Oroquieta",
      "Ozamiz",
      "Tangub",
      "Valencia",
    ],

    // Region XI - Davao Region
    "Region XI": ["Davao City", "Digos", "Mati", "Panabo", "Samal", "Tagum"],

    // Region XII - SOCCSKSARGEN
    "Region XII": ["General Santos", "Kidapawan", "Koronadal", "Tacurong"],

    // Region XIII - Caraga
    "Region XIII": [
      "Bayugan",
      "Bislig",
      "Butuan",
      "Cabadbaran",
      "Surigao",
      "Tandag",
    ],

    // Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)
    BARMM: ["Cotabato City", "Lamitan", "Marawi"],
  };

  return regionCities[regionCode] || [];
};

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

  // New farmer fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [livestockType, setLivestockType] = useState("");

  const { user } = useUserStore();
  const {
    data: farmersData = [],
    isLoading,
    error,
  } = useGetFarmersByCompanyId(companyId || undefined);

  const generateEmailLinkMutation = useGenerateEmailLink();
  const createUserMutation = useCreateUser();
  const inviteUserMutation = useInviteUserByEmail();

  const selectedType = EMAIL_LINK_TYPES.find((type) => type.value === linkType);

  // Get available regions based on sales rep's territory
  const availableRegionCodes = getAvailableRegionsForSalesRep(
    user?.territory_region || null,
  );

  // Get available cities based on selected region
  const availableCities = region ? getCitiesForRegion(region) : [];

  // Convert cities to ComboboxOption format
  const cityOptions: ComboboxOption[] = useMemo(
    () =>
      availableCities.map((city) => ({
        label: city,
        value: city,
      })),
    [availableCities],
  );

  // Handle region change - clear location when region changes
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setLocation(""); // Clear selected city when region changes
  };

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

    // Validate required farmer fields
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!region.trim()) {
      toast.error("Region is required");
      return;
    }
    if (!livestockType.trim()) {
      toast.error("Livestock type is required");
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
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          mobile_number: mobileNumber.trim() || null,
          location: location.trim(),
          region: region.trim(),
          livestock_type: livestockType.trim(),
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
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            mobile_number: mobileNumber.trim() || null,
            location: location.trim(),
            region: region.trim(),
            livestock_type: livestockType.trim(),
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
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          mobile_number: mobileNumber.trim() || null,
          location: location.trim(),
          region: region.trim(),
          livestock_type: livestockType.trim(),
        },
      };
    } else {
      params.options = {
        data: {
          role: "farmer",
          created_by: user?.id || null,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          mobile_number: mobileNumber.trim() || null,
          location: location.trim(),
          region: region.trim(),
          livestock_type: livestockType.trim(),
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
    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setLocation("");
    setRegion("");
    setLivestockType("");
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

            {/* Farmer Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Cruz"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile-number">Mobile Number (Optional)</Label>
              <Input
                id="mobile-number"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+63 9XX XXX XXXX"
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="region">Region</Label>
                  {user?.territory_region && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center"
                            aria-label="Region restriction information"
                          >
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            You can only register farmers in regions within your
                            territory (
                            {getFormattedIslandGroupName(user.territory_region)}{" "}
                            island group).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between truncate"
                    >
                      {region
                        ? Object.values(REGIONS_BY_ISLAND)
                            .flat()
                            .find((r) => r.code === region)?.name || region
                        : "Select region"}
                      <ChevronDownIcon
                        className="ml-2 h-4 w-4 opacity-60"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
                    {Object.entries(REGIONS_BY_ISLAND)
                      .filter(([island]) => {
                        // Only show regions from the sales rep's island group
                        if (!user?.territory_region) return true;
                        const salesRepIsland = getIslandGroupFromRegion(
                          user.territory_region as RegionCode,
                        );
                        return (
                          !salesRepIsland ||
                          island.toLowerCase() === salesRepIsland
                        );
                      })
                      .map(([island, regions]) => (
                        <div key={island}>
                          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                            {island} Island Group
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            {regions
                              .filter((region) =>
                                availableRegionCodes.includes(region.code),
                              )
                              .map((regionData) => (
                                <DropdownMenuItem
                                  key={regionData.code}
                                  onClick={() =>
                                    handleRegionChange(regionData.code)
                                  }
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
                                        {regionData.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {regionData.description}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                        </div>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {user?.territory_region &&
                  availableRegionCodes.length <
                    Object.values(REGIONS_BY_ISLAND).flat().length && (
                    <p className="text-xs text-muted-foreground">
                      Showing regions for{" "}
                      {getFormattedIslandGroupName(user.territory_region)}{" "}
                      territory only
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">City/Municipality</Label>
                <Combobox
                  options={cityOptions}
                  value={location}
                  onValueChange={setLocation}
                  placeholder={
                    region ? "Search or select city..." : "Select region first"
                  }
                  searchPlaceholder="Search cities..."
                  disabled={!region || availableCities.length === 0}
                  contentClassName="w-[220px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="livestock-type">Livestock Type</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center"
                        aria-label="Livestock type information"
                      >
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Broilers:</strong> Fast-growing chickens for
                          meat
                        </p>
                        <p>
                          <strong>Layers:</strong> Hens for egg production
                        </p>
                        <p>
                          <strong>Native:</strong> Indigenous chicken breeds
                        </p>
                        <p>
                          <strong>Ducks:</strong> Waterfowl for meat/eggs
                        </p>
                        <p>
                          <strong>Hogs:</strong> Pigs for pork (coming soon)
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={livestockType}
                onValueChange={(value: string) => setLivestockType(value)}
                required
              >
                <SelectTrigger id="livestock-type">
                  <SelectValue placeholder="Select livestock type" />
                </SelectTrigger>
                <SelectContent>
                  {LIVESTOCK_TYPES.map((livestock) => (
                    <SelectItem
                      key={livestock.value}
                      value={livestock.value}
                      disabled={livestock.disabled}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={
                            livestock.disabled ? "text-muted-foreground" : ""
                          }
                        >
                          {livestock.label}
                        </span>
                        {livestock.disabled && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Coming Soon)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={
                  isPending ||
                  !email ||
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !location.trim() ||
                  !region.trim() ||
                  !livestockType.trim()
                }
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
