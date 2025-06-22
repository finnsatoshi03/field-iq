import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CompetitorBrand, BrandMention } from "../constants";
import {
  calculateMarketShareData,
  calculateBrandMentionsData,
  getSentimentColor,
  getCategoryIcon,
} from "../utils";

interface CompetitorChartProps {
  brands: CompetitorBrand[];
  mentions: BrandMention[];
}

const CompetitorChart = ({ brands, mentions }: CompetitorChartProps) => {
  const marketShareData = calculateMarketShareData(brands);
  const mentionsData = calculateBrandMentionsData(mentions);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Market Share: {data.value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Share Pie Chart */}
      <div>
        <h3 className="text-sm font-medium mb-3">Market Share Distribution</h3>
        <div className="h-[200px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={25}
                paddingAngle={2}
                dataKey="value"
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brand Mentions Tag Cloud */}
      <div>
        <h3 className="text-sm font-medium mb-3">Brand Mentions & Sentiment</h3>
        <div className="flex flex-wrap gap-2 justify-center min-h-[100px] items-center">
          {mentionsData.map((mention) => (
            <div
              key={mention.brandName}
              className="flex items-center gap-1 p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
              style={{
                fontSize: `${Math.max(10, Math.min(16, mention.mentions / 10))}px`,
              }}
            >
              <span className="text-lg">
                {getCategoryIcon(mention.category as any)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{mention.brandName}</span>
                  {getTrendIcon(mention.trend)}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge
                    variant="outline"
                    className="px-1 py-0 text-xs"
                    style={{
                      borderColor: getSentimentColor(mention.sentiment),
                      color: getSentimentColor(mention.sentiment),
                    }}
                  >
                    {mention.sentiment}
                  </Badge>
                  <span className="text-muted-foreground">
                    {mention.mentions} mentions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-green-600">
            {mentionsData.filter((m) => m.sentiment === "positive").length}
          </div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-gray-600">
            {mentionsData.filter((m) => m.sentiment === "neutral").length}
          </div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-red-600">
            {mentionsData.filter((m) => m.sentiment === "negative").length}
          </div>
          <div className="text-xs text-muted-foreground">Negative</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-blue-600">
            {mentionsData.reduce((sum, m) => sum + m.mentions, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Mentions</div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorChart;
