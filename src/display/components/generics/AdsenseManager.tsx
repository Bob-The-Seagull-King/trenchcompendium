// src/display/components/generics/AdsenseManager.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';
import { useLocation } from 'react-router-dom';

const LIVE_HOSTS = new Set(['trench-companion.com', 'www.trench-companion.com']);
const isLiveHost = typeof window !== 'undefined' && LIVE_HOSTS.has(window.location.hostname);
const ADSENSE_CLIENT = 'ca-pub-3744837400491966';
const ADSENSE_SCRIPT_ID = 'adsense-auto-ads-script';

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
    // Script entfernen
    const el = document.getElementById(ADSENSE_SCRIPT_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);

    // Laufende Anfragen pausieren & Einblendungen verbergen (falls Nutzer im laufenden Betrieb Premium wurde)
    try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.pauseAdRequests = 1; // harmless, falls nicht unterstützt
    } catch {}
    // Sichtbare Auto-Ads-Container ausblenden
    document.querySelectorAll('ins.adsbygoogle, div[id^="google_ads_iframe_"], div[data-anchor-status]').forEach((node) => {
        (node as HTMLElement).style.display = 'none';
    });
}

export const AdsenseManager: React.FC = () => {
    const { SiteUser } = useAuth();
    const location = useLocation();
    const initialized = useRef(false);

    const isPremium = !!SiteUser?.Premium?.IsPremium;
    const canLoadAds = isLiveHost && !isPremium;

    // Script je nach Premium-Status injizieren/entfernen
    useEffect(() => {
        if (canLoadAds) {
            injectAutoAdsScript();
        } else {
            removeAutoAdsScriptAndHide();
        }
    }, [canLoadAds]);

    // Erstes Enable (nachdem Script da ist)
    useEffect(() => {
        if (!canLoadAds) return;
        if (initialized.current) return;
        if (!hasAdsApi()) return;
        try {
            (window as any).adsbygoogle.push({});
            initialized.current = true;
        } catch {}
    }, [canLoadAds]);

    // SPA: bei jeder Navigation AdSense „anstupsen“
    useEffect(() => {
        if (!canLoadAds) return;
        if (!hasAdsApi()) return;
        try {
            (window as any).adsbygoogle.push({});
        } catch {}
    }, [canLoadAds, location.pathname, location.search]);

    return null;
};
