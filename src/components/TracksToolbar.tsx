'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SearchField from '@/components/UI/SearchField';
import GenreSelect from '@/components/UI/GenreSelect';
import SortSelect from '@/components/UI/SortSelect';
import ArtistSelect from '@/components/UI/ArtistSelect';

interface Props {
    search: string;
    onSearch(v: string): void;
    genre: string;
    onGenre(v: string): void;
    artist: string;
    onArtist(v: string): void;
    sort: string;
    onSort(v: string): void;
    genresList: string[];
    artistsList: string[];
}

const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
            when: 'beforeChildren',
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
};

export default function TracksToolbar({
    search,
    onSearch,
    genre,
    onGenre,
    artist,
    onArtist,
    sort,
    onSort,
    genresList,
    artistsList,
}: Props) {
    return (
        <motion.div
            className="flex flex-wrap gap-4 items-center pt-4 pb-4 rounded-lg shadow-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <SearchField value={search} onChange={onSearch} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <GenreSelect list={genresList} value={genre} onChange={onGenre} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <ArtistSelect list={artistsList} value={artist} onChange={onArtist} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <SortSelect value={sort} onChange={onSort} />
            </motion.div>
        </motion.div>
    );
}
