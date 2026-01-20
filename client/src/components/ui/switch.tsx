import * as React from 'react';

const Switch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input type="checkbox" className={`h-5 w-9 ${className}`} {...props} />
);

export { Switch };
