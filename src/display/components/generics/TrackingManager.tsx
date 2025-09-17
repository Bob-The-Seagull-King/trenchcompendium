import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const isProduction = window.location.hostname === 'trench-companion.com';

// ganz oben
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window.gtag === 'function') {
        const eventData: Record<string, any> = { event_category: category, event_label: label };
        if (typeof value === 'number') {
            eventData.value = value;
            eventData.currency = 'USD';
        }
        window.gtag('event', action, eventData);
    }
};

export const TrackingManager: React.FC = () => {
    const location = useLocation();

    // send page views on route change
    useEffect(() => {
        if (!isProduction) return;

        const sendPageView = () => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', {
                    page_path: location.pathname + location.search,
                    page_title: document.title
                });
            }
        };
        // Warte kurz, bis Titel gesetzt ist und GTM/GA geladen ist
        const timeout = setTimeout(sendPageView, 200);
        return () => clearTimeout(timeout);
    }, [location]);

    return null;
};
