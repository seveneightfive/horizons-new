import React from 'react';
import { motion } from 'framer-motion';
import ArtistCard from '@/components/dashboard/ArtistCard';

const ArtistsTab = ({ artists, itemVariants, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {artists.map((artist) => (
        <motion.div key={artist.id} variants={itemVariants}>
          <ArtistCard artist={artist} onEdit={onEdit} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
};

export default ArtistsTab;