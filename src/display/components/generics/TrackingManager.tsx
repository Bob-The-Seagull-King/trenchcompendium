import React, { useEffect } from 'react';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

const COOKIE_KEY = 'cookie_consent';
const GA_ID = 'G-YENKW9MDRJ';
const isProduction = window.location.hostname === 'trench-companion.com';

let initialized = false;

export const loadGoogleAnalytics = () => {
    if (initialized || !isProduction) return;
    initialized = true;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (!isProduction) return;

    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

export const TrackingManager: React.FC = () => {
    useEffect(() => {
        if (!isProduction) return;

        const rawConsent = localStorage.getItem('cookie_consent');
        if (!rawConsent) return;

        try {
            const consent = JSON.parse(rawConsent);
            if (consent.tracking === true) {
                loadGoogleAnalytics();
            }
        } catch (e) {
            console.error('Invalid cookie consent data:', e);
        }
    }, []);

    return null;
};
