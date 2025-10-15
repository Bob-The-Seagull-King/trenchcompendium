// AdsManagerv2.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';
import {useLocation} from "react-router-dom";

// Gate: enable ads only on live host (or set FORCE_ENABLE_IN_DEV = true for local testing)
const isLiveHost =
    typeof window !== 'undefined' && window.location.hostname === 'trench-companion.com';
const FORCE_ENABLE_IN_DEV = false;

declare global {
    interface Window {
        adsbygoogle?: any;              // <-- nicht unknown[]; identisch in allen Dateien halten
        adsenseScriptLoaded?: boolean;
    }
}


export const AdsManagerv2: React.FC = () => {
    const { SiteUser } = useAuth();
    const location = useLocation();

    // Make sure we push Auto Ads only once per page view
    const pushedRef = useRef(false);

    // Check if Klaro has a recorded decision (accept OR decline). We cast to any on purpose
    // because another global typing defined `klaro` narrowly (show/hide).
    const hasConsentDecision = () => {
        try {
            const m = (window as any).klaro?.getManager?.();
            return !!m?.confirmed;
        } catch {
            return false;
        }
    };

    // All gates before enabling Auto/Anchor ads
    const canEnableAutoAds = () => {
        if (!isLiveHost && !FORCE_ENABLE_IN_DEV) return false;
        if (SiteUser?.Premium?.IsPremium) return false;
        if (!hasConsentDecision()) return false;

        if (!window.adsenseScriptLoaded) return false;

        const q: any = (window as any).adsbygoogle;
        // Accept either a real array or any object that offers a push() function
        if (!q || typeof q.push !== 'function') return false;

        return true;
    };

    const enableOnce = () => {
        if (pushedRef.current) return;
        if (!canEnableAutoAds()) return;

        try {
            // Single bootstrap call for AdSense Auto Ads. Anchor Ads must be enabled in AdSense UI.
            // The library must be included once in <head> with ?client=ca-pub-XXXX.
            window.adsbygoogle!.push({});
            pushedRef.current = true;
            // console.debug('[Ads] Auto Ads enabled');
        } catch (e) {
            // If something fails, we'll try again on the next event (consent/auth/library)
            // console.warn('[Ads] enable failed; will retry', e);
        }
    };

    useEffect(() => {
        // Try immediately in case everything is already ready
        enableOnce();

        // Re-check on key events:
        // - Klaro fires `tc:consent-changed` in your config callback (after any decision)
        // - Head script should dispatch `adsense:loaded` on successful library load
        // - On visibility change (tab re-activated), try again
        const onConsent = () => enableOnce();
        const onAdsJsLoaded = () => enableOnce();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') enableOnce();
        };

        window.addEventListener('tc:consent-changed', onConsent as EventListener);
        window.addEventListener('adsense:loaded', onAdsJsLoaded as EventListener);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.removeEventListener('tc:consent-changed', onConsent as EventListener);
            window.removeEventListener('adsense:loaded', onAdsJsLoaded as EventListener);
            document.removeEventListener('visibilitychange', onVisibility);
        };
        // Re-run effect if premium status changes at runtime
    }, [SiteUser?.Premium?.IsPremium]);

    // Re-ping Auto Ads on SPA route changes
    useEffect(() => {
        // Guard: only when user is non-premium and consent decision exists
        const m = (window as any).klaro?.getManager?.();
        const consentReady = !!m?.confirmed;
        if (SiteUser?.Premium?.IsPremium || !consentReady) return;

        // Library/queue ready?
        const q: any = (window as any).adsbygoogle;
        if (!window.adsenseScriptLoaded || !q || typeof q.push !== 'function') return;

        // Let AdSense re-evaluate this virtual page view
        try {
            q.push({});
            // console.debug('[Ads] SPA route ping -> Auto Ads rescan', location.pathname + location.search);
        } catch (e) {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.search, SiteUser?.Premium?.IsPremium]);


    // Never render DOM for Anchor/Auto ads – AdSense controls the placement
    return null;
};
