interface FaviconIconProps {
  className?: string;
}

export const FaviconIcon = ({ className }: FaviconIconProps) => (
  <img src="/favicon.png" alt="Favicon" className={`h-7 w-8 ${className}`} />
);
