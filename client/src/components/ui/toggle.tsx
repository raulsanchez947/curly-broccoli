import * as React from 'react';

const Toggle: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button type="button" className={className} {...props}>
    {children}
  </button>
);

export { Toggle };
