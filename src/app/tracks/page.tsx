'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import NeonPanel from '@/components/UI/NeonPanel';
import EmptyState from '@/components/EmptyState';
import TrackModal from '@/components/TrackModal';
import Pagination from '@/components/UI/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import {
    useGetGenresQuery,
    useGetTracksQuery,
    useDeleteTrackMutation,
    useDeleteTracksMutation,
} from '@/store/services/tracksApi';
import TracksHeader from '@/components/TracksHeader';
import TracksToolbar from '@/components/TracksToolbar';
import BulkActionsBar from '@/components/BulkActionsBar';
import TracksGrid from '@/components/TracksGrid';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Track } from '../../../backend/src/types';
import { addArtists } from '@/store/slices/artistsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { parseErrorMessage } from '@/utils/parseError';

export default function TracksPage() {
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [artist, setArtist] = useState('');
    const [sort, setSort] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState<Track | undefined>();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);

    const [deleteSingle] = useDeleteTrackMutation();
    const [deleteBulk] = useDeleteTracksMutation();

    const debouncedSearch = useDebounce(search, 400);
    const { data: genresList = [] } = useGetGenresQuery();
    const { data, isLoading, isError, error } = useGetTracksQuery({
        page,
        limit: 9,
        search: debouncedSearch,
        genre,
        artist,
        sort,
    });

    const tracks = useMemo(() => data?.data ?? [], [data]);
    const totalPages = data?.meta.totalPages ?? 1;

    useEffect(() => {
        if (tracks.length) {
            dispatch(addArtists(tracks.map((t) => t.artist)));
        }
    }, [tracks, dispatch]);

    const artistsList = useAppSelector((state) => state.artists.list);

    const toggleSelect = useCallback(
        (id: string, on: boolean) =>
            setSelectedIds(on ? [...selectedIds, id] : selectedIds.filter((x) => x !== id)),
        [selectedIds]
    );

    const handleSelectAll = useCallback(() => {
        setSelectedIds(
            selectedIds.length === tracks.length ? [] : tracks.map((t) => t.id)
        );
    }, [selectedIds, tracks]);

    const openConfirm = useCallback((ids: string[]) => {
        setPendingDeleteIds(ids);
        setConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        setConfirmOpen(false);
        try {
            if (pendingDeleteIds.length === 1) {
                await deleteSingle(pendingDeleteIds[0]).unwrap();
                toast.success(<span data-testid="toast-success">Track deleted</span>);
            } else {
                await deleteBulk(pendingDeleteIds).unwrap();
                toast.success(
                    <span data-testid="toast-success">
                        Deleted {pendingDeleteIds.length} tracks
                    </span>
                );
            }
        } catch (err: unknown) {
            const msg = parseErrorMessage(err, 'Failed to delete');
            toast.error(<span data-testid="toast-error">{msg}</span>);
        } finally {
            setSelectedIds([]);
            setPendingDeleteIds([]);
        }
    }, [deleteBulk, deleteSingle, pendingDeleteIds]);

    return (
        <>
            <div className="space-y-8 px-36 py-16">
                <NeonPanel>
                    <TracksHeader
                        onCreate={() => {
                            setEditingTrack(undefined);
                            setModalOpen(true);
                        }}
                    />

                    <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                        <TracksToolbar
                            search={search}
                            onSearch={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            genre={genre}
                            onGenre={(v) => {
                                setGenre(v);
                                setPage(1);
                            }}
                            artist={artist}
                            onArtist={(v) => {
                                setArtist(v);
                                setPage(1);
                            }}
                            sort={sort}
                            onSort={setSort}
                            genresList={genresList}
                            artistsList={artistsList}
                        />
                        <BulkActionsBar
                            total={tracks.length}
                            selectedCount={selectedIds.length}
                            onToggleAll={handleSelectAll}
                            onDeleteSelected={() => openConfirm(selectedIds)}
                        />
                    </div>

                    {isLoading ? (
                        <div data-testid="loading-indicator" data-loading="true">
                            <EmptyState
                                message="Loading…"
                                variant="spinner"
                                data-testid="loading-tracks"
                            />
                        </div>
                    ) : isError ? (
                        <EmptyState message={String(error)} />
                    ) : tracks.length === 0 ? (
                        <EmptyState message="Whoops… nothing here yet" />
                    ) : (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={page}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TracksGrid
                                        tracks={tracks}
                                        selectedIds={selectedIds}
                                        onEdit={(t) => {
                                            setEditingTrack(t);
                                            setModalOpen(true);
                                        }}
                                        onSelect={toggleSelect}
                                        onDelete={(t) => openConfirm([t.id])}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {totalPages > 1 && (
                                <Pagination
                                    page={page}
                                    total={totalPages}
                                    onPage={setPage}
                                />
                            )}
                        </>
                    )}
                </NeonPanel>
            </div>

            <TrackModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                track={editingTrack}
            />

            <ConfirmDialog
                open={confirmOpen}
                count={pendingDeleteIds.length}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
