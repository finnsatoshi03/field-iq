// Types
export interface MonthlySalesData {
  month: string;
  volumeInfluenced: number;
  closedSales: number;
}

// Mock Data
export const mockMonthlySalesData: MonthlySalesData[] = [
  { month: "Jan", volumeInfluenced: 45000, closedSales: 32000 },
  { month: "Feb", volumeInfluenced: 52000, closedSales: 38000 },
  { month: "Mar", volumeInfluenced: 48000, closedSales: 35000 },
  { month: "Apr", volumeInfluenced: 61000, closedSales: 42000 },
  { month: "May", volumeInfluenced: 55000, closedSales: 39000 },
  { month: "Jun", volumeInfluenced: 67000, closedSales: 48000 },
  { month: "Jul", volumeInfluenced: 72000, closedSales: 52000 },
  { month: "Aug", volumeInfluenced: 68000, closedSales: 49000 },
  { month: "Sep", volumeInfluenced: 63000, closedSales: 45000 },
  { month: "Oct", volumeInfluenced: 71000, closedSales: 51000 },
  { month: "Nov", volumeInfluenced: 69000, closedSales: 47000 },
  { month: "Dec", volumeInfluenced: 74000, closedSales: 54000 },
];
