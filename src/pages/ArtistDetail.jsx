import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getArtistBySlug } from '@/lib/api';
import NotFound from '@/pages/NotFound';
import ArtistHero from '@/components/artists/ArtistHero';
import ArtistAbout from '@/components/artists/ArtistAbout';
import ArtistContact from '@/components/artists/ArtistContact';
import ArtistEvents from '@/components/artists/ArtistEvents';
import ArtistShowcase from '@/components/artists/ArtistShowcase';
import ArtistReviews from '@/components/artists/ArtistReviews';
import AudioPlayer from '@/components/common/AudioPlayer';
import { Loader2 } from 'lucide-react';

const ArtistDetail = () => {
    const { slug } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const fetchArtist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const artistData = await getArtistBySlug(slug);
            setArtist(artistData);
            if (artistData && artistData.type === 'Band' && artistData.featured_song) {
                setCurrentSong({ url: artistData.featured_song, title: `Featured Song by ${artistData.name}` });
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchArtist();
    }, [fetchArtist]);

    const handleReviewAdded = (newReview) => {
        setArtist(prevArtist => ({
            ...prevArtist,
            reviews: [newReview, ...(prevArtist.reviews || [])]
        }));
    };

    const handleFollowToggle = (isFollowing) => {
        setArtist(prevArtist => ({
            ...prevArtist,
            fans_count: isFollowing ? (prevArtist.fans_count || 0) + 1 : (prevArtist.fans_count || 0) - 1
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="h-16 w-16 animate-spin text-slate-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Could not load artist data.</h2>
                <p className="text-slate-600">{error}</p>
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
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
    };

    return (
        <>
            <Helmet>
                <title>{artist.name} - Artist Profile</title>
                <meta name="description" content={artist.bio ? artist.bio.substring(0, 160) : `Details for ${artist.name}`} />
            </Helmet>
            <div className="bg-slate-50">
                <ArtistHero artist={artist} onFollowToggle={handleFollowToggle} />

                <motion.div 
                    className="container mx-auto px-4 py-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <ArtistAbout bio={artist.bio} />
                            <ArtistEvents events={artist.events} artistName={artist.name} />
                            <ArtistShowcase artist={artist} />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                             <ArtistContact artist={artist} />
                             <ArtistReviews reviews={artist.reviews} artistId={artist.id} onReviewAdded={handleReviewAdded} />
                        </div>
                    </div>
                </motion.div>
                
                {currentSong && <AudioPlayer song={currentSong} onClose={() => setCurrentSong(null)} />}
            </div>
        </>
    );
};

export default ArtistDetail;