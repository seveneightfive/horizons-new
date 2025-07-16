import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Youtube } from 'lucide-react';

const VisualShowcase = ({ gallery }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((imageSrc, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                <img  className="w-full h-full object-cover" alt={`Artwork ${index + 1}`} src={imageSrc || 'https://images.unsplash.com/photo-1549492423-400254a284a5'} />
            </motion.div>
        ))}
    </div>
);

const BandShowcase = ({ links }) => (
    <div className="space-y-4">
        {links.map((link, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <Youtube className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-slate-800">{link.title}</h4>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:underline">Watch on YouTube</a>
                </div>
            </div>
        ))}
    </div>
);


const ArtistShowcase = ({ artist }) => {
    const showVisual = (artist.type === 'Visual' || artist.type === 'Performance') && artist.gallery && artist.gallery.length > 0;
    const showBand = artist.type === 'Band' && artist.youtubeLinks && artist.youtubeLinks.length > 0;

    if (!showVisual && !showBand) return null;

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="bg-white shadow-lg border-slate-100">
                <CardHeader>
                    <CardTitle className="text-3xl uppercase tracking-wide">Showcase</CardTitle>
                </CardHeader>
                <CardContent>
                    {showVisual && <VisualShowcase gallery={artist.gallery} />}
                    {showBand && <BandShowcase links={artist.youtubeLinks} />}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ArtistShowcase;