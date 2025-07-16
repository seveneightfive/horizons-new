import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useFollow = (artistId, onFollowToggle) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkFollowStatus = useCallback(async () => {
    if (!user || !artistId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_followed_artists')
        .select('artist_id')
        .eq('user_id', user.id)
        .eq('artist_id', artistId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, artistId]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const toggleFollow = async () => {
    if (!user || !artistId) return;

    setLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('user_followed_artists')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_id', artistId);
        if (error) throw error;
        setIsFollowing(false);
        toast({ title: "Unfollowed artist." });
        if (onFollowToggle) onFollowToggle(false);
      } else {
        const { error } = await supabase
          .from('user_followed_artists')
          .insert({ user_id: user.id, artist_id: artistId });
        if (error) throw error;
        setIsFollowing(true);
        toast({ title: "Successfully followed artist!" });
        if (onFollowToggle) onFollowToggle(true);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message,
      });
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, toggleFollow, loading };
};