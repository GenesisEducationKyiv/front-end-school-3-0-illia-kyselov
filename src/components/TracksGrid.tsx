'use client';

import TrackCard from '@/components/TrackCard';
import type { Track } from '../../backend/src/types';

interface Props {
    tracks: Track[];
    selectedIds: string[];
    onEdit(t: Track): void;
    onSelect(id: string, on: boolean): void;
    onDelete: (track: Track) => void;
}

export default function TracksGrid({
    tracks,
    selectedIds,
    onEdit,
    onSelect,
}: Props) {
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map(t => (
                <TrackCard
                    key={t.id}
                    track={t}
                    onEdit={() => onEdit(t)}
                    isSelected={selectedIds.includes(t.id)}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
