import * as React from 'react';

const TooltipProvider: React.FC = ({ children }) => <>{children}</>;
const Tooltip: React.FC = ({ children }) => <>{children}</>;
const TooltipTrigger: React.FC = ({ children }) => <>{children}</>;

const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`rounded bg-black text-white px-2 py-1 text-xs ${className}`} {...props}>
      {children}
    </div>
  ),
);

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
