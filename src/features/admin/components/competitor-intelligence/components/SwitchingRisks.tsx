import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ShieldAlert,
  Shield,
  ToggleRight,
  BanknoteArrowDown,
  BadgeQuestionMark,
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

  const getRiskIcon = (riskLevel: string, size: number = 4) => {
    switch (riskLevel) {
      case "high":
        return <AlertTriangle className={`size-${size} text-red-500`} />;
      case "medium":
        return <ShieldAlert className={`size-${size} text-yellow-500`} />;
      default:
        return <Shield className={`size-${size} text-green-500`} />;
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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-display font-medium">
            Brand Rankings & Intelligence
          </h3>
          <Badge
            variant="outline"
            className="font-display font-medium rounded-full border-black text-xs"
          >
            {risks.length} Risks
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-md border border-black">
            <div className="text-2xl flex justify-center items-center gap-1 font-semibold font-display">
              {getRiskIcon("high", 5)}
              {highRiskCount}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              High Risk
            </div>
          </div>
          <div className="text-center p-3 rounded-md border border-black">
            <div className="text-2xl flex justify-center items-center gap-1 font-semibold font-display">
              {getRiskIcon("medium", 5)}
              {mediumRiskCount}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Medium Risk
            </div>
          </div>
          <div className="text-center p-3 rounded-md border border-black">
            <div className="text-2xl flex justify-center items-center gap-1 font-semibold font-display">
              {getRiskIcon("low", 5)}
              {lowRiskCount}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Low Risk
            </div>
          </div>
          <div className="text-center p-3 rounded-md border border-black">
            <div className="text-2xl flex justify-center items-center gap-1 font-semibold font-display">
              {formatCurrency(totalRevenueLoss)}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Est. Revenue Loss
            </div>
          </div>
        </div>
      </div>

      {/* Action Required Alert */}
      {actionRequiredCount > 0 && (
        <div className="bg-red-100 -mx-6 border-b border-t border-red-700 px-6 py-2">
          <p className="text-base font-display font-medium text-red-700">
            {actionRequiredCount} customer{actionRequiredCount > 1 ? "s" : ""}{" "}
            require immediate attention
          </p>
        </div>
      )}

      {/* Switching Risks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-display font-medium">
            Customer Switching Risks
          </h3>
          <Badge
            variant="outline"
            className="font-display font-medium rounded-full border-black text-xs"
          >
            {risks.length} Customers
          </Badge>
        </div>

        {risks.map((risk) => (
          <div
            key={risk.farmerId}
            className="border rounded-md p-2 border-black space-y-2"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRiskIcon(risk.riskLevel)}
                  <div className="size-9 flex items-center justify-center rounded-md bg-accent p-2">
                    <User className="size-full text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold font-display text-sm">
                    {risk.farmerName}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
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
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Switching Probability
                </span>
                <span className="font-medium font-display">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <ToggleRight className="size-4" />
                  Switching To
                </div>
                <div className="font-medium text-xs font-display">
                  {risk.competitorBrand}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <BanknoteArrowDown className="size-4" />
                  Est. Revenue Loss
                </div>
                <div className="font-medium text-xs font-display text-red-600">
                  {formatCurrency(risk.estimatedRevenueLoss)}
                </div>
              </div>
            </div>

            {/* Reasons */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <BadgeQuestionMark className="size-4" />
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
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-black">
              <div className="flex items-center gap-2 text-xs font-medium">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{risk.region}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{risk.salesRep}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(risk.reportDate)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-black">
              <div className="text-xs text-muted-foreground font-medium">
                Current Brand:{" "}
                <span className="text-black">{risk.currentBrand}</span>
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
