import { useState, useEffect, useCallback } from 'react';

export const useArtistDirectoryData = () => {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("Supabase is disconnected.");

  useEffect(() => {
    console.warn("Supabase is disconnected. Artist directory data is unavailable.");
  }, []);

  const getEventsByArtistId = useCallback((artistsId) => {
    return [];
  }, []);

  return { artists, loading, error, getEventsByArtistId };
};