import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ArtistHero = ({ artist }) => {
    const { toast } = useToast();

    const handleFollow = () => {
        toast({
            title: "You are now following " + artist.name + "!",
            description: "You'll be notified about their upcoming events.",
        });
    };

    return (
        <motion.div 
            className="relative h-[60vh] min-h-[400px] w-full text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <img 
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Hero image for ${artist.name}`}
             src="https://images.unsplash.com/photo-1624969593476-0cca787faaf1" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
                <motion.h1 
                    className="text-5xl md:text-7xl font-bold uppercase tracking-wider"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {artist.name}
                </motion.h1>
                <motion.div 
                    className="flex items-center gap-6 mt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        <span className="text-xl font-semibold">{artist.fans.toLocaleString()} Fans</span>
                    </div>
                    <Button onClick={handleFollow} size="lg" className="bg-white text-slate-900 hover:bg-slate-200 font-bold">
                        Follow
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ArtistHero;