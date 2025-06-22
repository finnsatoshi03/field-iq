import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Sprout,
  Building2,
  RefreshCw,
  Target,
  DollarSign,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import type { FilterOptions } from "../utils";
import {
  getFilteredRegistrations,
  calculateRegistrationMetrics,
  getRegistrationsByRegion,
  getRegistrationsBySalesRep,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatHectares,
  getRegistrationTrend,
} from "../utils";
import { MOCK_SALES_REPS } from "../constants";

interface RegistrationStatsProps {
  filters?: FilterOptions;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <Badge
              variant={trend.isPositive ? "default" : "destructive"}
              className="flex items-center gap-1 text-xs"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.percentage}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RegistrationStats: React.FC<RegistrationStatsProps> = ({
  filters = {},
  className = "",
}) => {
  const registrations = getFilteredRegistrations(undefined, filters);
  const metrics = calculateRegistrationMetrics(registrations);
  const regionStats = getRegistrationsByRegion(registrations);
  const salesRepStats = getRegistrationsBySalesRep(
    registrations,
    MOCK_SALES_REPS
  );

  // Calculate trends (mock previous period data)
  const previousMetrics = {
    totalRegistrations: metrics.totalRegistrations - 15,
    newAccounts: metrics.newAccounts - 8,
    expansions: metrics.expansions - 3,
    conversions: metrics.conversions - 4,
    thisMonth: metrics.thisMonth - 12,
    totalRevenue: metrics.totalRevenue - 150000,
  };

  const trends = {
    total: getRegistrationTrend(
      metrics.totalRegistrations,
      previousMetrics.totalRegistrations
    ),
    newAccounts: getRegistrationTrend(
      metrics.newAccounts,
      previousMetrics.newAccounts
    ),
    expansions: getRegistrationTrend(
      metrics.expansions,
      previousMetrics.expansions
    ),
    conversions: getRegistrationTrend(
      metrics.conversions,
      previousMetrics.conversions
    ),
    thisMonth: getRegistrationTrend(
      metrics.thisMonth,
      previousMetrics.thisMonth
    ),
    revenue: getRegistrationTrend(
      metrics.totalRevenue,
      previousMetrics.totalRevenue
    ),
  };

  // Get top performing regions
  const topRegions = Object.entries(regionStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get top performing sales reps
  const topSalesReps = salesRepStats
    .sort((a, b) => b.registrationsThisMonth - a.registrationsThisMonth)
    .slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={formatNumber(metrics.totalRegistrations)}
          description="All time registrations"
          icon={Sprout}
          trend={trends.total}
        />
        <StatCard
          title="New Accounts"
          value={formatNumber(metrics.newAccounts)}
          description="First-time registrations"
          icon={Building2}
          trend={trends.newAccounts}
        />
        <StatCard
          title="Expansions"
          value={formatNumber(metrics.expansions)}
          description="Existing farm growth"
          icon={TrendingUp}
          trend={trends.expansions}
        />
        <StatCard
          title="Conversions"
          value={formatNumber(metrics.conversions)}
          description="Converted from traditional"
          icon={RefreshCw}
          trend={trends.conversions}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="This Month"
          value={formatNumber(metrics.thisMonth)}
          description="Current month registrations"
          icon={Calendar}
          trend={trends.thisMonth}
        />
        <StatCard
          title="This Week"
          value={formatNumber(metrics.thisWeek)}
          description="Current week registrations"
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          description="Monthly recurring revenue"
          icon={DollarSign}
          trend={trends.revenue}
        />
        <StatCard
          title="Penetration Rate"
          value={formatPercentage(metrics.penetrationRate)}
          description="Market penetration"
          icon={Target}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Regions
            </CardTitle>
            <CardDescription>
              Registration performance by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRegions.map(([region, count]) => {
                const percentage = (count / metrics.totalRegistrations) * 100;
                return (
                  <div
                    key={region}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{region}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(count)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Sales Reps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Sales Reps
            </CardTitle>
            <CardDescription>Performance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSalesReps.map((rep) => {
                const percentage =
                  rep.targetRegistrations > 0
                    ? (rep.registrationsThisMonth / rep.targetRegistrations) *
                      100
                    : 0;
                const isOnTarget = percentage >= 100;

                return (
                  <div
                    key={rep.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-medium">
                            {rep.name}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {rep.territory}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            {formatNumber(rep.registrationsThisMonth)}/
                            {formatNumber(rep.targetRegistrations)}
                          </span>
                          <Badge
                            variant={isOnTarget ? "default" : "secondary"}
                            className="ml-2 text-xs"
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isOnTarget ? "bg-green-600" : "bg-blue-600"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farm Size & Revenue Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Average Farm Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatHectares(metrics.averageFarmSize)}
            </div>
            <p className="text-sm text-muted-foreground">
              Across all registered farms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Active Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatNumber(
                registrations.filter((r) => r.status === "active").length
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Currently generating revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Avg Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(
                registrations.filter((r) => r.status === "active").length > 0
                  ? metrics.totalRevenue /
                      registrations.filter((r) => r.status === "active").length
                  : 0
              )}
            </div>
            <p className="text-sm text-muted-foreground">Per active farm</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationStats;
