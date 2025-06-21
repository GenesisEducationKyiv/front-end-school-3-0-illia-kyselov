'use client';

import React, { useEffect } from 'react';
import GenreSelector from './GenreSelector';
import { useTrackForm } from '@/hooks/useTrackForm';
import { TrackFormData } from '@/types/track.schema';
import Input from './UI/Input';
import ModalActions from './UI/ModalActions';

interface TrackFormProps {
    defaultValues: Partial<TrackFormData>;
    title: string;
    onSubmit: (data: TrackFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    titleError?: string;
}

export default function TrackForm({
    defaultValues,
    title,
    onSubmit,
    onCancel,
    isSubmitting,
    titleError,
}: TrackFormProps) {
    const {
        genres,
        register,
        handleSubmit,
        errors,
        isValid,
        touchedFields,
        isSubmitted,
        selected,
        toggleGenre,
        setValue,
    } = useTrackForm(defaultValues);

    useEffect(() => {
        if (titleError) {
            setValue('title', '', { shouldValidate: true });
        }
    }, [titleError, setValue]);

    const showFieldError = (field: keyof TrackFormData) =>
        Boolean(
            (errors[field]?.message || (field === 'title' && titleError)) &&
            (touchedFields[field] || isSubmitted),
        );

    const getFieldError = (field: keyof TrackFormData) => {
        if (field === 'title' && !errors.title && titleError) {
            return { message: titleError };
        }
        if (errors[field]?.message) {
            return { message: errors[field]!.message! };
        }
        return undefined;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} data-testid="track-form">
            <div className="space-y-5 p-8">
                <h2 className="mb-4 text-3xl font-bold text-white">{title}</h2>

                <Input
                    {...register('title')}
                    placeholder="Title"
                    data-testid="input-title"
                    className="w-full"
                />
                {showFieldError('title') && (
                    <p className="text-red-500" data-testid="error-title">
                        {getFieldError('title')!.message}
                    </p>
                )}

                <Input
                    {...register('artist')}
                    placeholder="Artist"
                    data-testid="input-artist"
                    className="w-full"
                />
                {showFieldError('artist') && (
                    <p className="text-red-500" data-testid="error-artist">
                        {getFieldError('artist')!.message}
                    </p>
                )}

                <Input
                    {...register('album')}
                    placeholder="Album"
                    data-testid="input-album"
                    className="w-full"
                />
                {showFieldError('album') && (
                    <p className="text-red-500" data-testid="error-album">
                        {getFieldError('album')!.message}
                    </p>
                )}

                <Input
                    {...register('coverImage', {
                        validate: v =>
                            /^https:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(v) || 'Must be a valid image URL starting with https://',
                    })}
                    placeholder="Cover image URL"
                    data-testid="input-cover-image"
                    className="w-full"
                />
                {showFieldError('coverImage') && (
                    <p className="text-red-500" data-testid="error-cover-image">
                        {getFieldError('coverImage')!.message}
                    </p>
                )}

                <GenreSelector
                    list={genres}
                    selected={selected}
                    toggle={toggleGenre}
                    error={showFieldError('genres') ? errors.genres?.message : undefined}
                />
            </div>

            <ModalActions
                onCancel={onCancel}
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
            />
        </form>
    );
}
