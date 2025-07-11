import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Frown, Meh, Laugh } from "lucide-react";
import type { CompetitorBrand, BrandMention } from "../constants";
import {
  calculateMarketShareData,
  calculateBrandMentionsData,
  getSentimentColor,
  getCategoryIcon,
} from "../utils";
import { capitalizeFirstLetter } from "@/lib/helpers/string";

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
        return <Laugh className="size-4 text-green-500" />;
      case "down":
        return <Frown className="size-4 text-red-500" />;
      default:
        return <Meh className="size-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Share Pie Chart */}
      <div>
        <h3 className="text-base font-medium font-display">
          Market Share Distribution
        </h3>
        <div className="h-[200px] sm:h-[250px] items-center grid grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                innerRadius={"30%"}
                paddingAngle={2}
                dataKey="value"
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1">
            {marketShareData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Mentions Tag Cloud */}
      <div className="space-y-1">
        <h3 className="text-base font-medium font-display">
          Brand Mentions & Sentiment
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {mentionsData.map((mention) => (
            <div
              key={mention.brandName}
              className="flex items-center gap-1 p-2 rounded-lg border border-black"
            >
              <span className="text-sm">
                {getCategoryIcon(mention.category as any)}
              </span>
              <div className="flex flex-col w-full">
                <div className="flex items-center w-full justify-between gap-2">
                  <h3 className="font-medium font-display text-sm">
                    {mention.brandName}
                  </h3>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(mention.trend)}
                    <Badge
                      variant="outline"
                      className="py-0.5 text-xs text-white rounded-md"
                      style={{
                        backgroundColor: getSentimentColor(mention.sentiment),
                      }}
                    >
                      {capitalizeFirstLetter(mention.sentiment)}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  <span className="text-sm font-medium text-black font-display">
                    {mention.mentions}
                  </span>{" "}
                  mentions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-muted">
          <div className="text-xl font-bold font-display">
            {mentionsData.filter((m) => m.sentiment === "positive").length}
          </div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted">
          <div className="text-xl font-bold font-display">
            {mentionsData.filter((m) => m.sentiment === "neutral").length}
          </div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted">
          <div className="text-xl font-bold font-display">
            {mentionsData.filter((m) => m.sentiment === "negative").length}
          </div>
          <div className="text-xs text-muted-foreground">Negative</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted">
          <div className="text-xl font-bold font-display">
            {mentionsData.reduce((sum, m) => sum + m.mentions, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Mentions</div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorChart;
