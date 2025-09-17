import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import DevMetaBlock from "./DevMetaBlock";

/**
 * Inserts SEO-relevant meta tags and canonical links.
 * - Adds `noindex,nofollow` when NOT on production.
 * - Always sets a canonical tag to the live domain.
 */
export default function HeadScripts() {
    const isProduction = window.location.hostname === 'trench-companion.com';
    const location = useLocation();

    // Always point canonical to the live domain
    const canonicalUrl = `https://trench-companion.com${location.pathname}${location.search}`;

    return (
        <Helmet>
            {!isProduction && (
                <meta name="robots" content="noindex,nofollow" />
            )}
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
    );
}