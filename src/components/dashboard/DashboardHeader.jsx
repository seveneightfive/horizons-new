import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
        Your Personal Dashboard
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Track your favorite events, artists, reviews, and saved content all in one beautiful place.
      </p>
    </motion.div>
  );
};

export default DashboardHeader;