import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
const venueTypes = ['Bar', 'Restaurant', 'Gallery', 'Music Hall', 'Community Space', 'Theater'];
const venueNeighborhoods = ['Downtown', 'River North', 'West Loop', 'Logan Square', 'Wicker Park', 'Lincoln Park'];
const VenueCard = ({
  venue,
  index
}) => <motion.div variants={fadeIn('up', 'spring', index * 0.1, 0.75)}>
        <Link to={`/venues/${venue.slug}`} state={{
    from: window.location.pathname + window.location.search
  }}>
            <Card className="group overflow-hidden rounded-lg border bg-background hover:border-primary transition-all duration-300 relative h-full flex flex-col shadow-sm">
                <div className="overflow-hidden relative h-48">
                    <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={venue.name} src={venue.hero_image || "https://images.unsplash.com/photo-1688046671828-c26b7fd54596"} />
                    <div className="absolute bottom-2 left-2 p-1 bg-background/80 backdrop-blur-sm rounded-md">
                        <img className="h-12 w-12 rounded-sm object-contain" alt={`${venue.name} logo`} src={venue.logo || "https://images.unsplash.com/photo-1688046671828-c26b7fd54596"} />
                    </div>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold font-heading uppercase text-foreground mb-1 group-hover:text-primary transition-colors">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">{venue.type}</p>
                    </div>
                    <div className="text-sm text-muted-foreground mt-4 space-y-1.5">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>{venue.neighborhood}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span>{venue.events_count || 0} upcoming events</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    </motion.div>;
const VenuesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(params.get('type') || 'All');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState(params.get('neighborhood') || 'All');
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('venues').select('*, events_count:events(count)');
      if (error) {
        console.error('Error fetching venues:', error);
      } else {
        const formattedData = data.map(v => ({
          ...v,
          events_count: v.events_count[0]?.count || 0
        }));
        setVenues(formattedData);
      }
      setLoading(false);
    };
    fetchVenues();
  }, []);
  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === 'All') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };
  const filteredVenues = useMemo(() => {
    if (!venues) return [];
    return venues.filter(venue => {
      const typeMatch = typeFilter === 'All' || venue.type === typeFilter;
      const neighborhoodMatch = neighborhoodFilter === 'All' || venue.neighborhood === neighborhoodFilter;
      return typeMatch && neighborhoodMatch;
    });
  }, [venues, typeFilter, neighborhoodFilter]);
  return <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition} className="container mx-auto px-4 py-8">
            <Helmet>
                <title>Venues | Discover Local Spots</title>
                <meta name="description" content="Explore the best local venues, from bars and restaurants to galleries and community spaces." />
            </Helmet>
            
            <motion.div variants={fadeIn('down')} className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold font-heading uppercase text-foreground mb-4">Places</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">and Spaces</p>
            </motion.div>

            <motion.div variants={staggerContainer(0.1, 0.2)} className="flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-xl bg-secondary max-w-2xl mx-auto">
                <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Venue Type</label>
                    <Select value={typeFilter} onValueChange={value => {
          setTypeFilter(value);
          handleFilterChange('type', value);
        }}>
                        <SelectTrigger className="w-full bg-background border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            {venueTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Neighborhood</label>
                    <Select value={neighborhoodFilter} onValueChange={value => {
          setNeighborhoodFilter(value);
          handleFilterChange('neighborhood', value);
        }}>
                        <SelectTrigger className="w-full bg-background border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Neighborhoods</SelectItem>
                            {venueNeighborhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <motion.div variants={staggerContainer(0.1, 0.3)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {loading ? <p className="col-span-full text-center">Loading venues...</p> : filteredVenues.length > 0 ? filteredVenues.map((venue, index) => <VenueCard key={venue.id} venue={venue} index={index} />) : <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="col-span-full text-center py-16">
                            <p className="text-xl text-muted-foreground">No venues found. Be the first to add one!</p>
                        </motion.div>}
                </AnimatePresence>
            </motion.div>
        </motion.div>;
};
export default VenuesPage;