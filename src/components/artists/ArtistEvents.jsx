import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EventCard = ({ event, artistName }) => {
    const getVenueName = (venue) => {
        if (!venue) return "TBA";
        try {
            const venueObj = typeof venue === 'string' ? JSON.parse(venue) : venue;
            return venueObj.name || "TBA";
        } catch (error) {
            console.error("Failed to parse venue JSON:", error);
            return "TBA";
        }
    }
    
    const getStartDate = (event) => {
        if (!event || !event.start_date) return "Date TBC";
        return new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-300">
            <Link to={`/events/${event.slug}`} className="w-full sm:w-32 h-32 sm:h-24 flex-shrink-0">
                <img
                    src={event.hero_image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
                    alt={`Promotional image for ${event.title}`}
                    className="w-full h-full object-cover rounded-md"
                />
            </Link>
            <div className="flex-grow text-center sm:text-left">
                <Link to={`/events/${event.slug}`}>
                    <h4 className="text-xl font-bold text-slate-800 hover:text-slate-900 transition-colors">{event.title}</h4>
                </Link>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{getStartDate(event)}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{getVenueName(event.venue)}</span>
                </div>
            </div>
            <div className="flex-shrink-0">
                <Link to={`/events/${event.slug}`}>
                    <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors">
                        <Ticket className="w-4 h-4" />
                        <span>View Event</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

const ArtistEvents = ({ events, artistName }) => {
    const upcomingEvents = (Array.isArray(events) ? events : [])
        .filter(event => new Date(event.start_date) >= new Date())
        .sort((a,b) => new Date(a.start_date) - new Date(b.start_date));
    
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="bg-white shadow-lg border-slate-100">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-3xl uppercase tracking-wide">Upcoming Events</CardTitle>
                        <Badge variant="secondary" className="text-lg">{upcomingEvents.length}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-6">
                            {upcomingEvents.map(event => (
                                <EventCard key={event.id} event={event} artistName={artistName} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-4">No upcoming events scheduled for {artistName}.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ArtistEvents;