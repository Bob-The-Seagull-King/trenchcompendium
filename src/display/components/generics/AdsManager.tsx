// src/display/components/generics/AdsManager.tsx (Pfad anpassen)
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../utility/AuthContext';

const isLiveHost =
    typeof window !== 'undefined' &&
    window.location.hostname === 'trench-companion.com';
const FORCE_ENABLE_IN_DEV = false;

export const AdsManager: React.FC = () => {
    const { SiteUser } = useAuth();
    const location = useLocation();

    const pushAds = () => {
        if (!isLiveHost && !FORCE_ENABLE_IN_DEV) return;
        if (SiteUser?.Premium?.IsPremium) return;

        const q: any = (window as any).adsbygoogle;
        if (!q || typeof q.push !== 'function') return;
        try {
            q.push({});
        } catch {
            /* Ignore errors, next event will try again*/
        }
    };

    // On mount when page becomes visible
    useEffect(() => {
        pushAds();
        const onLoaded = () => pushAds();
        window.addEventListener('adsense:loaded', onLoaded);
        const onVisibility = () => {
            if (document.visibilityState === 'visible') pushAds();
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('adsense:loaded', onLoaded);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [SiteUser?.Premium?.IsPremium]);

    // On Route Change
    useEffect(() => {
        pushAds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.search]);

    return null;
};

export default AdsManager;
