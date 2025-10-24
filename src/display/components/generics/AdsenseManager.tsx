// src/display/components/generics/AdsenseManager.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';
import { useLocation } from 'react-router-dom';

const LIVE_HOSTS = new Set(['trench-companion.com', 'www.trench-companion.com']);
const isLiveHost =
    typeof window !== 'undefined' && LIVE_HOSTS.has(window.location.hostname);

const ADSENSE_CLIENT = 'ca-pub-3744837400491966';
const ADSENSE_SCRIPT_ID = 'adsense-auto-ads-script';

// Interaction-Buffer: 5 Minutes
const INTERACTION_GAP_MS = 5 * 60 * 1000;


function hasAdsApi(): boolean {
    const w = window as any;
    return !!w.adsbygoogle && typeof w.adsbygoogle.push === 'function';
}

function injectAutoAdsScript() {
    if (document.getElementById(ADSENSE_SCRIPT_ID)) return;
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.id = ADSENSE_SCRIPT_ID;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    s.onload = () => {
        (window as any).adsenseScriptLoaded = true;
        window.dispatchEvent(new Event('adsense:loaded'));
    };
    document.head.appendChild(s);
}

function removeAutoAdsScriptAndHide() {
    // Remove ALL adsense scripts
    document
        .querySelectorAll('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
        .forEach((s) => s.parentNode?.removeChild(s));

    // if own script was loaded - remove if possible
    const el = document.getElementById(ADSENSE_SCRIPT_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);

    // Cancel running requests
    try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.pauseAdRequests = 1;
    } catch {
        // Do nothing
    }

    // Remove ALL known auto ads implementations
    const selectors = [
        'ins.adsbygoogle',
        'div[id^="google_ads_iframe_"]',
        'iframe[id^="google_ads_iframe_"]',
        'div[data-anchor-status]',
        '#google_vignette',
        '.google-auto-placed', // in-page Auto Ads
    ];
    document.querySelectorAll(selectors.join(',')).forEach((node) => {
        node.parentNode?.removeChild(node);
    });

    // Reset states
    try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.loaded = false;
    } catch {
        // Do nothing
    }
}

export const AdsenseManager: React.FC = () => {
    const {SiteUser, loadingUser } = useAuth();
    const location = useLocation();

    const initializedRef = useRef(false);
    const lastInteractionPushRef = useRef(0);

    const isPremium = !!SiteUser?.Premium?.IsPremium;
    const canLoadAds = isLiveHost && !loadingUser && !isPremium;

    // Inject script based on premium state
    useEffect(() => {
        if (canLoadAds) {
            try {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.pauseAdRequests = 0;     // unpause ad requests
                delete (window as any).adsbygoogle.loaded;           // optional safer reset
            } catch {
                // do nothing
            }
            injectAutoAdsScript();
        } else {
            removeAutoAdsScriptAndHide();
            initializedRef.current = false;
            lastInteractionPushRef.current = 0;
        }
    }, [canLoadAds]);

    // event listener to when adsense has actually loaded
    useEffect(() => {
        if (!canLoadAds) return;

        function onAdsenseLoaded() {
            if (!hasAdsApi() || initializedRef.current) return;
            try {
                (window as any).adsbygoogle.push({});
                initializedRef.current = true;
            } catch {/* noop */}
        }

        window.addEventListener('adsense:loaded', onAdsenseLoaded);
        return () => window.removeEventListener('adsense:loaded', onAdsenseLoaded);
    }, [canLoadAds]);

    // First enable (after script is available)
    useEffect(() => {
        if (!canLoadAds) return;
        if (initializedRef.current) return;
        if (!hasAdsApi()) return;
        try {
            (window as any).adsbygoogle.push({});
            initializedRef.current = true;
        } catch {
            console.log('error processing canloadAds 2');
        }
    }, [canLoadAds]);

    // SPA: nudge Adsense on navigation ()
    useEffect(() => {
        if (!canLoadAds) return;
        if (!hasAdsApi()) return;
        try {
            (window as any).adsbygoogle.push({});
        } catch {
            console.log('error processing canloadAds');
        }
    }, [canLoadAds, location.pathname, location.search]);

    // Interaction nudge with 5 minute buffer
    useEffect(() => {
        if (!canLoadAds) return;

        const handler = () => {
            if (!hasAdsApi()) return;
            const now = Date.now();
            if (now - lastInteractionPushRef.current < INTERACTION_GAP_MS) return;
            try {
                (window as any).adsbygoogle.push({});
                lastInteractionPushRef.current = now;
            } catch {
                // still ok, we ignore single errors
            }
        };

        const opts: AddEventListenerOptions = {passive: true};
        const evts: Array<keyof WindowEventMap> = [
            'click',
            'keydown',
            'touchstart',
            'scroll',
        ];

        evts.forEach((e) => window.addEventListener(e, handler, opts));
        return () => evts.forEach((e) => window.removeEventListener(e, handler as any));
    }, [canLoadAds]);

    if( canLoadAds ) {
        return (
            <div className={'container'}>
                <ins key={location.pathname}
                     className="adsbygoogle"
                     data-ad-client="ca-pub-3744837400491966"
                     data-ad-slot="7868779249"
                     data-ad-format="auto"
                     data-full-width-responsive="true">

                </ins>
            </div>

        );
    } else {
        return null
    }


};
