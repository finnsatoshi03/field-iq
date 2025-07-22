import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FaqItem } from "../constants";
import {
  calculateFaqMetrics,
  formatDate,
  formatNumber,
  getCategoryColor,
  getFaqsByCategory,
  getRecentlyUpdatedFaqs,
  getStatusColor,
  getTopViewedFaqs,
  truncateText,
} from "../utils";

interface FaqStatsProps {
  faqs: FaqItem[];
  className?: string;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
];

const FaqStats = ({ faqs, className }: FaqStatsProps) => {
  const metrics = calculateFaqMetrics(faqs);
  const categoryData = getFaqsByCategory(faqs);
  const topViewedFaqs = getTopViewedFaqs(faqs, 5);
  const recentlyUpdated = getRecentlyUpdatedFaqs(faqs, 5);

  const pieChartData = categoryData.map((item, index) => ({
    name: item.category,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  const barChartData = categoryData.map((item) => ({
    category: item.category,
    count: item.count,
    percentage: item.percentage,
  }));

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    description?: string;
    icon: any;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", `text-${color}-600`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(Number(value))}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total FAQs"
          value={metrics.totalFaqs}
          description="All FAQ items"
          icon={HelpCircle}
          color="blue"
        />
        <StatCard
          title="Total Views"
          value={metrics.totalViews}
          description={`Avg ${formatNumber(metrics.avgViews)} per FAQ`}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Active FAQs"
          value={metrics.activeFaqs}
          description={`${Math.round((metrics.activeFaqs / metrics.totalFaqs) * 100)}% of total`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Draft FAQs"
          value={metrics.draftFaqs}
          description="Pending review"
          icon={FileText}
          color="yellow"
        />
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <span className="text-sm">{metrics.activeFaqs} FAQs</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(metrics.activeFaqs / metrics.totalFaqs) * 100}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round((metrics.activeFaqs / metrics.totalFaqs) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                <span className="text-sm">{metrics.draftFaqs} FAQs</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(metrics.draftFaqs / metrics.totalFaqs) * 100}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round((metrics.draftFaqs / metrics.totalFaqs) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                <span className="text-sm">{metrics.inactiveFaqs} FAQs</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(metrics.inactiveFaqs / metrics.totalFaqs) * 100}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round((metrics.inactiveFaqs / metrics.totalFaqs) * 100)}
                  %
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              FAQs by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Most Viewed FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topViewedFaqs.map((faq, index) => (
                <div key={faq.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {truncateText(faq.question, 50)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          getCategoryColor(faq.category),
                        )}
                      >
                        {faq.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {formatNumber(faq.views)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Updated FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recently Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentlyUpdated.map((faq) => (
                <div key={faq.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {truncateText(faq.question, 50)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(faq.status))}
                      >
                        {faq.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(faq.lastUpdated)} by {faq.createdBy}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {metrics.highPriorityFaqs}
              </div>
              <div className="text-sm text-red-700">High Priority</div>
              <div className="text-xs text-red-600">Priority 1-3</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {metrics.mediumPriorityFaqs}
              </div>
              <div className="text-sm text-yellow-700">Medium Priority</div>
              <div className="text-xs text-yellow-600">Priority 4-6</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {metrics.lowPriorityFaqs}
              </div>
              <div className="text-sm text-green-700">Low Priority</div>
              <div className="text-xs text-green-600">Priority 7-10</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaqStats;
