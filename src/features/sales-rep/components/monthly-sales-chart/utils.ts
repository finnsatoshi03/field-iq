import type { MonthlySalesData } from "./constants";

export const calculateTotalVolumeInfluenced = (data: MonthlySalesData[]) => {
  return data.reduce((sum, entry) => sum + entry.volumeInfluenced, 0);
};

export const calculateTotalClosedSales = (data: MonthlySalesData[]) => {
  return data.reduce((sum, entry) => sum + entry.closedSales, 0);
};

export const calculateAverageVolumeInfluenced = (data: MonthlySalesData[]) => {
  return calculateTotalVolumeInfluenced(data) / data.length;
};

export const calculateAverageClosedSales = (data: MonthlySalesData[]) => {
  return calculateTotalClosedSales(data) / data.length;
};
