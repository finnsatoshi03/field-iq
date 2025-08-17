import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DealerIssueTracker,
  FaqManager,
  FarmRegistrationTracker,
  FeedPerformanceTracker,
  SalesActivitySummary,
  UserManager,
} from "@/features/admin/components";
import { useAdminExport } from "@/hooks/useAdminExport";
import { useUserStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useUserStore();

  const companyId = user?.company_id || 0;

  // Excel export functionality
  const {
    exportToExcel,
    isExporting,
    isLoading: isExportDataLoading,
    hasData,
    dataSummary,
  } = useAdminExport({ companyId });

  const handleExportClick = () => {
    exportToExcel();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground mb-1 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground font-sans text-sm">
              Monitor sales performance and administrative metrics
              {user && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  ID: {user.id}
                </span>
              )}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportClick}
                  disabled={isExporting || isExportDataLoading || !hasData}
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      Export Excel
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium mb-1">
                    Export all admin data to Excel
                  </p>
                  <div className="text-xs space-y-1">
                    <p>Sales Activity: {dataSummary.salesActivity} records</p>
                    <p>Dealer Issues: {dataSummary.dealerIssues} records</p>
                    <p>FAQs: {dataSummary.faqs} records</p>
                    <p>Users: {dataSummary.users} records</p>
                    <p>
                      Farm Registrations: {dataSummary.farmRegistrations}{" "}
                      records
                    </p>
                    <p>
                      Feed Performance: {dataSummary.feedPerformance} records
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-6 flex-1 min-h-0 h-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-2 xl:col-span-2 h-fit gap-6 grid grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-2 xl:col-span-2">
              <SalesActivitySummary companyId={companyId} />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <DealerIssueTracker companyId={companyId} />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <FaqManager companyId={companyId} />
            </div>
          </div>
          <div className="xl:col-span-1 space-y-6">
            <UserManager companyId={companyId} />
            <FarmRegistrationTracker companyId={companyId} />
            {/* <CompetitorIntelligence /> */}
            <FeedPerformanceTracker companyId={companyId} />
          </div>
        </div>
      </div>
    </div>
  );
}
