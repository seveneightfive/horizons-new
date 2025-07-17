-- Function to update fan count in artists table
CREATE OR REPLACE FUNCTION update_artist_fan_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT (new follow)
  IF TG_OP = 'INSERT' THEN
    UPDATE artists 
    SET fans = fans + 1 
    WHERE id = NEW.artist_id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE (unfollow)
  IF TG_OP = 'DELETE' THEN
    UPDATE artists 
    SET fans = fans - 1 
    WHERE id = OLD.artist_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
CREATE OR REPLACE TRIGGER trigger_update_fan_count_insert
  AFTER INSERT ON user_followed_artists
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_fan_count();

-- Create trigger for DELETE operations  
CREATE OR REPLACE TRIGGER trigger_update_fan_count_delete
  AFTER DELETE ON user_followed_artists
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_fan_count();

-- Initialize fan counts based on existing data (run this once)
UPDATE artists 
SET fans = (
  SELECT COUNT(*) 
  FROM user_followed_artists 
  WHERE user_followed_artists.artist_id = artists.id
);
