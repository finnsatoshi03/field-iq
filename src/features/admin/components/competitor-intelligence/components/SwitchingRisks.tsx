import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingDown,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { SwitchingRisk } from "../constants";
import { getRiskColor, formatCurrency, formatDate } from "../utils";

interface SwitchingRisksProps {
  risks: SwitchingRisk[];
}

const SwitchingRisks = ({ risks }: SwitchingRisksProps) => {
  const highRiskCount = risks.filter((r) => r.riskLevel === "high").length;
  const mediumRiskCount = risks.filter((r) => r.riskLevel === "medium").length;
  const lowRiskCount = risks.filter((r) => r.riskLevel === "low").length;
  const totalRevenueLoss = risks.reduce(
    (sum, risk) => sum + risk.estimatedRevenueLoss,
    0
  );
  const actionRequiredCount = risks.filter((r) => r.actionRequired).length;

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRiskProgress = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return 85;
      case "medium":
        return 50;
      default:
        return 20;
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-red-600">{highRiskCount}</div>
          <div className="text-xs text-muted-foreground">High Risk</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-yellow-600">
            {mediumRiskCount}
          </div>
          <div className="text-xs text-muted-foreground">Medium Risk</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-green-600">{lowRiskCount}</div>
          <div className="text-xs text-muted-foreground">Low Risk</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(totalRevenueLoss)}
          </div>
          <div className="text-xs text-muted-foreground">Est. Revenue Loss</div>
        </div>
      </div>

      {/* Action Required Alert */}
      {actionRequiredCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-800">
              {actionRequiredCount} customer{actionRequiredCount > 1 ? "s" : ""}{" "}
              require immediate attention
            </span>
          </div>
        </div>
      )}

      {/* Switching Risks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Customer Switching Risks</h3>
          <Badge variant="outline" className="text-xs">
            {risks.length} Customers
          </Badge>
        </div>

        {risks.map((risk) => (
          <div
            key={risk.farmerId}
            className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRiskIcon(risk.riskLevel)}
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">{risk.farmerName}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {risk.farmerId}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {risk.actionRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Action Required
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: getRiskColor(risk.riskLevel),
                    color: getRiskColor(risk.riskLevel),
                  }}
                >
                  {risk.riskLevel} risk
                </Badge>
              </div>
            </div>

            {/* Risk Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Switching Probability
                </span>
                <span className="font-medium">
                  {getRiskProgress(risk.riskLevel)}%
                </span>
              </div>
              <Progress
                value={getRiskProgress(risk.riskLevel)}
                className="h-2"
                style={{
                  backgroundColor: `${getRiskColor(risk.riskLevel)}20`,
                }}
              />
            </div>

            {/* Competitor & Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Switching To
                </div>
                <div className="font-medium text-sm">
                  {risk.competitorBrand}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Est. Revenue Loss
                </div>
                <div className="font-medium text-sm text-red-600">
                  {formatCurrency(risk.estimatedRevenueLoss)}
                </div>
              </div>
            </div>

            {/* Reasons */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Switching Reasons
              </div>
              <div className="flex flex-wrap gap-1">
                {risk.reasons.map((reason, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{risk.region}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{risk.salesRep}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(risk.reportDate)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Current Brand: {risk.currentBrand}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  Contact
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  Take Action
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {risks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No switching risks found</p>
          <p className="text-xs">All customers appear to be satisfied</p>
        </div>
      )}
    </div>
  );
};

export default SwitchingRisks;
