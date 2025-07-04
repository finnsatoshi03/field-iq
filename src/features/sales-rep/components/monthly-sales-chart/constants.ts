// Types
export interface MonthlySalesData {
  month: string;
  volumeInfluenced: number;
  closedSales: number;
}

// Mock Data
// export const mockMonthlySalesData: MonthlySalesData[] = [
//   { month: "Jan", volumeInfluenced: 45000, closedSales: 32000 },
//   { month: "Feb", volumeInfluenced: 52000, closedSales: 38000 },
//   { month: "Mar", volumeInfluenced: 48000, closedSales: 35000 },
//   { month: "Apr", volumeInfluenced: 61000, closedSales: 42000 },
//   { month: "May", volumeInfluenced: 55000, closedSales: 39000 },
//   { month: "Jun", volumeInfluenced: 67000, closedSales: 48000 },
//   { month: "Jul", volumeInfluenced: 72000, closedSales: 52000 },
//   { month: "Aug", volumeInfluenced: 68000, closedSales: 49000 },
//   { month: "Sep", volumeInfluenced: 63000, closedSales: 45000 },
//   { month: "Oct", volumeInfluenced: 71000, closedSales: 51000 },
//   { month: "Nov", volumeInfluenced: 69000, closedSales: 47000 },
//   { month: "Dec", volumeInfluenced: 74000, closedSales: 54000 },
// ];

export interface MonthlySalesAPIResponse {
  monthly_sales: { [key: string]: number }; // e.g., { "2025-07": 52000 }
  average_sales: number;
}
export async function fetchMonthlySalesData(userId: number = 3): Promise<{
  data: MonthlySalesData[];
  average: number;
}> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/salesrep/monthly-sales?user_id=${userId}`);
    const result: MonthlySalesAPIResponse = await response.json();

        
    const data: MonthlySalesData[] = Object.entries(result.data.monthly_sales).map(
      ([monthKey, data]) => {
        const date = new Date(`${monthKey}-01`);
        const month = date.toLocaleString("default", { month: "short" }); // "Jan", "Feb", ...
        return {
          month,
          volumeInfluenced: 0, // set properly if your API returns it
          closedSales: data.closedSales,
        };
      }
    );

    return {
      data,
      average: result.data.average_sales,
    };
  } catch (error) {
    console.error("Failed to fetch monthly sales data:", error);
    return { data: [], average: 0 };
  }
}

