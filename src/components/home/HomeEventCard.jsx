import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const HomeEventCard = ({ event }) => {
  const getVenueName = (venue) => {
    if (!venue) return "Venue TBA";

    // Handle JSONB venue field
    if (typeof venue === "object" && venue.name) {
      return venue.name;
    }

    // Handle stringified JSON
    if (typeof venue === "string") {
      try {
        const venueObj = JSON.parse(venue);
        return venueObj.name || "Venue TBA";
      } catch (e) {
        return venue; // Return as-is if it's just a string
      }
    }

    return "Venue TBA";
  };

  const getStartDate = (event) => {
    if (!event.start_date) return "Date TBC";
    return new Date(event.start_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0">
        <CardHeader className="p-0">
          <Link to={`/events/${event.slug}`} className="block">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={
                  event.hero_image ||
                  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
                }
                alt={`Promotional image for ${event.title}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </Link>
        </CardHeader>
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              {event.tags &&
                event.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="uppercase text-xs font-bold tracking-wider"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <Link to={`/events/${event.slug}`} className="block">
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2 hover:text-slate-700 transition-colors">
                {event.title}
              </h3>
            </Link>
            <div className="text-slate-500 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{getStartDate(event)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{getVenueName(event)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-slate-50">
          <Link to={`/events/${event.slug}`} className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-3 rounded-lg hover:bg-slate-900 transition-colors font-semibold">
              <Ticket className="w-5 h-5" />
              <span>View Event</span>
            </button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default HomeEventCard;
