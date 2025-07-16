import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SavedPostCard = ({ post, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-slate-100 h-full flex flex-col">
      <img  className="w-full h-48 object-cover" alt={`${post.title} image`} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between text-slate-500 text-sm mb-2 font-sans">
          <span>{post.source}</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4 font-sans flex-grow">
          {post.content}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => onEdit('post', post.id)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete('post', post.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedPostCard;