import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeReviewCard = ({ review }) => {
    if (!review || !review.artists) {
        return null;
    }

    return (
        <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }} className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <Link to={`/artists/${review.artists.slug}`}>
                    <img
                        src={review.artists.profile_image || 'https://images.unsplash.com/photo-1595872018818-97555653a011'}
                        alt={review.artists.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-1">
                    <Link to={`/artists/${review.artists.slug}`}>
                        <h4 className="text-xl font-bold text-slate-800 hover:text-slate-900 transition-colors">
                            {review.artists.name}
                        </h4>
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="flex-grow text-slate-600 italic border-l-4 border-slate-200 pl-4 mb-4">
                "{review.review}"
            </blockquote>
            <p className="text-right text-sm text-slate-500 font-semibold">- {review.author || 'Anonymous'}</p>
        </motion.div>
    );
};

export default HomeReviewCard;