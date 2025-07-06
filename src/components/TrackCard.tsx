
'use client'

import { useState } from 'react'
import Image from 'next/image'
import CustomAudioPlayer from './CustomAudioPlayer'
import EditIcon from '@/icons/EditIcon'
import UploadIcon from '@/icons/UploadIcon'
import UploadModal from './UploadModal'
import Checkbox from './UI/Checkbox'
import { Track } from '../../backend/src/types'

interface Props {
    track: Track
    onEdit(track: Track): void
    isSelected: boolean
    onSelect(id: string, value: boolean): void
}

export default function TrackCard({
    track,
    onEdit,
    isSelected,
    onSelect,
}: Props) {
    const audioSrc = track.audioFile ? '/sample.mp3' : null
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    return (
        <>
            <div
                className="relative p-6 bg-[#060a0d] rounded-lg border border-[#271864] hover:shadow-lg transition-shadow"
                data-testid={`track-item-${track.id}`}
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                    <Checkbox
                        checked={isSelected}
                        onChange={v => onSelect(track.id, v)}
                        testId={`track-checkbox-${track.id}`}
                    />
                </div>

                <div className="relative flex items-start space-x-4 z-10 ml-8">
                    <div className="w-[166px] h-[166px] bg-[#0e1218] rounded overflow-hidden flex-shrink-0 relative">
                        {track.coverImage && (
                            <Image
                                src={track.coverImage}
                                alt={`${track.title} cover`}
                                fill
                                className="object-cover w-[166px] h-[166px]"
                                unoptimized
                            />
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h2
                                className="text-xl font-semibold text-white"
                                data-testid={`track-item-${track.id}-title`}
                            >
                                {track.title}
                            </h2>
                            <div className="flex space-x-3">
                                <EditIcon
                                    width={20}
                                    height={20}
                                    className="cursor-pointer text-[#bfb8e5] hover:text-white"
                                    data-testid={`edit-track-${track.id}`}
                                    onClick={() => onEdit(track)}
                                />
                                <UploadIcon
                                    width={20}
                                    height={20}
                                    className="cursor-pointer text-[#bfb8e5] hover:text-white"
                                    data-testid={`upload-track-${track.id}`}
                                    onClick={() => setIsUploadOpen(true)}
                                />
                            </div>
                        </div>

                        <div
                            className="flex justify-between items-center text-sm text-[#9ca0a4] mt-2"
                            data-testid={`track-item-${track.id}-artist`}
                        >
                            <div className="flex items-center gap-2">
                                <span>{track.artist}</span>
                                {track.album && (
                                    <>
                                        <span>·</span>
                                        <span>{track.album}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {track.genres?.map(g => (
                                    <span
                                        key={g}
                                        className="text-xs px-2 py-1 bg-[#111023] rounded-full text-[#bfb8e5]"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <CustomAudioPlayer
                                key={`${track.id}-${track.audioFile ?? 'nofile'}`}
                                src={audioSrc}
                                trackId={track.id}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <UploadModal
                trackId={track.id}
                existingFileName={track.audioFile ?? undefined}
                open={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </>
    )
}
