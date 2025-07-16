import React from 'react';
import { Calendar, Clock, MapPin, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-slate-100 h-full flex flex-col">
      <div className="relative">
        <img  className="w-full h-48 object-cover" alt={`${event.title} event`} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
          event.status === 'rsvp' ? 'bg-emerald-500' : 'bg-pink-500'
        }`}>
          {event.status === 'rsvp' ? "RSVP'd" : 'Liked'}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
          {event.title}
        </h3>
        <div className="space-y-2 text-slate-600 mb-4 flex-grow">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{event.venue}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => onEdit('event', event.id)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete('event', event.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;