import { z } from "zod";

export const trackSchema = z.object({
    title: z
        .string()
        .min(1, "Track title is required")
        .max(100, "Track title must be at most 100 characters"),
    artist: z
        .string()
        .min(1, "Artist name is required")
        .max(100, "Artist name must be at most 100 characters"),
    album: z
        .string()
        .min(1, "Album name is required")
        .max(100, "Album name must be at most 100 characters"),
    coverImage: z
        .instanceof(File)
        .optional()
        .or(z.string().url().optional()),
    genres: z
        .array(z.string())
        .min(1, "Pick at least one genre"),
});

export type TrackFormData = z.infer<typeof trackSchema>;
