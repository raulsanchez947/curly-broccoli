import * as React from 'react';

const Popover: React.FC = ({ children }) => <>{children}</>;
const PopoverTrigger: React.FC = ({ children }) => <>{children}</>;
const PopoverAnchor: React.FC = ({ children }) => <>{children}</>;

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`rounded border bg-white p-2 ${className}`} {...props}>
      {children}
    </div>
  ),
);

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
