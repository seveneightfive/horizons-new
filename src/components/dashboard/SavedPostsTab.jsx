import React from 'react';
import { motion } from 'framer-motion';
import SavedPostCard from '@/components/dashboard/SavedPostCard';

const SavedPostsTab = ({ savedPosts, itemVariants, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {savedPosts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <SavedPostCard post={post} onEdit={onEdit} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
};

export default SavedPostsTab;