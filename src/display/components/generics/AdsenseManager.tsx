// src/display/components/generics/AdsenseManager.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';
import { useLocation } from 'react-router-dom';

const LIVE_HOSTS = new Set(['trench-companion.com', 'www.trench-companion.com']);
const isLiveHost =
    typeof window !== 'undefined' && LIVE_HOSTS.has(window.location.hostname);

const ADSENSE_CLIENT = 'ca-pub-3744837400491966';
const ADSENSE_SCRIPT_ID = 'adsense-auto-ads-script';

// Interaction-Buffer: 5 Minuten
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
    const el = document.getElementById(ADSENSE_SCRIPT_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);

    // Laufende Anfragen pausieren & sichtbare Einblendungen verbergen
    try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.pauseAdRequests = 1;
    } catch {
        console.log('error removeAutoAdsScriptAndHide');
    }
    document
        .querySelectorAll(
            'ins.adsbygoogle, div[id^="google_ads_iframe_"], div[data-anchor-status]'
        )
        .forEach((node) => {
            (node as HTMLElement).style.display = 'none';
        });
}

export const AdsenseManager: React.FC = () => {
    const {SiteUser} = useAuth();
    const location = useLocation();

    const initializedRef = useRef(false);
    const lastInteractionPushRef = useRef(0);

    const isPremium = !!SiteUser?.Premium?.IsPremium;
    const canLoadAds = isLiveHost && !isPremium;

    // Script je nach Premium-Status injizieren/entfernen
    useEffect(() => {
        if (canLoadAds) {
            injectAutoAdsScript();
        } else {
            removeAutoAdsScriptAndHide();
            initializedRef.current = false;
            lastInteractionPushRef.current = 0;
        }
    }, [canLoadAds]);

    // Erstes Enable (nachdem Script da ist)
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

    // SPA: bei jeder Navigation AdSense "anstupsen"
    useEffect(() => {
        if (!canLoadAds) return;
        if (!hasAdsApi()) return;
        try {
            (window as any).adsbygoogle.push({});
        } catch {
            console.log('error processing canloadAds');
        }
    }, [canLoadAds, location.pathname, location.search]);

    // Interaktions-Nudge mit 5-Minuten-Puffer
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
                // still ok, wir ignorieren einzelne Fehler
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
            <ins key={location.pathname}
                className="adsbygoogle"
                 data-ad-client="ca-pub-3744837400491966"
                 data-ad-slot="7868779249"
                 data-ad-format="auto"
                 data-full-width-responsive="true">

            </ins>
        );
    } else {
        return null
    }


};
