'use client';

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Modal from './Modal';
import ModalActions from './UI/ModalActions';
import { useUploadTrackMutation, useDeleteTrackFileMutation } from '@/store/services/tracksApi';
import { toast } from 'react-hot-toast';
import { parseErrorMessage } from '@/utils/parseError';

interface UploadModalProps {
    trackId: string;
    existingFileName?: string;
    open: boolean;
    onClose: () => void;
}

export default function UploadModal({ trackId, existingFileName, open, onClose }: UploadModalProps) {
    const [newFile, setNewFile] = useState<File | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const [uploadTrack, { isLoading: isUploading }] = useUploadTrackMutation();
    const [deleteFile, { isLoading: isDeleting }] = useDeleteTrackFileMutation();

    useEffect(() => {
        if (open) {
            setNewFile(null);
            setErrorMessage(null);
            setDisplayName(existingFileName || null);
            if (inputRef.current) inputRef.current.value = '';
        }
    }, [open, existingFileName]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        setNewFile(f);
        setDisplayName(f.name);
        setErrorMessage(null);
    };

    const handleRemove = async () => {
        if (newFile) {
            setNewFile(null);
            setDisplayName(existingFileName || null);
            setErrorMessage(null);
            if (inputRef.current) inputRef.current.value = '';
            return;
        }
        if (existingFileName) {
            try {
                await deleteFile(trackId).unwrap();
                toast.success('Audio file removed');
                setDisplayName(null);
                if (inputRef.current) inputRef.current.value = '';
            } catch {
                toast.error('Failed to remove audio file');
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newFile) return;

        const formData = new FormData();
        formData.append('file', newFile);

        try {
            await uploadTrack({ id: trackId, formData }).unwrap();
            toast.success('File uploaded');
            onClose();
        } catch (err: unknown) {
            const msg = parseErrorMessage(err, 'Failed to upload file');
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    if (!open) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="mb-4 text-2xl font-bold text-white">
                Upload Audio File
            </h2>

            <div className="flex items-center space-x-2 mb-4">
                <label
                    htmlFor="audio-file"
                    className="flex-1 px-4 py-2 border border-[var(--neon)] rounded cursor-pointer text-sm text-white hover:bg-[var(--neon)] transition"
                >
                    {displayName ?? 'Choose audio file'}
                </label>
                {displayName && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        data-testid={`delete-track-${trackId}`}
                        disabled={isDeleting}
                        aria-disabled={isDeleting}
                        className="px-4 py-2 bg-[var(--neon)] rounded hover:opacity-90 disabled:opacity-50"
                    >
                        {isDeleting ? 'Removing…' : 'Remove'}
                    </button>
                )}
            </div>

            <input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
            />

            {errorMessage && (
                <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
                <ModalActions
                    onCancel={onClose}
                    cancelTestId="cancel-upload"
                    submitTestId="submit-upload"
                    disabled={!newFile}
                    isLoading={isUploading}
                    loadingLabel="Uploading…"
                    idleLabel="Upload"
                />
            </form>
        </Modal>
    );
}
