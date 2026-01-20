import * as React from 'react';

function ResourcesPage() {
  const resources = [
    'Apartment checklist',
    'Tenant rights guide',
    'Moving cost calculator',
    'Lease template',
    'Neighborhood safety tips',
    'Budget planner',
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      <ul className="list-disc pl-6 space-y-2">
        {resources.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResourcesPage;
