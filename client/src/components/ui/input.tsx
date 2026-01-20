import * as React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`border rounded px-2 py-1 ${className}`} {...props} />
  ),
);
Input.displayName = 'Input';

export { Input };
