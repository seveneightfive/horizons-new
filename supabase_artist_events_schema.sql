-- Option 1: Create a proper junction table for many-to-many relationship
-- This is the recommended approach for better performance and cleaner queries

CREATE TABLE artist_events (
  artist_id BIGINT REFERENCES artists(id) ON DELETE CASCADE,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (artist_id, event_id)
);

-- Enable RLS on the junction table
ALTER TABLE artist_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public artist_events are viewable by everyone." ON artist_events FOR SELECT USING (true);

-- Migrate existing data from artist_ids array to junction table
-- Run this after creating the table above
INSERT INTO artist_events (artist_id, event_id)
SELECT 
  unnest(artist_ids) as artist_id,
  id as event_id
FROM events 
WHERE artist_ids IS NOT NULL AND array_length(artist_ids, 1) > 0;

-- Option 2: If you prefer to keep the current array structure,
-- you can create an index to improve query performance
CREATE INDEX idx_events_artist_ids ON events USING GIN (artist_ids);

-- Option 3: Add a computed column for easier querying (PostgreSQL function)
CREATE OR REPLACE FUNCTION get_artist_events(artist_id_param BIGINT)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  slug TEXT,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  venue JSONB,
  cost TEXT,
  hero_image TEXT,
  description TEXT,
  type TEXT,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.slug,
    e.start_date,
    e.end_date,
    e.start_time,
    e.end_time,
    e.venue,
    e.cost,
    e.hero_image,
    e.description,
    e.type,
    e.tags
  FROM events e
  WHERE artist_id_param = ANY(e.artist_ids)
    AND e.start_date >= CURRENT_DATE
  ORDER BY e.start_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT * FROM get_artist_events(1);
