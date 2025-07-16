import React from 'react';
import { motion } from 'framer-motion';

const DashboardNav = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-4 mb-8"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-sans">{tab.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};

export default DashboardNav;