'use client';

import React, { useState } from 'react';
import TrackForm from './TrackForm';
import Modal from './Modal';
import { useCreateTrackMutation, useUpdateTrackMutation } from '@/store/services/tracksApi';
import { Track } from '../../backend/src/types';
import { TrackFormData } from '@/types/track.schema';
import { toast } from 'react-hot-toast';

interface Props {
    open: boolean;
    onClose(): void;
    track?: Track;
}

export default function TrackModal({ open, onClose, track }: Props) {
    const [createTrack, { isLoading: creating }] = useCreateTrackMutation();
    const [updateTrack, { isLoading: updating }] = useUpdateTrackMutation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!open) return null;

    const defaultValues: TrackFormData = {
        title: track?.title || '',
        artist: track?.artist || '',
        album: track?.album || '',
        coverImage: track?.coverImage || '',
        genres: track?.genres || [],
    };

    const handleSave = async (data: TrackFormData) => {
        setErrorMessage(null);
        let result;
        if (track) {
            result = (await updateTrack({ id: track.id, ...data })).data;
        } else {
            result = (await createTrack(data)).data;
        }

        if (result?.isErr()) {
            setErrorMessage(result.error);
            toast.error(result.error);
            return;
        }

        toast.success(<span data-testid="toast-success">{track ? 'Track updated' : 'Track created'}</span>);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            {errorMessage && (
                <p className="mb-4 text-center text-red-500" data-testid="form-error">
                    {errorMessage}
                </p>
            )}
            <TrackForm
                defaultValues={defaultValues}
                title={track ? 'Edit Track' : 'Create Track'}
                onSubmit={handleSave}
                onCancel={onClose}
                isSubmitting={track ? updating : creating}
            />
        </Modal>
    );
}
