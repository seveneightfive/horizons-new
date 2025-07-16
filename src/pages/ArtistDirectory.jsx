import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { getArtists } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ArtistDirectoryCard from '@/components/artists/ArtistDirectoryCard';
import { Search, Music, Palette, PenSquare, Drama, Loader2 } from 'lucide-react';

const artistTypes = [
    { name: 'All', icon: null, dbType: 'All' },
    { name: 'Band', icon: Music, dbType: 'Musician / Band' },
    { name: 'Visual', icon: Palette, dbType: 'Visual Artist' },
    { name: 'Performance', icon: Drama, dbType: 'Comedian' },
    { name: 'Literature', icon: PenSquare, dbType: 'Author / Poet' },
];

const ArtistDirectory = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTypeFilter, setActiveTypeFilter] = useState('All');
    const [activeGenreFilter, setActiveGenreFilter] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const artistsData = await getArtists();
                setArtists(artistsData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const genres = useMemo(() => {
        if (!artists) return [];
        const bandGenres = artists
            .filter(artist => artist.type === 'Musician / Band' && artist.genre)
            .map(artist => artist.genre);
        return ['All', ...new Set(bandGenres)];
    }, [artists]);

    const filteredArtists = useMemo(() => {
        if (!artists) return [];

        const selectedTypeObject = artistTypes.find(t => t.name === activeTypeFilter);
        const dbFilterType = selectedTypeObject ? selectedTypeObject.dbType : 'All';

        return artists
            .filter(artist => {
                if (dbFilterType === 'All') return true;
                return artist.type === dbFilterType;
            })
            .filter(artist => {
                if (activeTypeFilter !== 'Band' || activeGenreFilter === 'All') return true;
                return artist.genre === activeGenreFilter;
            })
            .filter(artist => {
                return artist.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [artists, searchTerm, activeTypeFilter, activeGenreFilter]);
    
    const handleTypeFilterClick = (name) => {
        setActiveTypeFilter(name);
        setActiveGenreFilter('All');
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-16 w-16 animate-spin text-slate-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                <p className="text-slate-600">{error}</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Artist Directory - EventHorizon</title>
                <meta name="description" content="Discover and follow talented artists." />
            </Helmet>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Artist Directory</h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">Explore, discover, and follow your favorite artists.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md space-y-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by artist name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="font-semibold self-center mr-2">Type:</span>
                        {artistTypes.map(({ name, icon: Icon }) => (
                            <Button
                                key={name}
                                variant={activeTypeFilter === name ? 'default' : 'outline'}
                                onClick={() => handleTypeFilterClick(name)}
                                className={`transition-all duration-200 ${activeTypeFilter === name ? 'bg-slate-900 text-white' : 'bg-white'}`}
                            >
                                {Icon && <Icon className="w-4 h-4 mr-2" />}
                                {name}
                            </Button>
                        ))}
                    </div>
                    <AnimatePresence>
                    {activeTypeFilter === 'Band' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2 justify-center items-center"
                        >
                            <span className="font-semibold mr-2">Genre:</span>
                            {genres.map((genre) => (
                                <Button
                                    key={genre}
                                    variant={activeGenreFilter === genre ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveGenreFilter(genre)}
                                    className={`transition-all duration-200 ${activeGenreFilter === genre ? 'bg-slate-800 text-white' : 'bg-white'}`}
                                >
                                    {genre}
                                </Button>
                            ))}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map(artist => (
                            <motion.div key={artist.id} variants={itemVariants}>
                                <ArtistDirectoryCard artist={artist} upcomingEventsCount={artist.events.length} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.p variants={itemVariants} className="col-span-full text-center text-slate-500 text-lg">
                            No artists found. Try adjusting your search or filters.
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default ArtistDirectory;