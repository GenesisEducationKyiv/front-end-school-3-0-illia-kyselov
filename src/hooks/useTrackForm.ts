'use client'

import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useGetGenresQuery } from '@/store/services/tracksApi'
import { FormValues } from '@/types/TrackForm.types'

export function useTrackForm(defaultValues: FormValues) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isValid, touchedFields, isSubmitted },
    } = useForm<FormValues>({
        defaultValues,
        mode: 'onTouched',
        reValidateMode: 'onChange',
    })

    useEffect(() => {
        register('genres', {
            validate: (v: string[]) =>
                v.length > 0 || 'Pick at least one genre',
        })
    }, [register])

    const { data: genres = [] } = useGetGenresQuery()
    const selected = watch('genres')

    const toggleGenre = (g: string) => {
        const next = selected.includes(g)
            ? selected.filter(x => x !== g)
            : selected.length === 3
                ? [...selected.slice(1), g]
                : [...selected, g]

        setValue('genres', next, { shouldValidate: true })

        if (next.length === 0) {
            setError('genres', { message: 'Pick at least one genre' })
        } else {
            clearErrors('genres')
        }
    }

    return {
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
    }
}
