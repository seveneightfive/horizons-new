import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Users, Star } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import EventsTab from '@/components/dashboard/EventsTab';
import ReviewsTab from '@/components/dashboard/ReviewsTab';
import ArtistsTab from '@/components/dashboard/ArtistsTab';
import { useToast } from '@/components/ui/use-toast';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const { toast } = useToast();
  const { favoritedEvents, followedArtists, myReviews, loading } = useDashboardData();

  const handleActionClick = () => {
    toast({
        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const tabs = [
    { id: 'events', label: 'Liked Events', icon: Calendar, count: favoritedEvents.length },
    { id: 'artists', label: 'Following', icon: Users, count: followedArtists.length },
    { id: 'reviews', label: 'My Reviews', icon: Star, count: myReviews.length },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderActiveTab = () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    
    switch (activeTab) {
      case 'events':
        return favoritedEvents.length > 0 ? (
          <EventsTab events={favoritedEvents} itemVariants={itemVariants} />
        ) : <p className="text-slate-500 mt-4">You haven't liked any events yet.</p>;
      case 'artists':
        return followedArtists.length > 0 ? (
            <ArtistsTab artists={followedArtists} itemVariants={itemVariants} onEdit={handleActionClick} onDelete={handleActionClick} />
        ) : <p className="text-slate-500 mt-4">You are not following any artists yet.</p>;
      case 'reviews':
        return myReviews.length > 0 ? (
          <ReviewsTab reviews={myReviews} itemVariants={itemVariants} onEdit={handleActionClick} onDelete={handleActionClick} />
        ) : <p className="text-slate-500 mt-4">You haven't written any reviews yet.</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Personal Dashboard - 785</title>
        <meta name="description" content="Your personalized dashboard to track upcoming events, followed artists, and reviews." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Local. Vocal.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find local events. Track your favorite artists. Share reviews and more.
          </p>
        </motion.div>

        <div className="md:grid md:grid-cols-4 md:gap-8">
          <aside className="md:col-span-1 mb-8 md:mb-0">
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-2 sticky top-24"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 w-full text-left ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-sans flex-grow">{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </motion.nav>
          </aside>

          <main className="md:col-span-3">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderActiveTab()}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;