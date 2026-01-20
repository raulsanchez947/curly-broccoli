import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', asChild, ...props }, ref) => {
    const Comp: any = asChild ? 'span' : 'button';
    return (
      <Comp ref={ref} className={`px-3 py-1 rounded ${className}`} {...props}>
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
