import type { MonthlySalesData } from "./constants";

export const calculateTotalVolumeInfluenced = (data: MonthlySalesData[]) => {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, entry) => sum + (entry?.volumeInfluenced || 0), 0);
};

export const calculateTotalClosedSales = (data: MonthlySalesData[]) => {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, entry) => sum + (entry?.closedSales || 0), 0);
};

export const calculateAverageVolumeInfluenced = (data: MonthlySalesData[]) => {
  if (!data || data.length === 0) return 0;
  return calculateTotalVolumeInfluenced(data) / data.length;
};

export const calculateAverageClosedSales = (data: MonthlySalesData[]) => {
  if (!data || data.length === 0) return 0;
  return calculateTotalClosedSales(data) / data.length;
};
