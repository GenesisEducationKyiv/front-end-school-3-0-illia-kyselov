import { Suspense } from 'react';
import TracksPageContent from './TracksPageContent';

export default function TracksPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading tracks…</div>}>
            <TracksPageContent />
        </Suspense>
    );
}
