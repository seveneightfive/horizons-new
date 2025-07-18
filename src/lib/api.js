import { supabase } from "@/lib/customSupabaseClient";

const parseEventTags = (event) => {
  let parsedTags = [];
  if (typeof event.tags === "string") {
    try {
      // First try to parse as JSON
      const tags = JSON.parse(event.tags);
      if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (e) {
      // If JSON parsing fails, treat as comma-separated string
      if (event.tags.trim()) {
        parsedTags = event.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }
    }
  } else if (Array.isArray(event.tags)) {
    parsedTags = event.tags;
  }
  return { ...event, tags: parsedTags };
};

export const getHomePageData = async () => {
  const { data: featuredEvents, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .eq("star", true)
    .order("start_date", { ascending: true })
    .limit(10);
  if (eventsError) throw new Error(eventsError.message);

  const { data: randomArtists, error: artistsError } = await supabase.rpc(
    "get_random_artists",
    { limit_count: 10 },
  );
  if (artistsError) throw new Error(artistsError.message);

  const { data: latestReviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*, artists(name, slug, profile_image)")
    .order("created_at", { ascending: false })
    .limit(3);
  if (reviewsError) throw new Error(reviewsError.message);

  return {
    featuredEvents: featuredEvents.map(parseEventTags),
    randomArtists: (randomArtists || []).map((artist) => ({
      ...artist,
      events: artist.events || [],
    })),
    latestReviews,
  };
};

export const getArtists = async () => {
  const { data, error } = await supabase
    .from("artists")
    .select("*, events(*)")
    .order("name");
  if (error) throw new Error(error.message);
  if (!data) return [];
  return data.map((artist) => ({
    ...artist,
    events: artist.events || [],
  }));
};

export const getArtistBySlug = async (slug) => {
  // Get the artist
  const { data: artist, error: artistError } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();

  if (artistError) {
    if (artistError.code === "PGRST116") return null; // Not found
    throw new Error(artistError.message);
  }

  if (artist) {
    // Get events through junction table
    try {
      const { data: events, error: eventsError } = await supabase
        .from("artist_events")
        .select(
          `
          events (
            id, title, slug, start_date, end_date, start_time, end_time,
            venue, cost, hero_image, description, type, tags
          )
        `,
        )
        .eq("artist_id", artist.id);

      if (eventsError) {
        console.warn("Error fetching artist events:", eventsError);
        artist.events = [];
      } else {
        // Extract events from junction table results and filter for upcoming
        const now = new Date();
        const allEvents = (events || []).map((ae) => ae.events).filter(Boolean);
        const upcomingEvents = allEvents.filter((event) => {
          if (!event.start_date) return false;
          const eventDate = new Date(event.start_date);
          return eventDate >= now;
        });

        artist.events = upcomingEvents;
      }
    } catch (error) {
      console.warn("Error fetching artist events:", error);
      artist.events = [];
    }

    artist.contact = artist.contact || {};
    artist.gallery = artist.gallery || [];
    artist.youtube_links = artist.youtube_links || [];
  }

  return artist;
};

export const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date");
  if (error) throw new Error(error.message);

  if (!data) return [];

  return data.map(parseEventTags);
};

export const getEventBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("events")
    .select("*, artists(*)")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  return parseEventTags(data);
};

export const addReview = async (reviewData) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert([reviewData])
    .select("*, artists(name, slug, profile_image)");
  if (error) throw new Error(error.message);
  return data;
};

export const followArtist = async (userId, artistId) => {
  const { data, error } = await supabase
    .from("user_followed_artists")
    .insert([{ user_id: userId, artist_id: artistId }])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const unfollowArtist = async (userId, artistId) => {
  const { data, error } = await supabase
    .from("user_followed_artists")
    .delete()
    .eq("user_id", userId)
    .eq("artist_id", artistId)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getArtistEvents = async (artistId) => {
  try {
    // Use junction table approach
    const { data: events, error: eventsError } = await supabase
      .from("artist_events")
      .select(
        `
        events (
          id, title, slug, start_date, end_date, start_time, end_time,
          venue, cost, hero_image, description, type, tags
        )
      `,
      )
      .eq("artist_id", artistId);

    if (eventsError) {
      console.warn("Junction table query failed:", eventsError);
      return [];
    }

    // Extract events from junction table results and filter for upcoming
    const now = new Date();
    const allEvents = (events || []).map((ae) => ae.events).filter(Boolean);
    const upcomingEvents = allEvents.filter((event) => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate >= now;
    });

    return upcomingEvents;
  } catch (error) {
    console.warn("Error fetching artist events:", error);
    return [];
  }
};

export const checkIfFollowing = async (userId, artistId) => {
  if (!userId || !artistId) return false;

  const { data, error } = await supabase
    .from("user_followed_artists")
    .select("user_id")
    .eq("user_id", userId)
    .eq("artist_id", artistId)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data && data.length > 0;
};
