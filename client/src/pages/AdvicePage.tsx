import * as React from 'react';
import { Card } from '../components/ui/card';

function AdvicePage() {
  const adviceItems = [
    {
      id: 1,
      title: "How to Negotiate Rent",
      author: "Sarah Johnson",
      excerpt: "Learn proven strategies to negotiate better rent rates with landlords. Many people don't realize they can negotiate.",
      category: "Negotiation"
    },
    {
      id: 2,
      title: "Red Flags to Watch For",
      author: "Mike Chen",
      excerpt: "Common warning signs in apartments and landlords that could indicate problems down the line.",
      category: "Safety"
    },
    {
      id: 3,
      title: "First Apartment Tips",
      author: "Emma Davis",
      excerpt: "Practical advice for first-time renters navigating their first apartment experience.",
      category: "Beginner"
    },
    {
      id: 4,
      title: "Understanding Deposits",
      author: "James Wilson",
      excerpt: "Everything you need to know about security deposits, holding fees, and damage deposits.",
      category: "Legal"
    },
    {
      id: 5,
      title: "Building Credit History",
      author: "Lisa Martinez",
      excerpt: "How your rental history affects your credit and tips for building a strong tenant record.",
      category: "Finance"
    },
    {
      id: 6,
      title: "Moving In Checklist",
      author: "Robert Taylor",
      excerpt: "A detailed walkthrough of what to do when you first move into your new apartment.",
      category: "Moving"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Advice</h1>
        <p className="text-gray-600">Expert tips and guidance from experienced apartment hunters</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {adviceItems.map((advice) => (
          <Card key={advice.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {advice.category}
                </div>
                <h3 className="text-xl font-bold mb-2">{advice.title}</h3>
                <p className="text-gray-600 mb-3">{advice.excerpt}</p>
                <p className="text-sm text-gray-500">by {advice.author}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdvicePage;
