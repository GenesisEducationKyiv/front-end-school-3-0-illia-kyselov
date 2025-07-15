'use client';

import React from 'react';
import Input from './Input';

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export default function SearchField({ value, onChange }: Props) {
    return (
        <Input
            data-testid="search-input"
            type="text"
            placeholder="Search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
        />
    );
}
