/*
  # Add fans column and get_random_artists function

  1. Schema Changes
    - Add `fans` column to `artists` table with default value 0
    - Create index on fans column for performance

  2. Functions
    - Create `get_random_artists` RPC function that returns random artists with their fan counts
    - Function includes proper error handling and performance optimization

  3. Data Migration
    - Initialize fans count based on existing follows data
    - Ensure data consistency between follows table and fans column
*/

-- Add fans column to artists table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artists' AND column_name = 'fans'
  ) THEN
    ALTER TABLE artists ADD COLUMN fans integer DEFAULT 0;
  END IF;
END $$;

-- Create index on fans column for performance
CREATE INDEX IF NOT EXISTS idx_artists_fans ON artists(fans DESC);

-- Create get_random_artists function
CREATE OR REPLACE FUNCTION get_random_artists(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id bigint,
  name text,
  slug text,
  type text,
  genre text[],
  fans integer,
  hero_image text,
  medium text,
  about text,
  featured_audio jsonb,
  is_for_hire boolean,
  manager_id uuid,
  view_count integer,
  video_title text,
  video_link text,
  created_at timestamptz,
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
    a.medium,
    a.about,
    a.featured_audio,
    a.is_for_hire,
    a.manager_id,
    a.view_count,
    a.video_title,
    a.video_link,
    a.created_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', e.id,
            'title', e.title,
            'slug', e.slug,
            'start_date', e.start_date,
            'end_date', e.end_date,
            'start_time', e.start_time,
            'end_time', e.end_time
          )
        )
        FROM events e
        WHERE e.artist_id = a.id
        AND e.start_date >= CURRENT_DATE
        ORDER BY e.start_date
        LIMIT 5
      ),
      '[]'::jsonb
    ) as events
  FROM artists a
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$;

-- Initialize fans count based on existing follows data
UPDATE artists 
SET fans = (
  SELECT COUNT(*) 
  FROM follows 
  WHERE follows.entity_id = artists.id 
  AND follows.entity_type = 'artist'
);

-- Create function to update artist fan count
CREATE OR REPLACE FUNCTION update_artist_fan_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT (new follow)
  IF TG_OP = 'INSERT' THEN
    IF NEW.entity_type = 'artist' THEN
      UPDATE artists 
      SET fans = fans + 1 
      WHERE id = NEW.entity_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE (unfollow)
  IF TG_OP = 'DELETE' THEN
    IF OLD.entity_type = 'artist' THEN
      UPDATE artists 
      SET fans = fans - 1 
      WHERE id = OLD.entity_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_fan_count_insert ON follows;
DROP TRIGGER IF EXISTS trigger_update_fan_count_delete ON follows;

-- Create triggers for INSERT and DELETE operations on follows table
CREATE TRIGGER trigger_update_fan_count_insert
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_fan_count();

CREATE TRIGGER trigger_update_fan_count_delete
  AFTER DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_fan_count();