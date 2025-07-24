import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import React from "react";
import type { Alert } from "../constants";

interface AlertItemProps {
  alert: Alert;
}

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
      return (
        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      );
    case "success":
      return (
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      );
    case "error":
      return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    default:
      return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
  }
};

const getBadgeStyle = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
      return "bg-orange-600 text-orange-50";
    case "success":
      return "bg-green-600 text-green-50";
    case "error":
      return "bg-red-600 text-red-50";
    case "info":
      return "bg-blue-600 text-blue-50";
    default:
      return "bg-blue-600 text-blue-50";
  }
};

const getBadgeText = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
      return "Alert";
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "info":
      return "Info";
    default:
      return "Info";
  }
};

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => (
  <div className="rounded-lg bg-muted/50 px-3 py-2">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-medium text-sm tracking-tight">
                {alert.title}
              </h4>
              <Badge
                className={`text-[10px] px-2 h-fit py-0 rounded-sm ${getBadgeStyle(alert.type)}`}
              >
                {getBadgeText(alert.type)}
              </Badge>
            </div>
            {alert.description && (
              <p className="text-xs mt-1">{alert.description}</p>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-sans flex-shrink-0">
            {alert.timestamp}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default AlertItem;
