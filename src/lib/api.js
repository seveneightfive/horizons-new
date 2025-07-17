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
  const { data, error } = await supabase
    .rpc("get_artist_details", { p_slug: slug })
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message);
  }

  if (data) {
    // The function already returns JSON, so no need to parse
    data.events = data.events || [];
    data.reviews = data.reviews || [];
    data.contact = data.contact || {};
    data.gallery = data.gallery || [];
    data.youtubeLinks = data.youtube_links || [];
  }

  return data;
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
