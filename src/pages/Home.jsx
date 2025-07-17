import React from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getHomePageData } from "@/lib/api";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtistDirectoryCard from "@/components/artists/ArtistDirectoryCard";
import HomeEventCard from "@/components/home/HomeEventCard";
import HomeReviewCard from "@/components/home/HomeReviewCard";

const Home = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["homePageData"],
    queryFn: getHomePageData,
  });

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: i * 0.2,
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error loading page data.
        </h2>
        <p className="text-slate-600">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>785 Event Horizon - Your Guide to Local Arts & Culture</title>
        <meta
          name="description"
          content="Discover featured events, find new favorite local artists, and read the latest reviews. Your portal to the local arts and culture scene."
        />
      </Helmet>
      <div className="space-y-16 md:space-y-24 py-12">
        {/* Featured Events */}
        {data.featuredEvents && data.featuredEvents.length > 0 && (
          <motion.section
            className="container mx-auto px-4"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center"
              variants={itemVariants}
            >
              Featured Events
            </motion.h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {data.featuredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className="flex-shrink-0 w-[80vw] md:w-[400px]"
                  >
                    <HomeEventCard event={event} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Find Your New Favorite Artist */}
        {data.randomArtists && data.randomArtists.length > 0 && (
          <motion.section
            className="container mx-auto px-4"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <motion.div
              className="flex justify-between items-center mb-6"
              variants={itemVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Find Your New Favorite Artist
              </h2>
              <Button
                asChild
                variant="link"
                className="text-slate-600 hover:text-slate-900"
              >
                <Link to="/artists">
                  View All Artists <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              variants={itemVariants}
            >
              {data.randomArtists.map((artist) => (
                <ArtistDirectoryCard
                  key={artist.id}
                  artist={artist}
                  upcomingEventsCount={
                    artist.events?.filter(
                      (e) => new Date(e.start_date) >= new Date(),
                    ).length || 0
                  }
                />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Local. Vocal. */}
        {data.latestReviews && data.latestReviews.length > 0 && (
          <motion.section
            className="bg-slate-100 py-16"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center"
                variants={itemVariants}
              >
                Local. Vocal.
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={itemVariants}
              >
                {data.latestReviews.map((review) => (
                  <HomeReviewCard key={review.id} review={review} />
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
};

export default Home;
