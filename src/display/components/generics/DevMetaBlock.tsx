import React from 'react';

const DevMetaBlock: React.FC = () => {
    if (typeof window === 'undefined') return null;

    const isDevDomain = window.location.hostname.startsWith('dev.');
    if (!isDevDomain) return null;

    const canonicalHref = window.location.href.replace('dev.', '');

    return (
        <>
            <meta name="robots" content="noindex, nofollow" />
            <link rel="canonical" href={canonicalHref} />
        </>
    );
};

export default DevMetaBlock;