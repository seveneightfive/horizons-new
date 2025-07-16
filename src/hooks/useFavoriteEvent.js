import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useFavoriteEvent = (eventId) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !eventId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorited_events')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, eventId]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!user || !eventId) return;

    setLoading(true);
    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorited_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);
        if (error) throw error;
        setIsFavorited(false);
        toast({ title: "Removed from favorites." });
      } else {
        const { error } = await supabase
          .from('user_favorited_events')
          .insert({ user_id: user.id, event_id: eventId });
        if (error) throw error;
        setIsFavorited(true);
        toast({ title: "Added to favorites!" });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message,
      });
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isFavorited, toggleFavorite, loading };
};