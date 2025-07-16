import React from 'react';
import { Star, Edit3, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ReviewCard = ({ review }) => {
    const { toast } = useToast();

    const handleActionClick = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    if (!review.artists) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 flex items-center justify-center">
                <p className="text-slate-500">Review data is incomplete.</p>
            </div>
        )
    }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group border border-slate-100 h-full flex flex-col">
      <div className="flex gap-4 mb-4">
        <Link to={`/artists/${review.artists.slug}`}>
            <img className="w-24 h-24 object-cover rounded-xl flex-shrink-0" alt={`${review.artists.name} photo`} src={review.artists.profile_image || 'https://images.unsplash.com/photo-1595872018818-97555653a011'} />
        </Link>
        <div className="flex-1">
          <Link to={`/artists/${review.artists.slug}`}>
            <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                {review.artists.name}
            </h3>
          </Link>
          <p className="text-slate-500 font-medium mb-2 font-sans">{review.artists.type}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed mb-4 font-sans flex-grow italic">
        "{review.review}"
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-sans">
            <User className="w-4 h-4"/> 
            <span>by {review.author}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleActionClick} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleActionClick} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;