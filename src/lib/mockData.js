// Mock data for testing without Supabase
export const mockArtists = [
  {
    id: 1,
    created_at: '2024-01-15T10:00:00Z',
    name: 'Luna Eclipse',
    slug: 'luna-eclipse',
    type: 'Solo Artist',
    genre: ['Electronic', 'Ambient'],
    medium: 'Digital',
    hero_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    about: 'Luna Eclipse creates ethereal electronic soundscapes that transport listeners to otherworldly realms.',
    featured_audio: {
      title: 'Midnight Reverie',
      url: 'https://example.com/audio/midnight-reverie.mp3',
      duration: 240
    },
    is_for_hire: true,
    manager_id: null,
    view_count: 1250,
    video_title: 'Live at Cosmic Festival',
    video_link: 'https://youtube.com/watch?v=example1',
    fans: 3420,
    events: [
      {
        id: 1,
        title: 'Cosmic Convergence',
        slug: 'cosmic-convergence',
        start_date: '2024-03-15',
        end_date: '2024-03-15',
        start_time: '20:00',
        end_time: '23:00',
        type: 'Concert',
        hero_image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        description: 'An immersive electronic music experience',
        tags: ['electronic', 'ambient', 'live']
      }
    ]
  },
  {
    id: 2,
    created_at: '2024-01-20T14:30:00Z',
    name: 'The Velvet Strings',
    slug: 'the-velvet-strings',
    type: 'Band',
    genre: ['Jazz', 'Soul'],
    medium: 'Acoustic',
    hero_image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    about: 'A soulful jazz ensemble bringing classic sounds to modern audiences.',
    featured_audio: {
      title: 'Smooth Operator',
      url: 'https://example.com/audio/smooth-operator.mp3',
      duration: 320
    },
    is_for_hire: true,
    manager_id: null,
    view_count: 890,
    video_title: 'Jazz Club Sessions',
    video_link: 'https://youtube.com/watch?v=example2',
    fans: 2150,
    events: []
  },
  {
    id: 3,
    created_at: '2024-02-01T09:15:00Z',
    name: 'Neon Pulse',
    slug: 'neon-pulse',
    type: 'DJ',
    genre: ['House', 'Techno'],
    medium: 'Digital',
    hero_image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    about: 'High-energy DJ sets that keep the dance floor moving all night long.',
    featured_audio: {
      title: 'Electric Dreams',
      url: 'https://example.com/audio/electric-dreams.mp3',
      duration: 180
    },
    is_for_hire: true,
    manager_id: null,
    view_count: 2100,
    video_title: 'Underground Club Mix',
    video_link: 'https://youtube.com/watch?v=example3',
    fans: 5680,
    events: [
      {
        id: 2,
        title: 'Neon Nights',
        slug: 'neon-nights',
        start_date: '2024-04-20',
        end_date: '2024-04-20',
        start_time: '22:00',
        end_time: '04:00',
        type: 'Club Night',
        hero_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
        description: 'Underground techno experience',
        tags: ['techno', 'house', 'club']
      }
    ]
  }
];

export const mockEvents = [
  {
    id: 1,
    created_at: '2024-01-10T12:00:00Z',
    title: 'Cosmic Convergence',
    slug: 'cosmic-convergence',
    start_date: '2024-03-15',
    end_date: '2024-03-15',
    start_time: '20:00',
    end_time: '23:00',
    type: 'Concert',
    hero_image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    description: 'An immersive electronic music experience featuring Luna Eclipse and special guests.',
    tags: ['electronic', 'ambient', 'live'],
    artist_id: 1,
    venue_id: 1,
    venues: {
      venuename: 'The Crystal Dome'
    }
  },
  {
    id: 2,
    created_at: '2024-01-12T16:30:00Z',
    title: 'Neon Nights',
    slug: 'neon-nights',
    start_date: '2024-04-20',
    end_date: '2024-04-20',
    start_time: '22:00',
    end_time: '04:00',
    type: 'Club Night',
    hero_image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    description: 'Underground techno experience with Neon Pulse.',
    tags: ['techno', 'house', 'club'],
    artist_id: 3,
    venue_id: 2,
    venues: {
      venuename: 'Underground Club'
    }
  },
  {
    id: 3,
    created_at: '2024-02-05T11:00:00Z',
    title: 'Jazz & Soul Evening',
    slug: 'jazz-soul-evening',
    start_date: '2024-05-10',
    end_date: '2024-05-10',
    start_time: '19:30',
    end_time: '22:30',
    type: 'Concert',
    hero_image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    description: 'An intimate evening with The Velvet Strings.',
    tags: ['jazz', 'soul', 'intimate'],
    artist_id: 2,
    venue_id: 3,
    venues: {
      venuename: 'Blue Note Lounge'
    }
  }
];

export const mockVenues = [
  {
    id: 1,
    venuename: 'The Crystal Dome',
    slug: 'crystal-dome',
    address: '123 Music Ave, Downtown',
    capacity: 500,
    type: 'Concert Hall'
  },
  {
    id: 2,
    venuename: 'Underground Club',
    slug: 'underground-club',
    address: '456 Bass St, Warehouse District',
    capacity: 200,
    type: 'Club'
  },
  {
    id: 3,
    venuename: 'Blue Note Lounge',
    slug: 'blue-note-lounge',
    address: '789 Jazz Blvd, Arts Quarter',
    capacity: 150,
    type: 'Lounge'
  }
];

export const mockReviews = [
  {
    id: 1,
    created_at: '2024-02-10T15:30:00Z',
    artist_id: 1,
    user_id: 'user1',
    rating: 5,
    review_text: 'Absolutely mesmerizing performance! Luna Eclipse created an otherworldly atmosphere.',
    user_profiles: {
      username: 'MusicLover42',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  },
  {
    id: 2,
    created_at: '2024-02-12T20:15:00Z',
    artist_id: 2,
    user_id: 'user2',
    rating: 4,
    review_text: 'The Velvet Strings brought such soulful energy to the venue. Loved every minute!',
    user_profiles: {
      username: 'JazzEnthusiast',
      avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
    }
  }
];

export const mockUserProfile = {
  id: 'user1',
  username: 'TestUser',
  email: 'test@example.com',
  avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  created_at: '2024-01-01T00:00:00Z'
};

export const mockFollows = [
  {
    id: 1,
    user_id: 'user1',
    artist_id: 1,
    created_at: '2024-02-01T10:00:00Z'
  }
];

export const mockFavoriteEvents = [
  {
    id: 1,
    user_id: 'user1',
    event_id: 1,
    created_at: '2024-02-05T14:00:00Z'
  }
];