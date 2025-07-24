// Sales Rep API Response Types

export interface MonthlySalesData {
  month: string;
  volumeInfluenced: number;
  closedSales: number;
}

export interface MonthlySalesResponse {
  message: string;
  data: {
    monthly_sales: MonthlySalesData[];
    average_sales: number;
  };
}
