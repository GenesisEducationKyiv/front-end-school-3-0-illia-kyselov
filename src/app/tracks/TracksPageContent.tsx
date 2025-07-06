'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { addArtists } from '@/store/slices/artistsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useFilterParams } from '@/hooks/useFilterParams';
import { Track } from '@/types/Track';

export default function TracksPageContent() {
    const dispatch = useAppDispatch();

    const {
        search, setSearch,
        genre, setGenre,
        artist, setArtist,
        sort, setSort,
        page, setPage,
    } = useFilterParams({ genre: '', artist: '', search: '', sort: '', page: 1 });

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState<Track | undefined>();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
    const [deleteSingle] = useDeleteTrackMutation();
    const [deleteBulk] = useDeleteTracksMutation();
    const artistsList = useAppSelector(s => s.artists.list);
    const debouncedSearch = useDebounce(search, 400);
    const { data: genresList = [] } = useGetGenresQuery();
    const { data, isLoading, isError } = useGetTracksQuery({
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

    const toggleSelect = useCallback((id: string, on: boolean) => {
        setSelectedIds(curr => on ? [...curr, id] : curr.filter(x => x !== id));
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedIds(curr =>
            curr.length === tracks.length ? [] : tracks.map(t => t.id)
        );
    }, [tracks]);

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
        } catch {
            toast.error('Failed to delete');
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
                    ) : isError || tracks.length === 0 ? (
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
                                <Pagination page={page} total={totalPages} onPage={setPage} />
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
