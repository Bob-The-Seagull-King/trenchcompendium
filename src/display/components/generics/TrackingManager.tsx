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

    // Track page views on every route change
    useEffect(() => {
        if (!isProduction) return;

        let attempts = 0;
        console.log('trying to send pageview 1');

        const interval = setInterval(() => {
            console.log('trying to send pageview 2');

            attempts++;
            if (typeof window.gtag === 'function') {
                console.log('trying to send pageview 3');

                window.gtag('event', 'page_view', {
                    page_path: location.pathname + location.search,
                    page_title: document.title,
                });
                clearInterval(interval);
            } else if (attempts > 20) {
                clearInterval(interval);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [location]);

    return null; // invisible component
};
