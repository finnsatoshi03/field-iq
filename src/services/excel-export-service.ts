import { utils, writeFile, type WorkBook } from "xlsx";

// Types for the data we'll be exporting
export interface AdminExportData {
  salesActivity: any[];
  dealerIssues: any[];
  faqs: any[];
  users: any[];
  farmRegistrations: any[];
  feedPerformance: any[];
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

      // Sales Rep Issues Sheet
      if (data.dealerIssues && data.dealerIssues.length > 0) {
        const dealerSheet = this.createDealerIssuesSheet(data.dealerIssues);
        utils.book_append_sheet(workbook, dealerSheet, "Sales Rep Issues");
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
  private static createSalesActivitySheet(salesData: any[]) {
    const formattedData = salesData.map((item) => ({
      "Sales Rep": item.sales_rep_name || item.name || "N/A",
      Region: item.region || "N/A",
      "Volume Influenced": item.influenced_volume_amount
        ? `₱${item.influenced_volume_amount.toLocaleString()}`
        : "₱0",
      "Closed Sales": item.closed_sales_amount
        ? `₱${item.closed_sales_amount.toLocaleString()}`
        : "₱0",
      "Success Rate":
        item.influenced_volume_amount > 0
          ? `${((item.closed_sales_amount / item.influenced_volume_amount) * 100).toFixed(1)}%`
          : "0%",
      "Growth Rate": item.growth_rate
        ? `${item.growth_rate.toFixed(1)}%`
        : "0%",
      "Last Updated": item.last_updated
        ? new Date(item.last_updated).toLocaleDateString()
        : "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Sales Rep Issues sheet
   */
  private static createDealerIssuesSheet(dealerData: any[]) {
    const formattedData = dealerData.map((item) => ({
      "Sales Rep Name": item.name || "N/A",
      Location: item.location || "N/A",
      "Issue Type": item.issue_type || "N/A",
      "Issue Description": item.issue_description || "N/A",
      Priority: item.priority || "N/A",
      Status: item.status || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Updated Date": item.updated_at
        ? new Date(item.updated_at).toLocaleDateString()
        : "N/A",
      "Assigned To": item.assigned_to || "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create FAQs sheet
   */
  private static createFaqsSheet(faqData: any[]) {
    const formattedData = faqData.map((item) => ({
      Question: item.question || "N/A",
      Answer: item.answer || "N/A",
      Category: item.category || "N/A",
      "Created By": item.created_by_name || item.created_by || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Updated Date": item.updated_at
        ? new Date(item.updated_at).toLocaleDateString()
        : "N/A",
      Status: item.is_active ? "Active" : "Inactive",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Users sheet
   */
  private static createUsersSheet(userData: any[]) {
    const formattedData = userData.map((item) => ({
      Name: item.name || "N/A",
      Email: item.email || "N/A",
      Role: item.role || "N/A",
      Department: item.department || "N/A",
      Status: item.is_active ? "Active" : "Inactive",
      Phone: item.phone || "N/A",
      Region: item.region || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Last Login": item.last_login
        ? new Date(item.last_login).toLocaleDateString()
        : "Never",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Farm Registrations sheet
   */
  private static createFarmRegistrationsSheet(farmData: any[]) {
    const formattedData = farmData.map((item) => ({
      "Farm Name": item.farm_name || item.name || "N/A",
      "Farmer Name": item.farmer_name || item.owner_name || "N/A",
      Location: item.location || "N/A",
      Region: item.region || "N/A",
      "Farm Size": item.farm_size ? `${item.farm_size} hectares` : "N/A",
      "Crop Type": item.crop_type || "N/A",
      "Registration Date": item.registration_date
        ? new Date(item.registration_date).toLocaleDateString()
        : "N/A",
      "Contact Number": item.contact_number || "N/A",
      Status: item.status || "N/A",
      "Assigned Sales Rep": item.assigned_sales_rep || "N/A",
    }));

    return utils.json_to_sheet(formattedData);
  }

  /**
   * Create Feed Performance sheet
   */
  private static createFeedPerformanceSheet(feedData: any[]) {
    const formattedData = feedData.map((item) => ({
      "Farm Name": item.farmName || "N/A",
      "Product Name": item.productName || "N/A",
      Region: item.region || "N/A",
      Province: item.province || "N/A",
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
      ["Sales Rep Issues", data.dealerIssues?.length || 0],
      ["FAQs", data.faqs?.length || 0],
      ["Users", data.users?.length || 0],
      ["Farm Registrations", data.farmRegistrations?.length || 0],
      ["Feed Performance Records", data.feedPerformance?.length || 0],
    ];

    return utils.aoa_to_sheet(summary);
  }
}
