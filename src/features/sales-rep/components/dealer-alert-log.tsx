import { AlertTriangle, CheckCircle, Plus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Low Stock Alert",
    description: "Fertilizer inventory below 20% at Bataan Branch",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "success",
    title: "New Order Received",
    description: "₱45,000 order from Rodriguez Farm Co.",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Delayed Delivery",
    description: "Shipment to Pampanga delayed due to weather",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    description: "₱32,000 payment from Santos Agricultural",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    type: "warning",
    title: "Equipment Maintenance",
    description: "Scheduled maintenance for delivery truck #3",
    timestamp: "2 days ago",
  },
  {
    id: 6,
    type: "success",
    title: "Contract Renewal",
    description: "₱120,000 annual contract renewed with Mindanao Farms",
    timestamp: "3 days ago",
  },
];

const mockFarms = [
  {
    name: "Makiling Farm",
    location: "Laguna",
    status: "visited",
    datetime: new Date("2024-01-15T14:30:00"),
  },
  {
    name: "Sunrise Agriculture",
    location: "Bataan",
    status: "added",
    datetime: new Date("2024-01-15T11:45:00"),
  },
  {
    name: "Golden Harvest Co.",
    location: "Pampanga",
    status: "visited",
    datetime: new Date("2024-01-14T16:20:00"),
  },
  {
    name: "Verde Valley Farm",
    location: "Nueva Ecija",
    status: "added",
    datetime: new Date("2024-01-14T09:15:00"),
  },
  {
    name: "Pacific Agri Corp",
    location: "Tarlac",
    status: "visited",
    datetime: new Date("2024-01-13T13:00:00"),
  },
  {
    name: "Mountain View Farms",
    location: "Benguet",
    status: "added",
    datetime: new Date("2024-01-12T10:20:00"),
  },
  {
    name: "Coastal Agriculture Ltd",
    location: "Pangasinan",
    status: "visited",
    datetime: new Date("2024-01-11T15:45:00"),
  },
];

const formatDateTime = (date: Date) => {
  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { dateString, timeString };
};

const AlertItem: React.FC<{ alert: (typeof mockAlerts)[0] }> = ({ alert }) => (
  <div className="rounded-lg bg-muted/50 px-3 py-2">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {alert.type === "warning" ? (
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-medium text-sm tracking-tight">
                {alert.title}
              </h4>
              <Badge
                className={`text-[10px] px-2 h-fit py-0 rounded-sm ${
                  alert.type === "warning"
                    ? "bg-orange-600 text-orange-50"
                    : "bg-green-600 text-green-50"
                }`}
              >
                {alert.type === "warning" ? "Alert" : "Success"}
              </Badge>
            </div>
            <p className="text-xs mt-1">{alert.description}</p>
          </div>
          <span className="text-xs text-muted-foreground font-sans flex-shrink-0">
            {alert.timestamp}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const FarmItem: React.FC<{
  farm: (typeof mockFarms)[0];
  index: number;
  showConnector: boolean;
  isDialog?: boolean;
}> = ({ farm, showConnector }) => {
  const { dateString, timeString } = formatDateTime(farm.datetime);

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center mr-3 relative">
        <div className="size-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center bg-white">
          {farm.status === "added" ? (
            <Plus className="size-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>
        {showConnector && (
          <div className="w-px h-8 bg-border absolute top-6 left-1/2 transform -translate-x-1/2" />
        )}
      </div>
      <div className="flex items-center justify-between min-w-0 flex-1 py-2">
        <div className="flex flex-col flex-shrink-0">
          <span className="text-xs font-medium text-foreground font-sans">
            {dateString}
          </span>
          <span className="text-xs text-muted-foreground font-sans">
            {timeString}
          </span>
        </div>
        <div className="flex flex-col min-w-0 ml-4 text-right items-end">
          <span className="font-medium text-foreground font-sans leading-none text-sm truncate">
            {farm.name}
          </span>
          <span className="text-muted-foreground font-sans text-xs">
            {farm.location}
          </span>
        </div>
      </div>
    </div>
  );
};

const MoreButton: React.FC<{ count: number; onClick?: () => void }> = ({
  count,
}) => (
  <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 px-3 py-2 cursor-pointer hover:border-muted-foreground/50 transition-colors">
    <div className="flex items-center justify-center">
      <span className="text-sm text-muted-foreground font-sans">
        +{count} more
      </span>
    </div>
  </div>
);

const DealerAlertLog: React.FC = () => {
  const visibleAlerts = mockAlerts.slice(0, 3);
  const remainingAlerts = mockAlerts.slice(3);
  const visibleFarms = mockFarms.slice(0, 3);
  const remainingFarms = mockFarms.slice(3);

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      <div className="px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Dealer Alert Log
        </h3>
      </div>

      <div className="space-y-3 px-4">
        {visibleAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}

        {remainingAlerts.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <MoreButton count={remainingAlerts.length} />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Alerts</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {mockAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="px-4 bg-muted/20 py-4 space-y-4">
        <div className="flex items-end justify-between">
          <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
            New Accounts - Farms Added + Visited
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Plus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground font-sans">Added</span>
              <span className="font-medium text-foreground font-sans">
                {mockFarms.filter((f) => f.status === "added").length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-muted-foreground font-sans">Visited</span>
              <span className="font-medium text-foreground font-sans">
                {mockFarms.filter((f) => f.status === "visited").length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {visibleFarms.map((farm, index) => (
            <FarmItem
              key={index}
              farm={farm}
              index={index}
              showConnector={index < visibleFarms.length - 1}
            />
          ))}

          {remainingFarms.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center mt-2">
                  <div className="flex flex-col items-center mr-3 relative">
                    <div className="size-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-background">
                      <Plus className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 py-2">
                    <span className="text-sm text-muted-foreground font-sans">
                      +{remainingFarms.length} more farms
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Farms - Added + Visited</DialogTitle>
                </DialogHeader>
                <div className="space-y-0 mt-4">
                  {mockFarms.map((farm, index) => (
                    <FarmItem
                      key={index}
                      farm={farm}
                      index={index}
                      showConnector={index < mockFarms.length - 1}
                      isDialog={true}
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerAlertLog;
