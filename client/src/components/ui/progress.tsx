import * as React from 'react';

const Progress: React.FC<{ value?: number; className?: string }> = ({ value = 0, className = '' }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full bg-gray-200 h-2 rounded ${className}`}>
      <div className="bg-blue-600 h-2 rounded" style={{ width: `${pct}%` }} />
    </div>
  );
};

export { Progress };
