import { Helmet } from 'react-helmet';


/**
 * This will load the ads scripts in the header only on production page
 *
 * @constructor
 */
export default function HeadScripts() {
    const isProduction = false// = window.location.hostname === 'trench-companion.com';


    if (!isProduction) return null

    return (
        <Helmet>

            <script src="https://cmp.gatekeeperconsent.com/min.js" data-cfasync="false"></script>
            <script src="https://the.gatekeeperconsent.com/cmp.min.js" data-cfasync="false"></script>

            <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
            <script>
                window.ezstandalone = window.ezstandalone || {};
                ezstandalone.cmd = ezstandalone.cmd || [];
            </script>


        </Helmet>
    )
}