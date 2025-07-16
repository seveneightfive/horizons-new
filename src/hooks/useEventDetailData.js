import { useState, useEffect } from 'react';
import { getEventBySlug } from '@/lib/api';

export const useEventDetailData = (slug) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchEvent = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEventBySlug(slug);
                setEvent(data);
            } catch (err) {
                console.error(`Error fetching event ${slug}:`, err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

    return { event, loading, error };
};