import { utils, writeFile, type WorkBook } from "xlsx";

import type {
  AdminDealerIssueApiItem,
  AdminFaqItem,
  AdminFarmApiItem,
  AdminPerformanceMetric,
  AdminSalesItem,
  SalesGoal,
} from "@/features/admin/types";

// Types for the data we'll be exporting
export interface AdminExportData {
  salesActivity: AdminSalesItem[];
  dealerIssues: AdminDealerIssueApiItem[];
  faqs: AdminFaqItem[];
  users: any[]; // User type from auth service
  farmRegistrations: AdminFarmApiItem[];
  feedPerformance: AdminPerformanceMetric[];
  salesGoals?: SalesGoal[]; // Optional sales goals data
}

// Service class for handling Excel exports
export class ExcelExportService {
  /**
   * Export admin data to Excel file with multiple sheets
   */
  static async exportAdminData(
    data: AdminExportData,
    filename?: string,
  ): Promise<void> {
    try {
      const workbook: WorkBook = utils.book_new();

      // Sales Activity Sheet
      if (data.salesActivity && data.salesActivity.length > 0) {
        const salesSheet = this.createSalesActivitySheet(data.salesActivity);
        utils.book_append_sheet(workbook, salesSheet, "Sales Activity");
      }

      // Dealer Issues Sheet
      if (data.dealerIssues && data.dealerIssues.length > 0) {
        const dealerSheet = this.createDealerIssuesSheet(data.dealerIssues);
        utils.book_append_sheet(workbook, dealerSheet, "Dealer Issues");
      }

      // FAQs Sheet
      if (data.faqs && data.faqs.length > 0) {
        const faqSheet = this.createFaqsSheet(data.faqs);
        utils.book_append_sheet(workbook, faqSheet, "FAQs");
      }

      // Users Sheet
      if (data.users && data.users.length > 0) {
        const usersSheet = this.createUsersSheet(data.users);
        utils.book_append_sheet(workbook, usersSheet, "Users");
      }

      // Farm Registrations Sheet
      if (data.farmRegistrations && data.farmRegistrations.length > 0) {
        const farmSheet = this.createFarmRegistrationsSheet(
          data.farmRegistrations,
        );
        utils.book_append_sheet(workbook, farmSheet, "Farm Registrations");
      }

      // Feed Performance Sheet
      if (data.feedPerformance && data.feedPerformance.length > 0) {
        const feedSheet = this.createFeedPerformanceSheet(data.feedPerformance);
        utils.book_append_sheet(workbook, feedSheet, "Feed Performance");
      }

      // Sales Goals Sheet
      if (data.salesGoals && data.salesGoals.length > 0) {
        const goalsSheet = this.createSalesGoalsSheet(data.salesGoals);
        utils.book_append_sheet(workbook, goalsSheet, "Sales Goals");
      }

      // Generate filename with timestamp if not provided
      const exportFilename =
        filename ||
        `admin-dashboard-export-${new Date().toISOString().split("T")[0]}.xlsx`;

      // Write the file
      writeFile(workbook, exportFilename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw new Error("Failed to export data to Excel");
    }
  }

  /**
   * Create Sales Activity sheet
   */
  private static createSalesActivitySheet(salesData: AdminSalesItem[]) {
    const formattedData = salesData.map((item) => ({
      ID: item.id || "N/A",
      "Sales Rep": item.rep || "N/A",
      Region: item.region || "N/A",
      "Target Influence": item.targetInfluence
        ? `₱${item.targetInfluence.toLocaleString()}`
        : "₱0",
      "Closed Sales": item.closedSales
        ? `₱${item.closedSales.toLocaleString()}`
        : "₱0",
      "Success Rate":
        item.targetInfluence > 0
          ? `${((item.closedSales / item.targetInfluence) * 100).toFixed(1)}%`
          : "0%",
      "Growth Rate": item.growthRate ? `${item.growthRate.toFixed(1)}%` : "0%",
      Period: item.period || "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Dealer Issues sheet
   */
  private static createDealerIssuesSheet(
    dealerData: AdminDealerIssueApiItem[],
  ) {
    const formattedData: any[] = [];

    dealerData.forEach((dealer) => {
      // Create a row for each issue
      dealer.issues.forEach((issue) => {
        formattedData.push({
          "Dealer ID": dealer.id,
          "Dealer Name": dealer.dealerName || "N/A",
          "Dealer Code": dealer.dealerCode || "N/A",
          "Location Address": dealer.location?.address || "N/A",
          Region: dealer.location?.region || "N/A",
          "Contact Person": dealer.contactPerson || "N/A",
          Phone: dealer.phone || "N/A",
          Email: dealer.email || "N/A",
          "Issue Type": issue.type || "N/A",
          "Issue Description": issue.description || "N/A",
          Priority: issue.priority || "N/A",
          Status: issue.status || "N/A",
          "Overall Severity": dealer.severity || "N/A",
          "Reported Date": issue.reportedDate
            ? new Date(issue.reportedDate).toLocaleDateString()
            : "N/A",
          "Last Updated": dealer.lastUpdated
            ? new Date(dealer.lastUpdated).toLocaleDateString()
            : "N/A",
        });
      });
    });

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create FAQs sheet
   */
  private static createFaqsSheet(faqData: AdminFaqItem[]) {
    const formattedData = faqData.map((item) => ({
      ID: item.id,
      Question: item.question || "N/A",
      Answer: item.answer || "N/A",
      Category: item.category || "N/A",
      Status: item.status || "N/A",
      Priority: item.priority || 0,
      Views: item.views || 0,
      "Is Featured": item.is_featured ? "Yes" : "No",
      "Created By": item.createdBy || "N/A",
      "Last Updated": item.lastUpdated
        ? new Date(item.lastUpdated).toLocaleDateString()
        : "N/A",
      Tags: Array.isArray(item.tags) ? item.tags.join(", ") : "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Users sheet
   */
  private static createUsersSheet(userData: any[]) {
    const formattedData = userData.map((item) => ({
      ID: item.id || "N/A",
      Email: item.email || "N/A",
      "Full Name":
        item.user_metadata?.full_name || item.user_metadata?.name || "N/A",
      Role: item.user_metadata?.role || "N/A",
      "Phone Number": item.user_metadata?.phone_number || item.phone || "N/A",
      "Email Confirmed": item.email_confirmed_at ? "Yes" : "No",
      "Phone Confirmed": item.phone_confirmed_at ? "Yes" : "No",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Last Sign In": item.last_sign_in_at
        ? new Date(item.last_sign_in_at).toLocaleDateString()
        : "Never",
      "Sign In Count": item.raw_user_meta_data?.sign_in_count || 0,
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Farm Registrations sheet
   */
  private static createFarmRegistrationsSheet(farmData: AdminFarmApiItem[]) {
    const formattedData: any[] = [];

    farmData.forEach((item) => {
      // Each farm registration can have multiple farm details
      item.farmer.farmer_details.forEach((farm) => {
        formattedData.push({
          "Company ID": item.company_id,
          "Farmer ID": item.farmer.id,
          "Farmer First Name": item.farmer.first_name || "N/A",
          "Farmer Last Name": item.farmer.last_name || "N/A",
          "Farm ID": farm.id,
          "Farm Name": farm.farm_name || "N/A",
          "Farm Type": farm.farm_type || "N/A",
          "Farm Size": farm.farm_size ? `${farm.farm_size} hectares` : "N/A",
          "Current Feed": farm.current_feed || "N/A",
          "Days on Feed": farm.days_on_feed || "N/A",
          Latitude: farm.latitude || "N/A",
          Longitude: farm.longitude || "N/A",
          "Location City": farm.location_city || "N/A",
          "Location Barangay": farm.location_barangay || "N/A",
          "Location Province": farm.location_province || "N/A",
          "Sales Rep ID": item.salesrep.id,
          "Sales Rep First Name": item.salesrep.first_name || "N/A",
          "Sales Rep Last Name": item.salesrep.last_name || "N/A",
          "Sales Rep Territory":
            item.salesrep.salesrep_details?.[0]?.territory || "N/A",
          "Sales Rep Employee ID":
            item.salesrep.salesrep_details?.[0]?.employee_id || "N/A",
          "Monthly Quota":
            item.salesrep.salesrep_details?.[0]?.quota_monthly || "N/A",
          "Farm Created": farm.created_at
            ? new Date(farm.created_at).toLocaleDateString()
            : "N/A",
          "Farm Updated": farm.updated_at
            ? new Date(farm.updated_at).toLocaleDateString()
            : "N/A",
        });
      });
    });

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Feed Performance sheet
   */
  private static createFeedPerformanceSheet(
    feedData: AdminPerformanceMetric[],
  ) {
    const formattedData = feedData.map((item) => ({
      ID: item.id,
      "Product ID": item.productId,
      "Product Name": item.productName || "N/A",
      "Farm ID": item.farmId,
      "Farm Name": item.farmName || "N/A",
      Region: item.region || "N/A",
      Province: item.province || "N/A",
      "GPS Latitude": item.gpsCoordinates?.lat || "N/A",
      "GPS Longitude": item.gpsCoordinates?.lng || "N/A",
      "Batch Size": item.batchSize || "N/A",
      "Days on Feed": item.daysOnFeed || "N/A",
      FCR: item.fcr || "N/A",
      "Weight Gain": item.weightGain ? `${item.weightGain} kg` : "N/A",
      "Mortality Rate": item.mortality ? `${item.mortality}%` : "N/A",
      "Average Weight": item.avgWeight ? `${item.avgWeight} kg` : "N/A",
      "Feed Intake": item.feedIntake ? `${item.feedIntake} kg` : "N/A",
      "Weather Condition": item.weatherCondition || "N/A",
      "Management Score": item.managementScore || "N/A",
      "Record Date": item.recordDate
        ? new Date(item.recordDate).toLocaleDateString()
        : "N/A",
      "Reported By": item.reportedBy || "N/A",
      Verified: item.verified ? "Yes" : "No",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Sales Goals sheet
   */
  private static createSalesGoalsSheet(goalsData: SalesGoal[]) {
    const formattedData = goalsData.map((item) => ({
      ID: item.id,
      "Company ID": item.company_id,
      "Target Amount": item.target_amount
        ? `₱${item.target_amount.toLocaleString()}`
        : "₱0",
      "Period Start": item.period_start
        ? new Date(item.period_start).toLocaleDateString()
        : "N/A",
      "Period End": item.period_end
        ? new Date(item.period_end).toLocaleDateString()
        : "N/A",
      Status: item.status || "N/A",
      "Created By": item.created_by || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Updated Date": item.updated_at
        ? new Date(item.updated_at).toLocaleDateString()
        : "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create a summary sheet with overview data
   */
  static createSummarySheet(data: AdminExportData) {
    const summary = [
      ["Admin Dashboard Export Summary"],
      [""],
      ["Export Date", new Date().toLocaleDateString()],
      ["Export Time", new Date().toLocaleTimeString()],
      [""],
      ["Data Summary:"],
      ["Sales Activity Records", data.salesActivity?.length || 0],
      ["Dealer Issues", data.dealerIssues?.length || 0],
      ["FAQs", data.faqs?.length || 0],
      ["Users", data.users?.length || 0],
      ["Farm Registrations", data.farmRegistrations?.length || 0],
      ["Feed Performance Records", data.feedPerformance?.length || 0],
      ["Sales Goals", data.salesGoals?.length || 0],
    ];

    return utils.aoa_to_sheet(summary);
  }
}
