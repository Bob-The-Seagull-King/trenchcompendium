import { useEffect } from 'react';
import { useAuth } from '../../../utility/AuthContext';

const isProduction = window.location.hostname === 'trench-companion.com';

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

export const AdsManager: React.FC = () => {
    const { SiteUser } = useAuth();

    useEffect(() => {
        if (!isProduction || SiteUser?.Premium.IsPremium) return;

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;

            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                try {
                    window.adsbygoogle.push({});
                    clearInterval(interval);
                } catch (e) {
                    console.error('Adsense error', e);
                }
            }

            if (attempts > 20) {
                clearInterval(interval);
                console.warn('Adsense script not loaded in time');
            }
        }, 250);

        return () => clearInterval(interval);
    }, [SiteUser]);

    if (SiteUser?.Premium.IsPremium) return null;

    return (
        <div className="AdsManager">
            <div className="Ads-text-below">
                ❤️ Support Trench Companion for an ad-free experience
            </div>

            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3744837400491966"
                data-ad-slot="7868779249"   // dein echtes Slot-ID von Google
                data-ad-format="auto"
                data-full-width-responsive="true"
            />

            <div className="AdsManager-bottom-spacer"></div>
        </div>
    );
};
