import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, AlertTriangle, Leaf, Users, PawPrint, HeartPulse, ShieldQuestion, PlusCircle, Filter } from 'lucide-react';

interface ActivityCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  state?: object;
  isExternal?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ to, icon, title, description, state, isExternal }) => {
  const cardClassName = "bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-start space-y-3 hover:shadow-lg hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 h-full";
  
  const cardContent = (
    <>
      <div className="p-3 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </>
  );

  if (isExternal) {
    return (
        <a href={to} target="_blank" rel="noopener noreferrer" className={cardClassName}>
            {cardContent}
        </a>
    );
  }

  return (
    <Link
      to={to}
      state={state}
      className={cardClassName}
    >
      {cardContent}
    </Link>
  );
};


const activitiesData = [
    { category: 'Core Actions', to: "/scan", icon: <ScanLine className="text-blue-500 h-6 w-6"/>, title: "Scan a Civil ID", description: "Verify another citizen's score" },
    { category: 'Core Actions', to: "/report-crime", icon: <AlertTriangle className="text-red-500 h-6 w-6"/>, title: "Report an Incident", description: "Help keep your community safe" },
    {
      category: 'Community',
      to: "/activity-detail",
      icon: <Leaf className="text-primary-600 h-6 w-6"/>,
      title: "Environmental Care",
      description: "Participate in clean-ups and green initiatives.",
      state: {
        title: "Environmental Care Initiatives",
        iframeUrl: "https://ecovision-gray.vercel.app/"
      }
    },
    { 
      category: 'Community',
      to: "/activity-detail", 
      icon: <Users className="text-purple-500 h-6 w-6"/>, 
      title: "Community Volunteering", 
      description: "Help at local facilities and events",
      state: { title: "Community Volunteering", description: "Engage in selfless service by volunteering at local shelters, community centers, schools, or public events. Your time and effort help build a stronger, more connected community and are recognized on your Civil Score profile." }
    },
    { 
      category: 'Community',
      to: "/activity-detail", 
      icon: <PawPrint className="text-orange-500 h-6 w-6"/>, 
      title: "Animal Welfare Hub", 
      description: "Endorse assistance from our partners",
      state: { title: "Animal Welfare Hub", description: "Support animal welfare by volunteering at shelters, donating to rescue organizations, or participating in adoption drives. This section recognizes your compassion and efforts to protect and care for animals." }
    },
    { 
      category: 'Health',
      to: "/health-initiatives", 
      icon: <HeartPulse className="text-pink-500 h-6 w-6"/>, 
      title: "Health Initiatives", 
      description: "Donate blood or volunteer at camps"
    },
    { 
      category: 'Civic',
      to: "/activity-detail", 
      icon: <ShieldQuestion className="text-yellow-500 h-6 w-6"/>, 
      title: "Civic Duty", 
      description: "Report civic issues like potholes",
      state: { title: "Civic Duty", description: "Fulfill your civic responsibilities by reporting public issues such as potholes, broken streetlights, or water leaks. Proactive engagement helps improve public infrastructure and safety for everyone." }
    },
    { category: 'Other', to: "/submit-activity", icon: <PlusCircle className="text-gray-500 h-6 w-6"/>, title: "Submit Other Activity", description: "Have another activity? Submit for review" },
];

const Activities: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Default');

    const filteredActivities = activitiesData
        .filter(activity => filter === 'All' || activity.category === filter)
        .sort((a, b) => {
            if (sort === 'A-Z') return a.title.localeCompare(b.title);
            if (sort === 'Z-A') return b.title.localeCompare(a.title);
            return 0;
        });

    const categories = ['All', ...Array.from(new Set(activitiesData.map(a => a.category)))];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Actions & Activities</h1>
        <p className="text-gray-500 mt-2">Get involved, stay safe, and improve your Civil Score.</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm font-semibold text-gray-600">
            <Filter size={16} className="mr-2"/>
            Filter & Sort:
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-100 border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900 text-sm">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-100 border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900 text-sm">
            <option value="Default">Default Order</option>
            <option value="A-Z">Title (A-Z)</option>
            <option value="Z-A">Title (Z-A)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredActivities.map((activity, index) => (
            <div key={activity.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ActivityCard {...activity} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;