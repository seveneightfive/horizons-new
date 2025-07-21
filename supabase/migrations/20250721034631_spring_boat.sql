/*
  # Fix get_random_artists RPC function

  1. Function Definition
    - Creates or replaces the `get_random_artists` function
    - Returns proper table structure matching the artists schema
    - Includes fans column and other required fields
    - Aggregates events data as JSONB

  2. Return Structure
    - Matches the expected API response format
    - Includes all artist fields from the database schema
    - Provides events as aggregated JSONB array
    - Orders results randomly with specified limit

  3. Event Aggregation
    - Joins with events through artist_id foreign key
    - Filters for upcoming events only
    - Returns essential event information
*/

CREATE OR REPLACE FUNCTION get_random_artists(limit_count INT)
RETURNS TABLE (
    id BIGINT,
    created_at TIMESTAMPTZ,
    name TEXT,
    slug TEXT,
    type TEXT,
    genre TEXT[],
    medium TEXT,
    hero_image TEXT,
    about TEXT,
    featured_audio JSONB,
    is_for_hire BOOLEAN,
    manager_id UUID,
    view_count INTEGER,
    video_title TEXT,
    video_link TEXT,
    fans INTEGER,
    events JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.created_at,
        a.name,
        a.slug,
        a.type,
        a.genre,
        a.medium,
        a.hero_image,
        a.about,
        a.featured_audio,
        a.is_for_hire,
        a.manager_id,
        a.view_count,
        a.video_title,
        a.video_link,
        a.fans,
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
                        'end_time', e.end_time,
                        'type', e.type,
                        'hero_image', e.hero_image,
                        'description', e.description,
                        'tags', e.tags
                    )
                    ORDER BY e.start_date ASC
                )
                FROM events e
                WHERE e.artist_id = a.id
                AND (e.start_date IS NULL OR e.start_date >= CURRENT_DATE)
            ),
            '[]'::jsonb
        ) AS events
    FROM
        artists a
    ORDER BY
        random()
    LIMIT limit_count;
END;
$$;