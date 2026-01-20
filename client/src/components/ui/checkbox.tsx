import * as React from 'react';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref as any} type="checkbox" className={`h-4 w-4 ${className}`} {...props} />
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
