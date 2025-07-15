'use client';

import React from 'react';
import Modal from './Modal';
import ModalActions from './UI/ModalActions';

interface Props {
    open: boolean;
    onConfirm(): void;
    onCancel(): void;
    count: number;
}

export default function ConfirmDialog({ open, onConfirm, onCancel, count }: Props) {
    if (!open) return null;

    const message =
        count === 1
            ? 'Are you sure you want to delete this track?'
            : `Are you sure you want to delete these ${count} tracks?`;

    return (
        <Modal open={open} onClose={onCancel}>
            <form
                data-testid="confirm-dialog"
                className="p-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirm();
                }}
            >
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {message}
                </h2>

                <ModalActions
                    onCancel={onCancel}
                    cancelTestId="cancel-delete"
                    submitTestId="confirm-delete"
                    idleLabel="Delete"
                    disabled={false}
                    isLoading={false}
                />
            </form>
        </Modal>
    );
}
