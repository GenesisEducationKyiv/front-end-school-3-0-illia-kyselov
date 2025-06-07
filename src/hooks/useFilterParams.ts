'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { pipe, O } from '@mobily/ts-belt';

interface Defaults {
    genre: string;
    artist: string;
    search: string;
    sort: string;
    page: number;
}

export function useFilterParams(defaults: Defaults) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [genre, setGenre] = useState(defaults.genre);
    const [artist, setArtist] = useState(defaults.artist);
    const [search, setSearch] = useState(defaults.search);
    const [sort, setSort] = useState(defaults.sort);
    const [page, setPage] = useState(defaults.page);

    useEffect(() => {
        if (!searchParams) return;

        const p = searchParams;
        setGenre(pipe(
            O.fromNullable(p.get('genre')),
            O.getWithDefault(defaults.genre),
        ));
        setArtist(pipe(
            O.fromNullable(p.get('artist')),
            O.getWithDefault(defaults.artist),
        ));
        setSearch(pipe(
            O.fromNullable(p.get('search')),
            O.getWithDefault(defaults.search),
        ));
        setSort(pipe(
            O.fromNullable(p.get('sort')),
            O.getWithDefault(defaults.sort),
        ));

        const raw = p.get('page');
        const num = pipe(
            O.fromNullable(raw),
            O.map((s: string) => parseInt(s, 10)),
            O.flatMap((n: number) =>
                Number.isNaN(n) ? O.None : O.Some(n)
            ),
            O.getWithDefault(defaults.page),
        );

        setPage(num);
    }, [
        searchParams,
        defaults.genre,
        defaults.artist,
        defaults.search,
        defaults.sort,
        defaults.page,
    ]);

    useEffect(() => {
        const q = new URLSearchParams();
        if (genre !== defaults.genre) q.set('genre', genre);
        if (artist !== defaults.artist) q.set('artist', artist);
        if (search !== defaults.search) q.set('search', search);
        if (sort !== defaults.sort) q.set('sort', sort);
        if (page !== defaults.page) q.set('page', String(page));

        const href = q.toString() ? `${pathname}?${q.toString()}` : pathname;
        router.replace(href);
    }, [
        genre, artist, search, sort, page,
        pathname, router,
        defaults.genre,
        defaults.artist,
        defaults.search,
        defaults.sort,
        defaults.page,
    ]);

    return { genre, setGenre, artist, setArtist, search, setSearch, sort, setSort, page, setPage };
}
