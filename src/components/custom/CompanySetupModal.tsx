import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  useCreateCompany,
  useUpdateUserCompanyId,
} from "@/features/auth/mutations/company-mutations";
import type { CompanyType } from "@/services/company-service";
import { useUserStore } from "@/store/user-store";

// Phone validation patterns by country
const phonePatterns = {
  PH: /^(\+63|0)9\d{9}$/, // Philippines: +639XXXXXXXXX or 09XXXXXXXXX
  US: /^\+1\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{4}$/, // US: +1 (XXX) XXX-XXXX
  CA: /^\+1\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{4}$/, // Canada: same as US
  MX: /^\+52\s?[0-9]{10}$/, // Mexico: +52 XXXXXXXXXX
  BR: /^\+55\s?[0-9]{2}\s?[0-9]{4,5}-?[0-9]{4}$/, // Brazil: +55 XX XXXXX-XXXX
  AR: /^\+54\s?[0-9]{2,4}\s?[0-9]{4}-?[0-9]{4}$/, // Argentina: +54 XXX XXXX-XXXX
  AU: /^\+61\s?[0-9]{1,2}\s?[0-9]{4}\s?[0-9]{4}$/, // Australia: +61 X XXXX XXXX
  NZ: /^\+64\s?[0-9]{1,2}\s?[0-9]{3}\s?[0-9]{4}$/, // New Zealand: +64 X XXX XXXX
  GB: /^\+44\s?[0-9]{4}\s?[0-9]{6}$/, // UK: +44 XXXX XXXXXX
  DE: /^\+49\s?[0-9]{2,4}\s?[0-9]{3,8}$/, // Germany: +49 XXX XXXXXXX
  FR: /^\+33\s?[0-9]{1}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/, // France: +33 X XX XX XX XX
  IT: /^\+39\s?[0-9]{3,4}\s?[0-9]{3,4}\s?[0-9]{3,4}$/, // Italy: +39 XXX XXX XXXX
  ES: /^\+34\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, // Spain: +34 XXX XXX XXX
  NL: /^\+31\s?[0-9]{1,2}\s?[0-9]{8}$/, // Netherlands: +31 X XXXXXXXX
  BE: /^\+32\s?[0-9]{1,2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/, // Belgium: +32 X XX XX XX
  CH: /^\+41\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/, // Switzerland: +41 XX XXX XX XX
  AT: /^\+43\s?[0-9]{1,4}\s?[0-9]{3,8}$/, // Austria: +43 XXXX XXXXXX
  SE: /^\+46\s?[0-9]{1,3}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/, // Sweden: +46 XXX XXX XX XX
  NO: /^\+47\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{3}$/, // Norway: +47 XXX XX XXX
  DK: /^\+45\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/, // Denmark: +45 XX XX XX XX
  FI: /^\+358\s?[0-9]{1,2}\s?[0-9]{3}\s?[0-9]{4}$/, // Finland: +358 XX XXX XXXX
};

// Create a dynamic schema function that takes the current country
const createCompanySetupSchema = (currentCountry: string) =>
  z.object({
    name: z.string().min(1, "Company name is required"),
    company_type: z.enum(["feed_manufacturer", "distributor", "coop"] as const),
    country: z.string().min(1, "Country is required"),
    timezone: z.string().min(1, "Timezone is required"),
    contact_email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true; // Optional field
        const pattern =
          phonePatterns[currentCountry as keyof typeof phonePatterns];
        return pattern ? pattern.test(val) : true;
      }, "Invalid phone number format for selected country"),
    address: z.string().optional().or(z.literal("")),
  });

type CompanySetupForm = z.infer<ReturnType<typeof createCompanySetupSchema>>;

const companyTypes: { value: CompanyType; label: string }[] = [
  { value: "feed_manufacturer", label: "Feed Manufacturer" },
  { value: "distributor", label: "Distributor" },
  { value: "coop", label: "Cooperative" },
];

