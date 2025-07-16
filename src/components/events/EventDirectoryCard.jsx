import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useFavoriteEvent } from '@/hooks/useFavoriteEvent';

const EventDirectoryCard = ({ event }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, loading } = useFavoriteEvent(event.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to favorite an event.',
        variant: 'destructive',
      });
      return;
    }
    toggleFavorite();
  };

  return (
    <Link
      to={`/events/${event.slug}`}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 h-full flex flex-col"
    >
      <div className="relative">
        <img
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          alt={`${event.title} event`}
          src={event.hero_image || 'https://images.unsplash.com/photo-1595872018818-97555653a011'}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
            onClick={handleFavoriteClick}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`} />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-300 transition-colors">
            {event.title}
          </h3>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="space-y-3 text-slate-600 mb-4 flex-grow">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-sans">
              {new Date(event.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-sans">{event.start_time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-sans">{event.venue}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {(event.tags || []).map((tag) => (
            <div key={tag} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default EventDirectoryCard;