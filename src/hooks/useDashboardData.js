import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useDashboardData = () => {
    const { user } = useAuth();
    const [favoritedEvents, setFavoritedEvents] = useState([]);
    const [followedArtists, setFollowedArtists] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch followed artists with details
            const { data: followedArtistsData, error: followedArtistsError } = await supabase
                .from('user_followed_artists')
                .select('artists (*)')
                .eq('user_id', user.id);

            if (followedArtistsError) throw followedArtistsError;
            
            const artists = followedArtistsData.map(fa => fa.artists).filter(Boolean);
            setFollowedArtists(artists);

            // Fetch favorited events with details
            const { data: favoritedEventsData, error: favoritedEventsError } = await supabase
                .from('user_favorited_events')
                .select('events (*, artists(name, slug))')
                .eq('user_id', user.id);

            if (favoritedEventsError) throw favoritedEventsError;
            const events = favoritedEventsData.map(fe => fe.events).filter(Boolean);
            setFavoritedEvents(events);

            // Fetch user's reviews
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*, artists (name, slug, type, profile_image)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (reviewsError) throw reviewsError;
            setMyReviews(reviewsData || []);

        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { favoritedEvents, followedArtists, myReviews, loading, error, refresh: fetchData };
};