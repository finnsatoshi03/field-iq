import { createFileRoute } from "@tanstack/react-router";

import {
  MonthlySalesChart,
  DealerAlertLog,
  VisitSchedule,
} from "@/features/sales-rep/components";

export const Route = createFileRoute("/_authenticated/sales/")({
  component: SalesDashboard,
});

function SalesDashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-1 tracking-tight">
          Sales Dashboard
        </h1>
        <p className="text-muted-foreground font-sans text-sm">
          Monitor your sales performance and key metrics
        </p>
      </div>

      <div className="space-y-6 flex-1 min-h-0 h-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-2 xl:col-span-2 h-fit gap-6 grid grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-2 xl:col-span-2">
              <MonthlySalesChart />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <VisitSchedule />
            </div>
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <DealerAlertLog />
          </div>
        </div>
      </div>
    </div>
  );
}