const countries = [
  { value: "PH", label: "Philippines" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "BR", label: "Brazil" },
  { value: "AR", label: "Argentina" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "CH", label: "Switzerland" },
  { value: "AT", label: "Austria" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
];

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Manila", label: "Philippine Time (PHT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Toronto", label: "Eastern Time - Canada" },
  { value: "America/Vancouver", label: "Pacific Time - Canada" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
  { value: "Europe/Rome", label: "Central European Time (CET)" },
  { value: "Europe/Madrid", label: "Central European Time (CET)" },
  { value: "Europe/Amsterdam", label: "Central European Time (CET)" },
  { value: "Europe/Brussels", label: "Central European Time (CET)" },
  { value: "Europe/Zurich", label: "Central European Time (CET)" },
  { value: "Europe/Vienna", label: "Central European Time (CET)" },
  { value: "Europe/Stockholm", label: "Central European Time (CET)" },
  { value: "Europe/Oslo", label: "Central European Time (CET)" },
  { value: "Europe/Copenhagen", label: "Central European Time (CET)" },
  { value: "Europe/Helsinki", label: "Eastern European Time (EET)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Australia/Melbourne", label: "Australian Eastern Time (AET)" },
  { value: "Australia/Perth", label: "Australian Western Time (AWT)" },
  { value: "Pacific/Auckland", label: "New Zealand Standard Time (NZST)" },
];

interface CompanySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanySetupModal = ({
  isOpen,
  onClose,
}: CompanySetupModalProps) => {
  const user = useUserStore((state) => state.user);
  const createCompany = useCreateCompany();
  const updateUserCompanyId = useUpdateUserCompanyId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanySetupForm>({
    resolver: zodResolver(createCompanySetupSchema("PH")),
    defaultValues: {
      name: "",
      company_type: "feed_manufacturer",
      country: "PH",
      timezone: "Asia/Manila",
      contact_email: "",
      phone: "",
      address: "",
    },
  });

  // Update schema when country changes
  const currentCountry = form.watch("country");
  useEffect(() => {
    form.clearErrors("phone");
    // Update resolver with new country
    form.formState.errors.phone = undefined;
  }, [currentCountry, form]);

  const handleSubmit = async (data: CompanySetupForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Create the company
      const newCompany = await createCompany.mutateAsync({
        ...data,
        created_by: user.profileId || undefined,
      });

      // Update the user's company_id
      await updateUserCompanyId.mutateAsync({
        userId: user.id,
        companyId: newCompany.id,
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Failed to set up company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal if user gets a company_id
  useEffect(() => {
    if (user?.company_id) {
      onClose();
    }
  }, [user?.company_id, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">Set Up Your Company</DialogTitle>
          <DialogDescription className="text-center">
            Please provide your company information to complete your account
            setup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              placeholder="Enter your company name"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_type">Company Type *</Label>
            <Select
              value={form.watch("company_type")}
              onValueChange={(value: CompanyType) =>
                form.setValue("company_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.company_type && (
              <p className="text-sm text-destructive">
                {form.formState.errors.company_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={form.watch("country")}
              onValueChange={(value) => form.setValue("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.country && (
              <p className="text-sm text-destructive">
                {form.formState.errors.country.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone *</Label>
            <Select
              value={form.watch("timezone")}
              onValueChange={(value) => form.setValue("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.timezone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.timezone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="Enter contact email (optional)"
              {...form.register("contact_email")}
              aria-invalid={!!form.formState.errors.contact_email}
            />
            {form.formState.errors.contact_email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.contact_email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number (optional)"
              {...form.register("phone")}
              aria-invalid={!!form.formState.errors.phone}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phone.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Format:{" "}
              {currentCountry === "PH" && "+639XXXXXXXXX or 09XXXXXXXXX"}
              {currentCountry === "US" && "+1 (XXX) XXX-XXXX"}
              {currentCountry === "CA" && "+1 (XXX) XXX-XXXX"}
              {currentCountry === "GB" && "+44 XXXX XXXXXX"}
              {currentCountry === "AU" && "+61 X XXXX XXXX"}
              {currentCountry !== "PH" &&
                currentCountry !== "US" &&
                currentCountry !== "CA" &&
                currentCountry !== "GB" &&
                currentCountry !== "AU" &&
                "Use international format with country code"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter company address (optional)"
              {...form.register("address")}
              aria-invalid={!!form.formState.errors.address}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full"
            >
              {isSubmitting ? "Setting up..." : "Set Up Company"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
