'use client';

import React, { useState } from 'react';
import TrackForm from './TrackForm';
import Modal from './Modal';
import { useCreateTrackMutation, useUpdateTrackMutation } from '@/store/services/tracksApi';
import { Track } from '../../backend/src/types';
import { FormValues } from '@/types/TrackForm.types';
import { toast } from 'react-hot-toast';
import { parseErrorMessage } from '@/utils/parseError';

interface Props {
    open: boolean;
    onClose(): void;
    track?: Track;
}

export default function TrackModal({ open, onClose, track }: Props) {
    const [createTrack, { isLoading: creating }] = useCreateTrackMutation();
    const [updateTrack, { isLoading: updating }] = useUpdateTrackMutation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const defaultValues: FormValues = {
        title: track?.title || '',
        artist: track?.artist || '',
        album: track?.album || '',
        coverImage: track?.coverImage || '',
        genres: track?.genres || [],
    };

    const handleSave = async (data: FormValues) => {
        setErrorMessage(null);
        try {
            if (track) {
                await updateTrack({ id: track.id, ...data }).unwrap();
                toast.success(<span data-testid="toast-success">Track updated</span>);
            } else {
                await createTrack(data).unwrap();
                toast.success(<span data-testid="toast-success">Track created</span>);
            }
            onClose();
        } catch (err: unknown) {
            const msg = parseErrorMessage(err, 'Failed to save track');
            toast.error(<span data-testid="toast-error">{msg}</span>);
            setErrorMessage(msg);
        }
    };

    if (!open) return null;

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
