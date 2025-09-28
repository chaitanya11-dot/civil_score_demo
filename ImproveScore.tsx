
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Leaf, Users, PawPrint, HeartPulse, ShieldQuestion, PlusCircle, ArrowRight } from 'lucide-react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, link }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
    <div className="flex-shrink-0 mb-4">
        {icon}
    </div>
    <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 mt-2 text-sm">{description}</p>
    </div>
    <div className="mt-6">
        <Link 
            to={link} 
            className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
        >
            Get Started
            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
  </div>
);

const improvementActions: ActionCardProps[] = [
  {
    icon: <Users className="h-8 w-8 text-purple-500" />,
    title: "Community Volunteering",
    description: "Engage in selfless service by volunteering at local shelters, community centers, or public events.",
    link: "/activities",
  },
  {
    icon: <Leaf className="h-8 w-8 text-primary-600" />,
    title: "Environmental Care",
    description: "Contribute to environmental wellness through community clean-ups, tree planting, or recycling drives.",
    link: "/activities",
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-pink-500" />,
    title: "Health Initiatives",
    description: "Support public health by donating blood or volunteering at health camps and awareness programs.",
    link: "/health-initiatives",
  },
  {
    icon: <ShieldQuestion className="h-8 w-8 text-yellow-500" />,
    title: "Fulfill Civic Duties",
    description: "Report public issues like potholes, broken streetlights, or water leaks to improve local infrastructure.",
    link: "/activities",
  },
  {
    icon: <PawPrint className="h-8 w-8 text-orange-500" />,
    title: "Animal Welfare",
    description: "Show compassion by volunteering at shelters, donating to rescues, or participating in adoption drives.",
    link: "/activities",
  },
  {
    icon: <PlusCircle className="h-8 w-8 text-gray-500" />,
    title: "Submit Other Activities",
    description: "Have another positive contribution to share? Submit it for review and verification by our team.",
    link: "/submit-activity",
  },
];

const ImproveScore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary-100 p-4 rounded-full mb-4">
          <TrendingUp className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Improve Your Civil Score</h1>
        <p className="text-lg text-gray-500 mt-3 max-w-2xl mx-auto">
          Discover actionable ways to enhance your digital reputation and unlock new benefits through positive civic engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {improvementActions.map((action, index) => (
          <div key={index} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
            <ActionCard {...action} />
          </div>
        ))}
      </div>
      
       <div className="mt-12 bg-primary-50 border-l-4 border-primary-500 text-primary-800 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
               <TrendingUp className="h-6 w-6 text-primary-600"/>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">The Path to a Higher Score</h3>
              <p className="mt-2 text-sm text-primary-700">
                Your Civil Score reflects your long-term commitment to positive community and civic behavior. Consistency is key. Regular participation in these activities will steadily improve your score over time.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ImproveScore;
