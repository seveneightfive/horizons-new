/*
  # Create get_random_artists RPC function

  1. New Functions
    - `get_random_artists(limit_count integer)` - Returns random artists with their fan counts and basic info
  
  2. Purpose
    - Provides the missing RPC function that the frontend API is calling
    - Returns artists in random order with specified limit
    - Includes fans column and other essential artist data
*/

CREATE OR REPLACE FUNCTION get_random_artists(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id bigint,
  name text,
  slug text,
  type text,
  genre text[],
  fans integer,
  hero_image text,
  about text,
  events jsonb
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.slug,
    a.type,
    a.genre,
    a.fans,
    a.hero_image,
    a.about,
    '[]'::jsonb as events
  FROM artists a
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$;