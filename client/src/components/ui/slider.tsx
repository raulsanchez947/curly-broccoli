import * as React from 'react';

const Slider: React.FC<{ value?: number; onChange?: (v:number)=>void; className?:string }> = ({ value = 0, className = '' }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-2 bg-gray-200 rounded ${className}`}>
      <div className="h-2 bg-blue-600 rounded" style={{ width: `${pct}%` }} />
    </div>
  );
};

export { Slider };
