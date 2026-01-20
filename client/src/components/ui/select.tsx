import * as React from 'react';

const Select: React.FC = ({ children }) => <select className="border rounded px-2 py-1">{children}</select>;

const SelectTrigger = ({ children, ...props }: any) => (
  <button {...props} className="flex items-center justify-between border rounded px-2 py-1">{children}</button>
);

const SelectContent: React.FC<any> = ({ children }) => <div className="border rounded bg-white p-2">{children}</div>;

const SelectItem: React.FC<any> = ({ children, ...props }) => (
  <div {...props} className="px-2 py-1 hover:bg-gray-100">{children}</div>
);

const SelectLabel: React.FC<any> = ({ children }) => <div className="px-2 py-1 font-semibold">{children}</div>;

const SelectGroup = ({ children }: any) => <div>{children}</div>;

const SelectValue = ({ children }: any) => <span>{children}</span>;

const SelectSeparator = () => <hr className="my-1" />;

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
