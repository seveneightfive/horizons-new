import { useState, useEffect } from 'react';
import { getEvents } from '@/lib/api';

export const useEventDirectoryData = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventData = await getEvents();
                setEvents(eventData);
            } catch (err) {
                console.error("Error fetching event directory data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error };
};