import React from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { CustomLabel } from "./components";
import { mockMonthlySalesData } from "./constants";
import {
  calculateTotalVolumeInfluenced,
  calculateTotalClosedSales,
  calculateAverageVolumeInfluenced,
  calculateAverageClosedSales,
} from "./utils";

const MonthlySalesChart: React.FC = () => {
  const isMobile = useIsMobile();

  const totalVolumeInfluenced =
    calculateTotalVolumeInfluenced(mockMonthlySalesData);
  const totalClosedSales = calculateTotalClosedSales(mockMonthlySalesData);
  const avgVolumeInfluenced =
    calculateAverageVolumeInfluenced(mockMonthlySalesData);
  const avgClosedSales = calculateAverageClosedSales(mockMonthlySalesData);

  return (
    <div className="bg-card space-y-6 rounded-lg border border-border p-4">
      <div>
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight mb-4">
          My Monthly Sales Influence
        </h3>

        {/* Summary moved to top */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Volume Influenced
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{totalVolumeInfluenced.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Closed Sales
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{totalClosedSales.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockMonthlySalesData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 10,
            }}
            barGap={8}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
                fontFamily: "var(--font-sans)",
              }}
              dy={8}
            />
            <YAxis axisLine={false} tickLine={false} tick={false} width={0} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-48">
                      <p className="text-sm font-medium text-foreground mb-3 font-display">
                        {label}
                      </p>
                      <div className="space-y-2">
                        {payload.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs text-muted-foreground font-sans">
                                {entry.name}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-foreground font-sans ml-4">
                              ₱{entry.value?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Average reference lines */}
            <ReferenceLine
              y={avgVolumeInfluenced}
              stroke="var(--chart-1)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={
                <CustomLabel
                  label="AVG"
                  avgValue={avgVolumeInfluenced}
                  isMobile={isMobile}
                />
              }
            />
            <ReferenceLine
              y={avgClosedSales}
              stroke="var(--chart-2)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={
                <CustomLabel
                  label="AVG"
                  avgValue={avgClosedSales}
                  isMobile={isMobile}
                />
              }
            />

            <Bar
              dataKey="volumeInfluenced"
              name="Volume Influenced"
              fill="var(--chart-1)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            >
              {mockMonthlySalesData.map((entry, index) => (
                <Cell
                  key={`volume-${index}`}
                  fillOpacity={
                    entry.volumeInfluenced >= avgVolumeInfluenced ? 1 : 0.4
                  }
                />
              ))}
            </Bar>
            <Bar
              dataKey="closedSales"
              name="Closed Sales"
              fill="var(--chart-2)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            >
              {mockMonthlySalesData.map((entry, index) => (
                <Cell
                  key={`sales-${index}`}
                  fillOpacity={entry.closedSales >= avgClosedSales ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
