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
            <script
                src="https://cmp.gatekeeperconsent.com/min.js"
                data-cfasync="false"
            />
            <script
                src="https://the.gatekeeperconsent.com/cmp.min.js"
                data-cfasync="false"
            />
            <script async src="https://www.ezojs.com/ezoic/sa.min.js" />

            <script>
                {`
          window.ezstandalone = window.ezstandalone || {};
          ezstandalone.cmd = ezstandalone.cmd || [];
        `}
            </script>
        </Helmet>
    )
}