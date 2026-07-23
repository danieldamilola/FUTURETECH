"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPodcastShow(input: {
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImageUrl?: string;
}): Promise<{ success: boolean; data?: { id: string; slug: string }; error?: string }> {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const { data, error } = await supabase
    .from("podcast_shows")
    .insert({
      author_id: user.id,
      title: input.title,
      slug: input.slug,
      description: input.description,
      category: input.category,
      cover_image_url: input.coverImageUrl ?? null,
      is_published: true,
    })
    .select("id, slug")
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/podcasts");
  return { success: true, data };
}

export async function createPodcastEpisode(input: {
  showId: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  durationSeconds: number;
  episodeNumber?: number;
  showNotesHtml?: string;
  coverImageUrl?: string;
}): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const { data, error } = await supabase
    .from("podcasts")
    .insert({
      author_id: user.id,
      show_id: input.showId,
      title: input.title,
      slug: input.slug,
      description: input.description,
      audio_url: input.audioUrl,
      duration_seconds: input.durationSeconds,
      episode_number: input.episodeNumber ?? null,
      show_notes_html: input.showNotesHtml ?? null,
      cover_image_url: input.coverImageUrl ?? null,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/podcasts");
  return { success: true, data };
}
