import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        ezstandalone?: {
            cmd: Array<() => void>;
            showAds: (id: number) => void;
        };
    }
}

const COOKIE_KEY = 'ezoic_ads_consent';
const isProduction = false;
// const isProduction = window.location.hostname === 'trench-companion.com';

export const AdsManager: React.FC = () => {
    const [consent, setConsent] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isProduction) return;

        const val = localStorage.getItem(COOKIE_KEY);
        setConsent(val === 'true');
    }, []);

    useEffect(() => {
        if (!isProduction || consent !== true) return;

        if (typeof window.ezstandalone !== 'undefined' && window.ezstandalone.cmd) {
            window.ezstandalone?.cmd.push(() => {
                window.ezstandalone?.showAds(118);
            });
        }
    }, [consent]);

    if (consent !== true) return null;

    return (
        <div
            id="ezoic-pub-ad-placeholder-118"
            style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
        />
    );
};