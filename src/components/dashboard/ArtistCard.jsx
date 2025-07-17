import React from "react";
import { Heart, Calendar } from "lucide-react";

const ArtistCard = ({ artist, onEdit, onDelete }) => {
  // Count upcoming events if events array exists
  const upcomingEventsCount = artist.events
    ? artist.events.filter((event) => {
        if (!event.start_date) return false;
        const eventDate = new Date(event.start_date);
        const now = new Date();
        return eventDate >= now;
      }).length
    : artist.numevents || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group border border-slate-100 h-full flex flex-col">
      <div className="text-center mb-4 flex-grow">
        <img
          className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-slate-200"
          alt={`${artist.name} artist photo`}
          src={
            artist.profile_image ||
            "https://images.unsplash.com/photo-1577683954096-f2ee04da19f8"
          }
        />
        <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
          {artist.name}
        </h3>
        <p className="text-slate-500 font-medium font-sans">
          {artist.genre || artist.type}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center gap-2 text-slate-600">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span className="font-sans">I'm a Fan</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="font-sans">
            {upcomingEventsCount} upcoming events
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
