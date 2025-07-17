import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import NotFound from "@/pages/NotFound";
import ArtistHero from "@/components/artists/ArtistHero";
import ArtistAbout from "@/components/artists/ArtistAbout";
import ArtistContact from "@/components/artists/ArtistContact";
import ArtistEvents from "@/components/artists/ArtistEvents";
import ArtistShowcase from "@/components/artists/ArtistShowcase";
import ArtistReviews from "@/components/artists/ArtistReviews";
import AudioPlayer from "@/components/common/AudioPlayer";

const ArtistDetail = () => {
  const { slug } = useParams();
  const { getArtistBySlug, getEventsByArtistId, getReviewsByArtistId } =
    useDashboardData();
  const [artist, setArtist] = useState(null);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const artistData = getArtistBySlug(slug);
    if (artistData) {
      setArtist(artistData);
      setEvents(getEventsByArtistId(artistData.id));
      setReviews(getReviewsByArtistId(artistData.id));
      if (artistData.type === "Band" && artistData.featuredSong) {
        setCurrentSong({
          url: artistData.featuredSong,
          title: `Featured Song by ${artistData.name}`,
        });
      }
    }
  }, [slug, getArtistBySlug, getEventsByArtistId, getReviewsByArtistId]);

  if (!artist) {
    return <NotFound />;
  }

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
        <title>{artist.name} - Artist Profile</title>
        <meta name="description" content={artist.bio.substring(0, 160)} />
      </Helmet>
      <div className="bg-slate-50">
        <ArtistHero artist={artist} />

        <motion.div
          className="container mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-12">
              <ArtistAbout bio={artist.bio} />
              <ArtistEvents events={events} />
              <ArtistShowcase artist={artist} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <ArtistContact artist={artist} />
              <ArtistReviews reviews={reviews} />
            </div>
          </div>
        </motion.div>

        {currentSong && (
          <AudioPlayer
            song={currentSong}
            onClose={() => setCurrentSong(null)}
          />
        )}
      </div>
    </>
  );
};

export default ArtistDetail;
