import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetGenresQuery } from "@/store/services/tracksApi";
import { trackSchema, TrackFormData } from "@/types/track.schema";

export function useTrackForm(defaultValues?: Partial<TrackFormData>) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isValid, touchedFields, isSubmitted },
    } = useForm<TrackFormData>({
        resolver: zodResolver(trackSchema),
        defaultValues: defaultValues ?? {
            title: "",
            artist: "",
            album: "",
            coverImage: undefined,
            genres: [],
        },
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const { data: genres = [] } = useGetGenresQuery();
    const selected = watch("genres");

    const toggleGenre = (genre: string) => {
        const next = selected.includes(genre)
            ? selected.filter((g) => g !== genre)
            : selected.length === 3
                ? [...selected.slice(1), genre]
                : [...selected, genre];

        setValue("genres", next, { shouldValidate: true });

        if (next.length === 0) {
            setError("genres", { message: "Pick at least one genre" });
        } else {
            clearErrors("genres");
        }
    };

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
    };
}
