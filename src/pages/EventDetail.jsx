import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useEventDetailData } from "@/hooks/useEventDetailData";
import NotFound from "@/pages/NotFound";
import EventHero from "@/components/events/EventHero";
import EventDetails from "@/components/events/EventDetails";
import EventFeaturedArtists from "@/components/events/EventFeaturedArtists";
import { Loader2 } from "lucide-react";

const EventDetail = () => {
  const { slug } = useParams();
  const { event, loading, error } = useEventDetailData(slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-500">Error loading event</h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!event) {
    return <NotFound />;
  }

  const featuredArtists = event.artists ? [event.artists] : [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <>
      <Helmet>
        <title>{event.title} - EventHorizon</title>
        <meta
          name="description"
          content={event.description?.substring(0, 160) || ""}
        />
      </Helmet>
      <div className="bg-slate-50">
        <EventHero event={event} />

        <motion.div
          className="container mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-lg text-slate-600 leading-relaxed"
              >
                {event.description}
              </motion.p>
              {featuredArtists.length > 0 && (
                <EventFeaturedArtists artists={featuredArtists} />
              )}
            </div>
            <div className="lg:col-span-1">
              <EventDetails event={event} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EventDetail;
