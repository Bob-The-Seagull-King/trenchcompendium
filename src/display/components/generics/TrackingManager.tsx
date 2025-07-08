import React, { useEffect } from 'react';
import {useLocation} from "react-router-dom";

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
    if (initialized) return;
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
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

export const TrackingManager: React.FC = () => {
    const location = useLocation();

    // Load GA on first load if consent is given
    useEffect(() => {
        if (!isProduction) return;

        const consentRaw = localStorage.getItem(COOKIE_KEY);
        const consent = consentRaw ? JSON.parse(consentRaw) : null;

        if (consent?.tracking === true) {
            loadGoogleAnalytics();
        }
    }, []);

    // Track page views on every route change
    useEffect(() => {
        if (!isProduction) return;

        if (typeof window.gtag !== 'function') {
            return; // tracking manager not yet loaded
        }

        window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title,
        });
    }, [location]);

    return null; // invisible component
};
