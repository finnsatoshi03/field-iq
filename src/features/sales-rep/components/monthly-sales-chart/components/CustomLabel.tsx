import React from "react";

interface CustomLabelProps {
  viewBox?: any;
  label: string;
  avgValue: number;
  isMobile: boolean;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox,
  label,
  avgValue,
  isMobile,
}) => {
  if (viewBox) {
    return (
      <g>
        <text
          x={viewBox.x + viewBox.width / 25 + (isMobile ? 50 : 30)}
          y={viewBox.y - 8}
          textAnchor="end"
          className="text-xs font-semibold fill-muted-foreground"
        >
          {label}
        </text>
        <text
          x={viewBox.x + viewBox.width / 25 + (isMobile ? 20 : 0)}
          y={viewBox.y - 8}
          textAnchor="end"
          className="text-xs font-bold fill-foreground"
        >
          ₱{(avgValue / 1000).toFixed(0)}k
        </text>
      </g>
    );
  }
  return null;
};

export default CustomLabel;
