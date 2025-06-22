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

const mockMonthlySalesData = [
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

const MonthlySalesChart: React.FC = () => {
  const isMobile = useIsMobile();

  const totalVolumeInfluenced = mockMonthlySalesData.reduce(
    (sum, data) => sum + data.volumeInfluenced,
    0
  );
  const totalClosedSales = mockMonthlySalesData.reduce(
    (sum, data) => sum + data.closedSales,
    0
  );

  // Calculate averages
  const avgVolumeInfluenced =
    totalVolumeInfluenced / mockMonthlySalesData.length;
  const avgClosedSales = totalClosedSales / mockMonthlySalesData.length;

  // Custom label component for reference line
  const CustomLabel = ({ viewBox, label, avgValue }: any) => {
    if (viewBox) {
      return (
        <g>
          <text
            x={viewBox.x + viewBox.width / 25 + (isMobile ? 50 : 30)}
            y={viewBox.y - 8}
            textAnchor="end"
            className="text-xs font-semibold fill-muted-foreground"
          >
            {label}
          </text>
          <text
            x={viewBox.x + viewBox.width / 25 + (isMobile ? 20 : 0)}
            y={viewBox.y - 8}
            textAnchor="end"
            className="text-xs font-bold fill-foreground"
          >
            ₱{(avgValue / 1000).toFixed(0)}k
          </text>
        </g>
      );
    }
    return null;
  };

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
              label={<CustomLabel label="AVG" avgValue={avgVolumeInfluenced} />}
            />
            <ReferenceLine
              y={avgClosedSales}
              stroke="var(--chart-2)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={<CustomLabel label="AVG" avgValue={avgClosedSales} />}
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
