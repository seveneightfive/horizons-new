import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Heart, CheckSquare } from 'lucide-react';

const EventHero = ({ event }) => {
    const { toast } = useToast();

    const handleActionClick = (action) => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
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
                alt={`Hero image for ${event.title}`}
                src={event.hero_image || "https://images.unsplash.com/photo-1624969593476-0cca787faaf1"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
                <motion.h1 
                    className="text-5xl md:text-7xl font-bold uppercase tracking-wider"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {event.title}
                </motion.h1>
                <motion.div 
                    className="flex items-center gap-4 mt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Button onClick={() => handleActionClick('Like')} size="lg" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold">
                        <Heart className="w-5 h-5 mr-2" /> Like
                    </Button>
                    <Button onClick={() => handleActionClick('RSVP')} size="lg" className="bg-white text-slate-900 hover:bg-slate-200 font-bold">
                        <CheckSquare className="w-5 h-5 mr-2" /> RSVP
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventHero;