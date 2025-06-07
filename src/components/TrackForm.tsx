'use client'

import React, { useEffect } from 'react'
import GenreSelector from './GenreSelector'
import { useTrackForm } from '@/hooks/useTrackForm'
import { FormValues } from '@/types/TrackForm.types'
import Input from './UI/Input'
import ModalActions from './UI/ModalActions'

interface TrackFormProps {
    defaultValues: FormValues
    title: string
    onSubmit: (data: FormValues) => void
    onCancel: () => void
    isSubmitting: boolean
    titleError?: string
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
    } = useTrackForm(defaultValues)

    useEffect(() => {
        if (titleError) {
            setValue('title', '', { shouldValidate: true })
        }
    }, [titleError, setValue])

    const showFieldError = (field: keyof FormValues) =>
        Boolean(
            (errors[field]?.message || (field === 'title' && titleError)) &&
            (touchedFields[field] || isSubmitted),
        )

    const getFieldError = (field: keyof FormValues) => {
        if (field === 'title' && !errors.title && titleError) {
            return { message: titleError }
        }
        if (errors[field]?.message) {
            return { message: errors[field]!.message! }
        }
        return undefined
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} data-testid="track-form">
            <div className="space-y-5 p-8">
                <h2 className="mb-4 text-3xl font-bold text-white">{title}</h2>

                <Input
                    {...register('title', {
                        required: 'Required',
                        maxLength: { value: 30, message: 'Max 30 chars' },
                    })}
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
                    {...register('artist', {
                        required: 'Required',
                        maxLength: { value: 20, message: 'Max 20 chars' },
                    })}
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
                    {...register('album', {
                        required: 'Required',
                        maxLength: { value: 15, message: 'Max 15 chars' },
                    })}
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
                            !v || v.startsWith('https://') || 'Must start with https://',
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
    )
}
