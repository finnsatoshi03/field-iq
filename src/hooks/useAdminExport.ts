import { useAdminDealerIssues } from "@/features/admin/components/dealer-issue-tracker/hooks";
import { useAdminFaqs } from "@/features/admin/components/faq-manager/hooks";
import { useAdminFarms } from "@/features/admin/components/farm-registration-tracker/hooks";
import { useAdminFarmPerformance } from "@/features/admin/components/feed-performance-tracker/hooks";
import { useAdminSales } from "@/features/admin/components/sales-activity-summary/hooks";
import {
  useGetFarmersByCompanyId,
  useGetUsers,
} from "@/features/auth/mutations/admin-mutations";
import {
  ExcelExportService,
  type AdminExportData,
} from "@/services/excel-export-service";
import { useState } from "react";
import { toast } from "sonner";

interface UseAdminExportParams {
  companyId: number;
}

export const useAdminExport = ({ companyId }: UseAdminExportParams) => {
  const [isExporting, setIsExporting] = useState(false);

  // Fetch all admin data using existing hooks
  const { data: salesData, isLoading: isSalesLoading } =
    useAdminSales(companyId);
  const { data: dealerIssuesData, isLoading: isDealerIssuesLoading } =
    useAdminDealerIssues(companyId);
  const { data: faqsData, isLoading: isFaqsLoading } = useAdminFaqs(companyId);
  const { data: farmsData, isLoading: isFarmsLoading } =
    useAdminFarms(companyId);
  const { data: feedPerformanceData, isLoading: isFeedPerformanceLoading } =
    useAdminFarmPerformance(companyId);
  const { data: usersData, isLoading: isUsersLoading } = useGetUsers(companyId);
  const { data: farmersData, isLoading: isFarmersLoading } =
    useGetFarmersByCompanyId(companyId);

  // Check if any data is still loading
  const isLoading =
    isSalesLoading ||
    isDealerIssuesLoading ||
    isFaqsLoading ||
    isFarmsLoading ||
    isFeedPerformanceLoading ||
    isUsersLoading ||
    isFarmersLoading;

  // Check if all data has been loaded successfully
  const hasData = !!(
    salesData ||
    dealerIssuesData ||
    faqsData ||
    farmsData ||
    feedPerformanceData ||
    usersData ||
    farmersData
  );

  const exportToExcel = async (filename?: string) => {
    if (isLoading) {
      toast.error("Data is still loading. Please wait...");
      return;
    }

    if (!hasData) {
      toast.error("No data available to export");
      return;
    }

    setIsExporting(true);

    try {
      // Prepare data for export
      const exportData: AdminExportData = {
        salesActivity: salesData?.data || [],
        dealerIssues: dealerIssuesData?.data || [],
        faqs: faqsData?.data || [],
        users: [...(usersData || []), ...(farmersData || [])], // Combine users and farmers
        farmRegistrations: farmsData?.data || [],
        feedPerformance: feedPerformanceData?.data || [],
      };

      // Generate filename if not provided
      const exportFilename =
        filename ||
        `admin-dashboard-export-${new Date().toISOString().split("T")[0]}.xlsx`;

      // Export to Excel
      await ExcelExportService.exportAdminData(exportData, exportFilename);

      // Show success message
      toast.success(`Excel file exported successfully: ${exportFilename}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data to Excel. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Get data counts for summary
  const getDataSummary = () => {
    return {
      salesActivity: salesData?.data?.length || 0,
      dealerIssues: dealerIssuesData?.data?.length || 0,
      faqs: faqsData?.data?.length || 0,
      users: (usersData?.length || 0) + (farmersData?.length || 0),
      farmRegistrations: farmsData?.data?.length || 0,
      feedPerformance: feedPerformanceData?.data?.length || 0,
    };
  };

  return {
    exportToExcel,
    isExporting,
    isLoading,
    hasData,
    dataSummary: getDataSummary(),
  };
};
