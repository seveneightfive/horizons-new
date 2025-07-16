import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Music, Palette, PenSquare, Drama } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const typeDisplayMap = {
    'Musician / Band': 'Band',
    'Visual Artist': 'Visual',
    'Comedian': 'Performance',
    'Author / Poet': 'Literature',
};

const typeIcons = {
    Band: <Music className="w-4 h-4" />,
    Visual: <Palette className="w-4 h-4" />,
    Performance: <Drama className="w-4 h-4" />,
    Literature: <PenSquare className="w-4 h-4" />,
};

const ArtistDirectoryCard = ({ artist, upcomingEventsCount }) => {
    const displayType = typeDisplayMap[artist.type] || artist.type;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 h-full"
        >
            <Link to={`/artists/${artist.slug}`} className="block h-full flex flex-col">
                <div className="relative">
                    <img
                        className="w-full h-56 object-cover"
                        alt={`Profile of ${artist.name}`}
                        src={artist.profile_image || "https://images.unsplash.com/photo-1532715438568-979a268076c1"} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                         <Badge variant="secondary" className="capitalize bg-white/90 text-slate-900">
                             {typeIcons[displayType]} <span className="ml-2">{displayType}</span>
                         </Badge>
                         {artist.type === 'Musician / Band' && artist.genre && (
                            <Badge variant="secondary" className="capitalize bg-white/90 text-slate-900">
                                {artist.genre}
                            </Badge>
                         )}
                    </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                        {artist.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-center text-slate-500">
                         <div className="flex items-center gap-2 font-semibold">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{upcomingEventsCount} Upcoming</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ArtistDirectoryCard;