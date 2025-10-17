import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Inserts SEO-relevant meta tags and canonical links.
 * - Adds `noindex,nofollow` when NOT on production.
 * - Always sets a canonical tag to the live domain.
 */
export default function HeadScripts() {
    const isProduction = window.location.hostname === 'trench-companion.com';

    const { pathname, search } = window.location;
    const canonicalUrl = `https://trench-companion.com${pathname}${search}`;

    return (
        <Helmet>
            {!isProduction && (
                <meta name="robots" content="noindex,nofollow" />
            )}
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
    );
}