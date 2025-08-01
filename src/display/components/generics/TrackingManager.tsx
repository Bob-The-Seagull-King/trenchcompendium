import React, { useEffect } from 'react';
import {useLocation} from "react-router-dom";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

// only send on prod server
const isProduction = window.location.hostname === 'trench-companion.com';

// allows for manual event triggers
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

    console.log('Tracking manager loaded')

    // Load GA on first load if consent is given
    useEffect(() => {
        if (!isProduction) return;
    }, []);

    // Track page views on every route change
    useEffect(() => {
        console.log('Trying to send page view')

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
