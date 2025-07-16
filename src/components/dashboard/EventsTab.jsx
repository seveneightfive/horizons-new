import React from 'react';
import { motion } from 'framer-motion';
import EventCard from '@/components/dashboard/EventCard';

const EventsTab = ({ events, itemVariants, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <EventCard event={event} onEdit={onEdit} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
};

export default EventsTab;