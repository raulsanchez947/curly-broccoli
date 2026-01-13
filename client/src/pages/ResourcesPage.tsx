import * as React from 'react';
import { Card } from '../components/ui/card';

function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: "Apartment Search Checklist",
      description: "A comprehensive checklist to ensure you don't miss anything when evaluating apartments.",
      category: "Guide"
    },
    {
      id: 2,
      title: "Tenant Rights Guide",
      description: "Learn about your rights and protections as a tenant in rental agreements.",
      category: "Legal"
    },
    {
      id: 3,
      title: "Moving Cost Calculator",
      description: "Calculate and estimate your moving expenses based on distance and services needed.",
      category: "Tool"
    },
    {
      id: 4,
      title: "Lease Agreement Template",
      description: "Review a standard lease agreement template to understand common terms.",
      category: "Legal"
    },
    {
      id: 5,
      title: "Neighborhood Safety Tips",
      description: "Tips for researching and assessing neighborhood safety before moving.",
      category: "Guide"
    },
    {
      id: 6,
      title: "Budget Planning Worksheet",
      description: "Interactive worksheet to help you budget for rent and living expenses.",
      category: "Tool"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Resources</h1>
        <p className="text-gray-600">Helpful tools and guides for your apartment search</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {resource.category}
            </div>
            <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm">{resource.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ResourcesPage;
