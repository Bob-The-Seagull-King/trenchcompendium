// src/display/components/generics/AdsenseManager.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';
import { useLocation } from 'react-router-dom';

const isLiveHost =
    typeof window !== 'undefined' && window.location.hostname === 'trench-companion.com';
const FORCE_ENABLE_IN_DEV = false;

function hasAdsApi(): boolean {
    if (typeof window === 'undefined') return false;
    const w = window as any;
    return !!w.adsenseScriptLoaded && !!w.adsbygoogle && typeof w.adsbygoogle.push === 'function';
}

export const AdsenseManager: React.FC = () => {
    const { SiteUser } = useAuth();
    const location = useLocation();
    const bootstrapped = useRef(false);

    const canRun = () =>
        (isLiveHost || FORCE_ENABLE_IN_DEV) &&
        !SiteUser?.Premium?.IsPremium &&
        hasAdsApi();

    const enableOnce = () => {
        if (bootstrapped.current) return;
        if (!canRun()) return;
        try {
            (window as any).adsbygoogle.push({});
            bootstrapped.current = true;
        } catch (err) {
            // AdSense ggf. noch nicht bereit – einfach später erneut versuchen
            void err;
        }
    };

    // initial + wenn das AdSense-Script geladen wurde + wenn Tab wieder sichtbar wird
    useEffect(() => {
        enableOnce();
        const onAdsJsLoaded = () => enableOnce();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') enableOnce();
        };
        window.addEventListener('adsense:loaded', onAdsJsLoaded as EventListener);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('adsense:loaded', onAdsJsLoaded as EventListener);
            document.removeEventListener('visibilitychange', onVisibility);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SiteUser?.Premium?.IsPremium]);

    // SPA: bei jedem Route-Wechsel AdSense neu scannen lassen
    useEffect(() => {
        if (!canRun()) return;
        try {
            (window as any).adsbygoogle.push({});
        } catch (err) {
            void err;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.search, SiteUser?.Premium?.IsPremium]);

    return null;
};
