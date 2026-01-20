import * as React from 'react';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded border bg-white p-4 ${className}`} {...props} />
  ),
);
Card.displayName = 'Card';

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`mb-2 ${className}`}>{children}</div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`font-semibold text-lg ${className}`}>{children}</div>
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`text-sm text-gray-600 ${className}`}>{children}</div>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>{children}</div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
