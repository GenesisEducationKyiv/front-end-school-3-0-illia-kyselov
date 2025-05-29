'use client';

import React from 'react';

interface Props {
    onCreate(): void;
}

export default function TracksHeader({ onCreate }: Props) {
    return (
        <div
            className="flex items-center justify-between border-b border-[#281a63] pb-4"
            data-testid="tracks-header"
        >
            <h1 className="text-3xl font-bold">iMusicManager</h1>
            <button
                data-testid="create-track-button"
                onClick={onCreate}
                className="cursor-pointer rounded-full border border-[var(--neon)] px-5 py-2 hover:bg-[var(--neon)] transition"
            >
                + CREATE TRACK
            </button>
        </div>
    );
}
