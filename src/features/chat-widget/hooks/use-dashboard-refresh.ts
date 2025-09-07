import { farmsKeys } from "@/features/sales-rep/components/dealer-alert-log/hooks/useFarms";
import { salesRepLogsKeys } from "@/features/sales-rep/components/dealer-alert-log/hooks/useSalesRepLogs";
import { monthlySalesKeys } from "@/features/sales-rep/components/monthly-sales-chart/hooks/useMonthlySales";
import { farmerV2Keys } from "@/hooks/use-farmer-v2";
import { useUser } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to handle dashboard data refresh when chat logs are completed
 * Only refreshes data for the current user's role using proper query key factories
 */
export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const refreshDashboardData = (logType?: string) => {
    if (!user?.profileId) return;

    const userId = user.profileId;

    // Only invalidate queries for the current user's role
    if (user.role === "farmer") {
      // Invalidate all farmer-specific queries
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.all,
      });

      // Specific invalidations based on log type for better performance
      if (logType?.includes("feed") || logType?.includes("performance")) {
        queryClient.invalidateQueries({
          queryKey: farmerV2Keys.activeFeedProgram(userId),
        });
        queryClient.invalidateQueries({
          queryKey: farmerV2Keys.activeFeedProduct(userId),
        });
        queryClient.invalidateQueries({
          queryKey: farmerV2Keys.feedCalculationLog(userId),
        });
      }

      if (logType?.includes("health") || logType?.includes("mortality")) {
        queryClient.invalidateQueries({
          queryKey: farmerV2Keys.growthPerformance(userId),
        });
      }
    } else if (user.role === "sales_rep") {
      // Invalidate sales rep-specific queries using proper query key factories

      // Monthly sales data
      queryClient.invalidateQueries({
        queryKey: monthlySalesKeys.byUserId(userId),
      });

      // Farms data
      queryClient.invalidateQueries({
        queryKey: farmsKeys.byUserId(userId),
      });

      // Sales rep logs
      queryClient.invalidateQueries({
        queryKey: salesRepLogsKeys.byUserId(userId),
      });

      // Specific invalidations based on log type for better performance
      if (logType?.includes("sales") || logType?.includes("performance")) {
        queryClient.invalidateQueries({
          queryKey: monthlySalesKeys.byUserId(userId),
        });
        queryClient.invalidateQueries({
          queryKey: salesRepLogsKeys.byUserId(userId),
        });
      }

      if (logType?.includes("farm") || logType?.includes("visit")) {
        queryClient.invalidateQueries({
          queryKey: farmsKeys.byUserId(userId),
        });
      }
    }

    // Note: Removed general dashboard and FAQ invalidations to be more targeted
    // Only refresh data specific to the current user's role and actions
  };

  return {
    refreshDashboardData,
  };
};
