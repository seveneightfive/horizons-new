import React from 'react';
import { motion } from 'framer-motion';
import ReviewCard from '@/components/dashboard/ReviewCard';

const ReviewsTab = ({ reviews, itemVariants, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {reviews.map((review) => (
        <motion.div key={review.id} variants={itemVariants}>
          <ReviewCard review={review} onEdit={onEdit} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewsTab;