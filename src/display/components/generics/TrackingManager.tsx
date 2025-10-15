// src/display/components/generics/TrackingManager.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const isProduction =
    typeof window !== 'undefined' && window.location.hostname === 'trench-companion.com';

export const TrackingManager: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (!isProduction) return;

        const pushPV = () => {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: 'page_view',
                page_location: window.location.href,
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        };

        // kurz warten, bis Title/Route/Consent sicher stehen
        const t = setTimeout(pushPV, 150);
        return () => clearTimeout(t);
    }, [location]);

    return null;
};
