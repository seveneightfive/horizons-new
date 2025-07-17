import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useEventDirectoryData } from "@/hooks/useEventDirectoryData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventDirectoryCard from "@/components/events/EventDirectoryCard";
import { Search, Loader2 } from "lucide-react";

const eventTypes = [
  "All",
  "Art",
  "Live Music",
  "Entertainment",
  "Local Flavor",
  "Lifestyle",
];
const eventTags = [
  "All",
  "All Ages",
  "Cultural",
  "Annual",
  "Free",
  "Outdoor",
  "Wellness",
];

const EventDirectory = () => {
  const { events, loading, error } = useEventDirectoryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeTags, setActiveTags] = useState([]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter((event) => {
        if (activeType === "All") return true;
        return event.type === activeType;
      })
      .filter((event) => {
        if (activeTags.length === 0) return true;
        return activeTags.every(
          (tag) => event.tags && event.tags.includes(tag),
        );
      })
      .filter((event) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (event.title &&
            event.title.toLowerCase().includes(lowerSearchTerm)) ||
          (event.description &&
            event.description.toLowerCase().includes(lowerSearchTerm))
        );
      });
  }, [events, searchTerm, activeType, activeTags]);

  const toggleTag = (tag) => {
    if (tag === "All") {
      setActiveTags([]);
      return;
    }
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Error loading events
        </h1>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Event Directory - 785</title>
        <meta
          name="description"
          content="Find exciting events happening near you in the 785 area."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Event Directory
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover what's happening in Top City..
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md space-y-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by event name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center border-b pb-4">
            {eventTypes.map((type) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                onClick={() => setActiveType(type)}
                className={`transition-all duration-200 ${activeType === type ? "bg-slate-900 text-white" : "bg-white"}`}
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {eventTags.map((tag) => (
              <Button
                key={tag}
                variant={
                  (tag === "All" && activeTags.length === 0) ||
                  activeTags.includes(tag)
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() => toggleTag(tag)}
                className={`rounded-full transition-all duration-200 ${(tag === "All" && activeTags.length === 0) || activeTags.includes(tag) ? "bg-slate-700 text-white" : "bg-slate-100"}`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <motion.div key={event.id} variants={itemVariants} layout>
                    <EventDirectoryCard event={event} />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  variants={itemVariants}
                  className="col-span-full text-center text-slate-500 text-lg"
                >
                  No events found. Try adjusting your search or filters.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default EventDirectory;
