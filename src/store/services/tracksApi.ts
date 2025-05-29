import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Track } from '../../../backend/src/types'

export interface PaginatedTracks {
    data: Track[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export const tracksApi = createApi({
    reducerPath: 'tracksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
    }),
    tagTypes: ['Tracks', 'Genres'],
    endpoints: (builder) => ({
        getTracks: builder.query<
            PaginatedTracks,
            {
                page?: number
                limit?: number
                search?: string
                genre?: string
                artist?: string
                sort?: string
            }
        >({
            query: ({
                page = 1,
                limit = 10,
                search = '',
                genre = '',
                artist = '',
                sort = '',
            }) => {
                const params: Record<string, string | number> = { page, limit }
                if (search.trim()) params.search = search.trim()
                if (genre) params.genre = genre
                if (artist) params.artist = artist
                if (sort) {
                    const [field, order = 'asc'] = sort.split(':')
                    params.sort = field
                    params.order = order
                }
                return { url: '/api/tracks', params }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map((t) => ({ type: 'Tracks' as const, id: t.id })),
                        { type: 'Tracks', id: 'LIST' },
                    ]
                    : [{ type: 'Tracks', id: 'LIST' }],
        }),

        getGenres: builder.query<string[], void>({
            query: () => '/api/genres',
            providesTags: [{ type: 'Genres', id: 'LIST' }],
        }),

        createTrack: builder.mutation<
            Track,
            Partial<Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>
        >({
            query: (body) => ({
                url: '/api/tracks',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Tracks', id: 'LIST' }],
        }),

        updateTrack: builder.mutation<
            Track,
            { id: string } & Partial<Omit<Track, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>
        >({
            query: ({ id, ...patch }) => ({
                url: `/api/tracks/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tracks', id },
                { type: 'Tracks', id: 'LIST' },
            ],
        }),

        uploadTrack: builder.mutation<Track, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/api/tracks/${id}/upload`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tracks', id },
                { type: 'Tracks', id: 'LIST' },
            ],
        }),

        deleteTrackFile: builder.mutation<Track, string>({
            query: (id) => ({
                url: `/api/tracks/${id}/file`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Tracks', id },
                { type: 'Tracks', id: 'LIST' },
            ],
        }),

        deleteTrack: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/tracks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Tracks', id: 'LIST' }],
        }),

        deleteTracks: builder.mutation<{ success: string[]; failed: string[] }, string[]>({
            query: (ids) => ({
                url: '/api/tracks/delete',
                method: 'POST',
                body: { ids },
            }),
            invalidatesTags: [{ type: 'Tracks', id: 'LIST' }],
        }),

        getTrackBySlug: builder.query<Track, string>({
            query: (slug) => `/api/tracks/${slug}`,
            providesTags: (result) =>
                result ? [{ type: 'Tracks' as const, id: result.id }] : [],
        }),
    }),
})

export const {
    useGetTracksQuery,
    useGetGenresQuery,
    useCreateTrackMutation,
    useUpdateTrackMutation,
    useUploadTrackMutation,
    useDeleteTrackFileMutation,
    useDeleteTrackMutation,
    useDeleteTracksMutation,
    useGetTrackBySlugQuery,
} = tracksApi
