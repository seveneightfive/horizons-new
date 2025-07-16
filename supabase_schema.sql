-- Create artists table
CREATE TABLE artists (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    genre TEXT,
    fans INT,
    hero_image TEXT,
    profile_image TEXT,
    bio TEXT,
    contact JSONB,
    socials JSONB,
    gallery TEXT[],
    youtube_links JSONB[],
    featured_song TEXT,
    slug TEXT UNIQUE NOT NULL
);

-- Create events table
CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    hero_image TEXT,
    description TEXT,
    type TEXT,
    tags TEXT[],
    start_date DATE,
    start_time TIME,
    end_date DATE,
    end_time TIME,
    venue JSONB,
    cost TEXT,
    artist_ids BIGINT[],
    slug TEXT UNIQUE NOT NULL
);

-- Create reviews table
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY,
    artist_id BIGINT REFERENCES artists(id),
    author TEXT,
    rating INT,
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Public artists are viewable by everyone." ON artists FOR SELECT USING (true);
CREATE POLICY "Public events are viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone." ON reviews FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can create reviews." ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own reviews." ON reviews FOR UPDATE USING (auth.uid() = user_id);
-- Note: You would need a user_id column in the reviews table linked to auth.users(id) for the UPDATE policy to work.

-- Insert sample data for artists
INSERT INTO artists (id, name, type, genre, fans, hero_image, profile_image, bio, contact, socials, gallery, youtube_links, featured_song, slug) VALUES
(1, 'Luna Rodriguez', 'Band', 'Indie Pop', 125345, 'Dramatic portrait of a female singer on a dark stage', 'Female indie pop singer with guitar', 'Luna Rodriguez is a singer-songwriter from Brooklyn, NY...', '{"email": "booking@lunarodriguez.com", "phone": "555-123-4567"}', '{"twitter": "#", "instagram": "#", "youtube": "#"}', '{}', '[{"title": "Official Music Video: \"City Lights\"", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}]', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'luna-rodriguez'),
(2, 'The Midnight Collective', 'Band', 'Electronic', 89876, 'Electronic music duo surrounded by synthesizers', 'Electronic music duo with synthesizers', 'The Midnight Collective is an electronic duo...', '{"email": "contact@midnightcollective.band"}', '{"twitter": "#", "instagram": "#"}', '{}', '[{"title": "Official Audio: \"Neon Dreams\"", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}]', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'the-midnight-collective'),
(3, 'Anya Petrova', 'Visual', NULL, 72109, 'Artist in a bright, paint-splattered studio', 'Visual artist holding a paintbrush', 'Anya Petrova is a contemporary visual artist...', '{"email": "anya.petrova@art.com"}', '{"instagram": "#", "pinterest": "#"}', '{"Abstract painting", "Close-up of a textured art piece"}', '{}', NULL, 'anya-petrova'),
(4, 'Kaelen Smith', 'Literature', NULL, 45032, 'Author sitting at a vintage typewriter', 'Author Kaelen Smith thoughtful expression', 'Kaelen Smith is an award-winning novelist...', '{"email": "agent@kaelensmith.com"}', '{"twitter": "#"}', '{}', '{}', NULL, 'kaelen-smith'),
(5, 'Cirque de la Rêve', 'Performance', NULL, 150921, 'Acrobats performing under circus lights', 'Group of performance artists in costumes', 'Cirque de la Rêve is a world-renowned performance troupe...', '{"email": "tickets@cirquereve.com"}', '{"instagram": "#", "youtube": "#"}', '{"An acrobat on silk ribbons", "A fire dancer"}', '[{"title": "Show \"Fantasia\" Trailer", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}]', NULL, 'cirque-de-la-rêve'),
(6, 'Crimson Tide', 'Band', 'Rock', 110456, 'Rock band on stage with red lights', 'Rock band with electric guitars', 'Crimson Tide delivers high-octane rock anthems...', '{"email": "crimsontide@rock.com"}', '{"twitter": "#", "instagram": "#"}', '{}', '{}', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'crimson-tide');

-- Insert sample data for events
INSERT INTO events (id, title, hero_image, description, type, tags, start_date, start_time, end_date, end_time, venue, cost, artist_ids, slug) VALUES
(1, 'Luna Rodriguez: Live in Central Park', 'Vibrant music festival stage at dusk', 'Join Luna Rodriguez for a magical evening...', 'Live Music', '{"All Ages", "Outdoor"}', '2025-07-15', '18:00', '2025-07-15', '22:00', '{"name": "Central Park Bandshell", "location": "New York, NY"}', 'Free', '{1}', 'luna-rodriguez-live-in-central-park'),
(2, 'Urban Flora Gallery Opening', 'Modern art gallery with minimalist decor', 'Experience the powerful new collection...', 'Art', '{"Cultural", "Opening"}', '2025-07-20', '19:30', '2025-07-20', '22:00', '{"name": "Modern Art Museum", "location": "Chicago, IL"}', '25', '{3}', 'urban-flora-gallery-opening'),
(3, 'Fantasia by Cirque de la Rêve', 'Grand theater stage with dramatic lighting', 'Prepare to be amazed by ''Fantasia''...', 'Entertainment', '{"Annual", "All Ages"}', '2025-08-01', '20:00', '2025-08-10', '22:30', '{"name": "Grand Theater", "location": "Las Vegas, NV"}', '75', '{5}', 'fantasia-by-cirque-de-la-rêve'),
(4, 'Downtown Food Truck Festival', 'Bustling street fair with food trucks', 'Taste the best of the city''s culinary scene...', 'Local Flavor', '{"All Ages", "Free Entry"}', '2025-08-15', '12:00', '2025-08-15', '20:00', '{"name": "Waterfront Park", "location": "San Diego, CA"}', 'Free', '{2, 6}', 'downtown-food-truck-festival'),
(5, 'Mindfulness & Yoga Retreat', 'People doing yoga on a serene beach', 'Reconnect with yourself at our weekend retreat...', 'Lifestyle', '{"Wellness", "Retreat"}', '2025-09-05', '16:00', '2025-09-07', '14:00', '{"name": "Serenity Beach Resort", "location": "Malibu, CA"}', '450', '{}', 'mindfulness-yoga-retreat');

-- Insert sample data for reviews
INSERT INTO reviews (id, artist_id, author, rating, review) VALUES
(1, 1, 'Music Critic Weekly', 5, 'Luna''s performance was nothing short of magical...'),
(2, 3, 'ArtForum', 4, 'Petrova''s ''Urban Flora'' is a powerful and provocative collection...'),
(3, 1, 'A Fan', 5, 'Best concert I have ever been to!...');