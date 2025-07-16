import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ArtistCard = ({ artist }) => (
    <Link to={`/artists/${artist.slug}`}>
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-100 rounded-lg overflow-hidden group"
        >
            <img className="w-full h-32 object-cover" src={artist.profile_image || "https://images.unsplash.com/photo-1577683954096-f2ee04da19f8"} alt={artist.name} />
            <div className="p-3">
                <h5 className="font-bold text-slate-800 group-hover:underline">{artist.name}</h5>
                <p className="text-sm text-slate-500">{artist.type}</p>
            </div>
        </motion.div>
    </Link>
);

const EventFeaturedArtists = ({ artists }) => {
    if (!artists || artists.length === 0) {
        return null;
    }

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="bg-white shadow-lg border-slate-100">
                <CardHeader>
                    <CardTitle className="text-3xl uppercase tracking-wide">Featured Artists</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {artists.map(artist => artist && <ArtistCard key={artist.id} artist={artist} />)}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default EventFeaturedArtists;