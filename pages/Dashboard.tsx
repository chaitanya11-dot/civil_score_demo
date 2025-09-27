
import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, AlertTriangle, CheckCircle, ArrowRight, Gift, Ticket, Zap, Star, Leaf, Users, PawPrint } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCivilScore } from '../hooks/useCivilScore';
import ScoreBreakdown from '../components/ScoreBreakdown';

const QuickActionCard: React.FC<{ to: string; icon: React.ReactNode; title: string; subtitle: string; iconBgColor: string }> = ({ to, icon, title, subtitle, iconBgColor }) => (
    <Link to={to} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4 hover:shadow-lg hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <ArrowRight className="ml-auto text-gray-300" size={20} />
    </Link>
);

const RewardCard: React.FC<{ title: string, subtitle: string, icon: React.ReactNode, bgColor: string, textColor: string }> = ({ title, subtitle, icon, bgColor, textColor }) => (
    <div className={`p-4 rounded-lg flex-1 ${bgColor} ${textColor} transition-transform transform hover:scale-105 shadow`}>
        <div className="flex items-center space-x-3">
            {icon}
            <div>
                <h4 className="font-bold">{title}</h4>
                <p className="text-xs opacity-80">{subtitle}</p>
            </div>
        </div>
    </div>
);

const recentActivities = [
    {
        user: 'Alice J.',
        date: 'Verified 2 days ago',
        icon: <Leaf className="text-primary-600 h-5 w-5"/>,
        title: "Environmental Care",
        description: "This activity covers contributions to environmental wellness, such as participating in community clean-up drives, tree planting initiatives, promoting recycling programs, and conserving water or energy. Verified actions positively impact your Civil Score."
    },
    {
        user: 'Bob W.',
        date: 'Verified 5 days ago',
        icon: <Users className="text-purple-600 h-5 w-5"/>,
        title: "Community Volunteering",
        description: "Engage in selfless service by volunteering at local shelters, community centers, schools, or public events. Your time and effort help build a stronger, more connected community and are recognized on your Civil Score profile."
    },
    {
        user: 'Charlie B.',
        date: 'Verified 1 week ago',
        icon: <PawPrint className="text-orange-600 h-5 w-5"/>,
        title: "Animal Welfare Hub",
        description: "Support animal welfare by volunteering at shelters, donating to rescue organizations, or participating in adoption drives. This section recognizes your compassion and efforts to protect and care for animals."
    }
];


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { score, tier, breakdown, tierIcon: TierIcon, tierColor } = useCivilScore(user?.id);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Civil Score Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fade-in-up">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">Your Civil Score</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
           <div className="flex flex-col items-center">
             <div className={`w-32 h-32 rounded-full flex items-center justify-center ${tierColor.bg} border-4 ${tierColor.border}`}>
                <TierIcon className={`h-16 w-16 ${tierColor.text}`} />
             </div>
           </div>
           <div className="text-center md:text-left">
              <p className="text-6xl font-bold text-gray-800">{score}</p>
              <p className={`text-xl font-semibold ${tierColor.text}`}>{tier} Tier</p>
              <p className="text-gray-500 text-sm mt-1">Based on your recent civic activities.</p>
           </div>
        </div>
      </div>
      
      {/* Score Breakdown Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
         <ScoreBreakdown breakdown={breakdown} finalScore={score} />
      </div>


      {/* Quick Actions Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard to="/scan" icon={<ScanLine className="text-blue-500"/>} title="Scan Civil ID" subtitle="Verify another citizen's score" iconBgColor="bg-blue-100" />
            <QuickActionCard to="/report-crime" icon={<AlertTriangle className="text-red-500"/>} title="Report an Incident" subtitle="Help make your community safe" iconBgColor="bg-red-100"/>
        </div>
        <div className="mt-4 bg-white p-5 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="text-green-500"/>
            </div>
             <div>
                <h3 className="font-semibold text-gray-800">Good Standing</h3>
                <p className="text-sm text-gray-500">No recent flags or violations.</p>
            </div>
        </div>
      </div>
      
      {/* Recent Verified Activities Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Verified Activities</h2>
            <Link to="/activities" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                View All
            </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
                <Link 
                    key={index} 
                    to="/activity-detail" 
                    state={{ title: activity.title, description: activity.description }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">{activity.icon}</div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{activity.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">by {activity.user} &bull; {activity.date}</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-1" />
                </Link>
            ))}
        </div>
      </div>

      {/* Rewards & Offers Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rewards & Offers</h2>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <RewardCard title="Free Vouchers" subtitle="Redeem now" icon={<Gift size={24}/>} bgColor="bg-blue-500" textColor="text-white"/>
            <RewardCard title="Special Offers" subtitle="ALL ACCESS" icon={<Ticket size={24}/>} bgColor="bg-purple-500" textColor="text-white"/>
            <RewardCard title="Early Access" subtitle="New feature" icon={<Zap size={24}/>} bgColor="bg-teal-500" textColor="text-white"/>
            <RewardCard title="Community Badge" subtitle="New addition" icon={<Star size={24}/>} bgColor="bg-orange-400" textColor="text-white"/>
            <Link to="/rewards" className="p-4 rounded-lg flex-1 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all min-w-[150px] transform hover:scale-105">
                <ArrowRight size={24} className="text-gray-500"/>
                <span className="text-sm font-semibold mt-1 text-gray-700">View All</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
