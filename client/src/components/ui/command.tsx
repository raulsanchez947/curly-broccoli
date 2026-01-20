import * as React from 'react';

const Command: React.FC = ({ children }) => <div>{children}</div>;

const CommandDialog: React.FC<any> = ({ children }) => <div>{children}</div>;

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => <input ref={ref} className={`border rounded px-2 py-1 ${className}`} {...props} />,
);
CommandInput.displayName = 'CommandInput';

const CommandList: React.FC = ({ children }) => <div>{children}</div>;
const CommandEmpty: React.FC = () => <div className="py-6 text-center text-sm">No results</div>;
const CommandGroup: React.FC = ({ children }) => <div>{children}</div>;
const CommandItem: React.FC<any> = ({ children, ...props }) => (
  <div {...props} className="px-2 py-1 hover:bg-gray-100">{children}</div>
);
const CommandSeparator: React.FC = () => <hr className="my-1" />;

const CommandShortcut: React.FC = ({ children }) => <span className="ml-auto text-xs">{children}</span>;

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
