import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartDataPoint } from "../constants";
import { formatCurrency } from "../utils";

interface SalesChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const SalesChart = ({ data }: SalesChartProps) => {
  // Calculate averages for opacity effect
  const avgInfluenced =
    data.reduce((sum, item) => sum + item.influencedVolume, 0) / data.length;
  const avgClosed =
    data.reduce((sum, item) => sum + item.closedSales, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 10,
          bottom: 10,
        }}
        barGap={8}
      >
        <XAxis
          dataKey="name"
          axisLine={true}
          tickLine={true}
          tick={{
            fontSize: 11,
            fill: "var(--muted-foreground)",
            fontFamily: "var(--font-sans)",
          }}
          dy={8}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis
          axisLine={true}
          tickLine={true}
          tick={{
            fontSize: 11,
            fill: "var(--muted-foreground)",
            fontFamily: "var(--font-sans)",
          }}
          width={60}
          tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`}
        />
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
                          {formatCurrency(entry.value as number)}
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

        <Bar
          dataKey="influencedVolume"
          name="Influenced Volume"
          fill="var(--chart-1)"
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
        >
          {data.map((entry, index) => (
            <Cell
              key={`influenced-${index}`}
              fillOpacity={entry.influencedVolume >= avgInfluenced ? 1 : 0.4}
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
          {data.map((entry, index) => (
            <Cell
              key={`closed-${index}`}
              fillOpacity={entry.closedSales >= avgClosed ? 1 : 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
