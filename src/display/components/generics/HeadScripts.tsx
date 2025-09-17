import React from 'react';
import { Helmet } from 'react-helmet';
import DevMetaBlock from "./DevMetaBlock";

/**
 * This will load the ads scripts in the header only on production page
 *
 * @constructor
 */
export default function HeadScripts() {
    // for debugging
    // const isProduction = false

    // Check if is real production url
    const isProduction= window.location.hostname === 'trench-companion.com';


    if (!isProduction) return null

    return (
        <Helmet>

        </Helmet>
    )
}