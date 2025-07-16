import React from 'react';
import { Heart, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArtistCard = ({ artist, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 group border border-slate-100 h-full flex flex-col">
      <div className="text-center mb-4 flex-grow">
        <img  className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-slate-200" alt={`${artist.name} artist photo`} src="https://images.unsplash.com/photo-1577683954096-f2ee04da19f8" />
        <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
          {artist.name}
        </h3>
        <p className="text-slate-500 font-medium font-sans">{artist.genre}</p>
      </div>
      <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
        <Heart className="w-4 h-4 text-red-500 fill-current" />
        <span className="font-sans">{artist.followers} followers</span>
      </div>
      <div className="flex justify-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => onEdit('artist', artist.id)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete('artist', artist.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ArtistCard;