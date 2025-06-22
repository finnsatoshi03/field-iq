import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Alert } from "../constants";

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => (
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

export default AlertItem;
