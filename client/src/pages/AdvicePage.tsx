import * as React from 'react';

function AdvicePage() {
  const items = [
    'How to negotiate rent',
    'Red flags to watch for',
    'First apartment tips',
    'Understanding deposits',
    'Building credit history',
    'Moving in checklist',
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Advice</h1>
      <ul className="list-disc pl-6 space-y-2">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdvicePage;
