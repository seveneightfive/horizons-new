-- Create the junction table for artist-event many-to-many relationship
CREATE TABLE artist_events (
  artist_id BIGINT REFERENCES artists(id) ON DELETE CASCADE,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (artist_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE artist_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public artist_events are viewable by everyone." 
ON artist_events FOR SELECT USING (true);

-- Migrate existing data from the artist_ids array in events table
INSERT INTO artist_events (artist_id, event_id)
SELECT 
  unnest(artist_ids) as artist_id,
  id as event_id
FROM events 
WHERE artist_ids IS NOT NULL AND array_length(artist_ids, 1) > 0;

-- Create indexes for better performance
CREATE INDEX idx_artist_events_artist_id ON artist_events(artist_id);
CREATE INDEX idx_artist_events_event_id ON artist_events(event_id);
