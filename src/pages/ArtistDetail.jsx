import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  getArtistBySlug,
  followArtist,
  unfollowArtist,
  checkIfFollowing,
} from "@/lib/api";
import { Users, Heart, Play, Mail, Globe, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import NotFound from "@/pages/NotFound";
import { Link } from "react-router-dom";

const ArtistDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [fanCount, setFanCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistBySlug(slug);
        if (artistData) {
          setArtist(artistData);
          setFanCount(artistData.fans || 0);

          // Check if user is following this artist
          if (user) {
            const following = await checkIfFollowing(user.id, artistData.id);
            setIsFollowing(following);
          }
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtist();
    }
  }, [slug, user]);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow artists.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowArtist(user.id, artist.id);
        setIsFollowing(false);
        setFanCount((prev) => prev - 1);
        toast({
          title: `Unfollowed ${artist.name}`,
          description: "You will no longer receive updates about this artist.",
        });
      } else {
        await followArtist(user.id, artist.id);
        setIsFollowing(true);
        setFanCount((prev) => prev + 1);
        toast({
          title: `Now following ${artist.name}!`,
          description: "You'll be notified about their upcoming events.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Follow/unfollow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getVenueName = (venue) => {
    if (!venue) return "Venue TBA";
    if (typeof venue === "object" && venue.name) {
      return venue.name;
    }
    if (typeof venue === "string") {
      try {
        const venueObj = JSON.parse(venue);
        return venueObj.name || "Venue TBA";
      } catch (e) {
        return venue;
      }
    }
    return "Venue TBA";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>{artist.name} - Artist Profile</title>
        <meta
          name="description"
          content={
            artist.bio
              ? artist.bio.substring(0, 160)
              : `${artist.name} artist profile`
          }
        />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={
            artist.hero_image ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
          }
          alt={`Hero image for ${artist.name}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 relative z-10">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-wide"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            {artist.name}
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="flex items-center gap-3 text-white">
              <Users className="w-6 h-6" />
              <span className="text-xl font-semibold">
                {fanCount.toLocaleString()} Fans
              </span>
            </div>

            <Button
              onClick={handleFollow}
              size="lg"
              variant={isFollowing ? "outline" : "default"}
              className={`font-bold transition-all duration-200 ${
                isFollowing
                  ? "bg-transparent border-white text-white hover:bg-white hover:text-slate-900"
                  : "bg-white text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Heart
                className={`w-5 h-5 mr-2 ${isFollowing ? "fill-current" : ""}`}
              />
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* About Section */}
            {artist.bio && (
              <motion.section variants={itemVariants}>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  About
                </h2>
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                  {artist.bio.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Upcoming Events Section */}
            {artist.events && artist.events.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artist.events.map((event) => (
                    <Card
                      key={event.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            event.hero_image ||
                            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
                          }
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {event.tags &&
                            event.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-slate-600 mb-2">
                          {formatDate(event.start_date)}
                        </p>
                        <p className="text-slate-500 text-sm mb-4">
                          {getVenueName(event.venue)}
                        </p>
                        <Link to={`/events/${event.slug}`}>
                          <Button className="w-full">View Event</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Gallery or Featured Video Section */}
            <motion.section variants={itemVariants}>
              {artist.gallery && artist.gallery.length > 0 ? (
                <>
                  <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artist.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : artist.youtube_links && artist.youtube_links.length > 0 ? (
                <>
                  <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    Featured Video
                  </h2>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={artist.youtube_links[0].url}
                      title={artist.youtube_links[0].title || "Featured Video"}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </>
              ) : null}
            </motion.section>

            {/* Featured Song Section */}
            {artist.featured_song && (
              <motion.section variants={itemVariants}>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  Featured Song
                </h2>
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Featured Song</h3>
                      <p className="text-slate-600">by {artist.name}</p>
                    </div>
                  </div>
                  <audio controls className="w-full">
                    <source src={artist.featured_song} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </Card>
              </motion.section>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Artist Section */}
            <motion.section variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Contact Artist
                </h2>

                {artist.profile_image && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={artist.profile_image}
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {artist.contact?.website && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={artist.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}

                  {artist.contact?.email && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={`mailto:${artist.contact.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}

                  {artist.contact?.facebook && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={artist.contact.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            </motion.section>

            {/* Reviews Section - Placeholder */}
            <motion.section variants={itemVariants}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Reviews
                </h2>
                <p className="text-slate-600 text-center py-8">
                  Reviews section coming soon...
                </p>
              </Card>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ArtistDetail;
