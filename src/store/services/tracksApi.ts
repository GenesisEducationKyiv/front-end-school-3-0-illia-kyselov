import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ok, err, Result } from 'neverthrow';
import { parseErrorMessage } from '@/utils/neverthrow.helpers';
import type { Track } from '../../../backend/src/types';
import { TrackFormData } from '@/types/track.schema';

export interface PaginatedTracks {
    data: Track[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
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
                page?: number;
                limit?: number;
                search?: string;
                genre?: string;
                artist?: string;
                sort?: string;
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
                const [field, order = 'asc'] = sort.split(':');

                const params = {
                    page,
                    limit,
                    ...(search.trim() && { search: search.trim() }),
                    ...(genre && { genre }),
                    ...(artist && { artist }),
                    ...(sort && { sort: field, order }),
                };

                return { url: '/api/tracks', params };
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

        createTrack: builder.mutation<Result<Track, string>, TrackFormData>({
            async queryFn(newTrack, _queryApi, _extraOptions, baseQuery) {
                try {
                    const response = await baseQuery({
                        url: '/api/tracks',
                        method: 'POST',
                        body: newTrack,
                    });
                    if (response.error) {
                        return { data: err(parseErrorMessage(response.error)) };
                    }
                    return { data: ok(response.data as Track) };
                } catch (error) {
                    return { data: err(parseErrorMessage(error)) };
                }
            },
            invalidatesTags: [{ type: 'Tracks', id: 'LIST' }],
        }),

        updateTrack: builder.mutation<Result<Track, string>, { id: string } & TrackFormData>({
            async queryFn({ id, ...patch }, _queryApi, _extraOptions, baseQuery) {
                try {
                    const response = await baseQuery({
                        url: `/api/tracks/${id}`,
                        method: 'PUT',
                        body: patch,
                    });
                    if (response.error) {
                        return { data: err(parseErrorMessage(response.error)) };
                    }
                    return { data: ok(response.data as Track) };
                } catch (error) {
                    return { data: err(parseErrorMessage(error)) };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tracks', id },
                { type: 'Tracks', id: 'LIST' },
            ],
        }),

        uploadTrack: builder.mutation<Result<Track, string>, { id: string; formData: FormData }>({
            async queryFn({ id, formData }, _queryApi, _extraOptions, baseQuery) {
                try {
                    const response = await baseQuery({
                        url: `/api/tracks/${id}/upload`,
                        method: 'POST',
                        body: formData,
                    });
                    if (response.error) {
                        return { data: err(parseErrorMessage(response.error)) };
                    }
                    return { data: ok(response.data as Track) };
                } catch (error) {
                    return { data: err(parseErrorMessage(error)) };
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tracks', id },
                { type: 'Tracks', id: 'LIST' },
            ],
        }),

        deleteTrackFile: builder.mutation<Result<Track, string>, string>({
            async queryFn(id, _queryApi, _extraOptions, baseQuery) {
                try {
                    const response = await baseQuery({
                        url: `/api/tracks/${id}/file`,
                        method: 'DELETE',
                    });
                    if (response.error) {
                        return { data: err(parseErrorMessage(response.error)) };
                    }
                    return { data: ok(response.data as Track) };
                } catch (error) {
                    return { data: err(parseErrorMessage(error)) };
                }
            },
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
});

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
} = tracksApi;
