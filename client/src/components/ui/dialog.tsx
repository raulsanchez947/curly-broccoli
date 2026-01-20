'use client';

import * as React from 'react';

const Dialog: React.FC = ({ children }) => <>{children}</>;
const DialogTrigger: React.FC = ({ children }) => <>{children}</>;
const DialogPortal: React.FC = ({ children }) => <>{children}</>;
const DialogClose: React.FC = ({ children }) => <>{children}</>;

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`fixed inset-0 bg-black/40 ${className}`} {...props} />
  ),
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow ${className}`} {...props}>
      {children}
    </div>
  ),
);
DialogContent.displayName = 'DialogContent';

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const DialogTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`text-lg font-semibold ${className}`} {...props}>{children}</div>
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`text-sm text-gray-600 ${className}`} {...props}>{children}</div>
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
