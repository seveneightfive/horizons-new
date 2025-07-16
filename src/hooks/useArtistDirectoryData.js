
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useArtistDirectoryData = () => {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [artistsRes, eventsRes] = await Promise.all([
            supabase.from('Artists').select('*'),
            supabase.from('events').select('id, artist_ids')
        ]);

        if (artistsRes.error) throw artistsRes.error;
        if (eventsRes.error) throw eventsRes.error;

        setArtists(artistsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching artist directory data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventsByArtistId = useCallback((artistId) => {
    if (!events || !artistId) return [];
    return events.filter(event => event.artist_ids === artistId);
  }, [events]);

  return { artists, loading, error, getEventsByArtistId };
};
