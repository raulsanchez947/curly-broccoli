import * as React from 'react';

const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, className = '', ...props }) => (
  <div style={{ overflow: 'auto' }}>
    <table className={className} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader: React.FC = ({ children }) => <thead>{children}</thead>;
const TableBody: React.FC = ({ children }) => <tbody>{children}</tbody>;
const TableFooter: React.FC = ({ children }) => <tfoot>{children}</tfoot>;
const TableRow: React.FC = ({ children }) => <tr>{children}</tr>;
const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <th {...props}>{children}</th>
);
const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <td {...props}>{children}</td>
);
const TableCaption: React.FC = ({ children }) => <caption>{children}</caption>;

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
