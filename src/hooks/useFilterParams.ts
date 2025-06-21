'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { pipe, O } from '@mobily/ts-belt';

interface Defaults {
    genre: string;
    artist: string;
    search: string;
    sort: string;
    page: number;
}

function getParamWithDefault(
    p: URLSearchParams,
    key: string,
    fallback: string
): string {
    return pipe(O.fromNullable(p.get(key)), O.getWithDefault(fallback));
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

    const stableDefaults = useMemo(() => defaults, [defaults]);

    useEffect(() => {
        const p = searchParams;

        setGenre(getParamWithDefault(p, 'genre', stableDefaults.genre));
        setArtist(getParamWithDefault(p, 'artist', stableDefaults.artist));
        setSearch(getParamWithDefault(p, 'search', stableDefaults.search));
        setSort(getParamWithDefault(p, 'sort', stableDefaults.sort));

        const rawPage = p.get('page');
        const parsedPage = pipe(
            O.fromNullable(rawPage),
            O.map((s) => parseInt(s, 10)),
            O.flatMap((n) => (Number.isNaN(n) ? O.None : O.Some(n))),
            O.getWithDefault(stableDefaults.page)
        );
        setPage(parsedPage);
    }, [searchParams]);

    useEffect(() => {
        const q = new URLSearchParams();
        if (genre !== stableDefaults.genre) q.set('genre', genre);
        if (artist !== stableDefaults.artist) q.set('artist', artist);
        if (search !== stableDefaults.search) q.set('search', search);
        if (sort !== stableDefaults.sort) q.set('sort', sort);
        if (page !== stableDefaults.page) q.set('page', String(page));

        const href = q.toString() ? `${pathname}?${q.toString()}` : pathname;
        router.replace(href);
    }, [genre, artist, search, sort, page, pathname, router, stableDefaults]);

    return {
        genre, setGenre,
        artist, setArtist,
        search, setSearch,
        sort, setSort,
        page, setPage,
    };
}
