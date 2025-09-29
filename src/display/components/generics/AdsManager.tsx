import { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';

const isProduction = window.location.hostname === 'trench-companion.com';
// const isProduction = true;

declare global {
    interface Window {
        adsbygoogle?: unknown[];
        adsenseScriptLoaded?: boolean;
    }
}

export const AdsManager: React.FC = () => {
    const { SiteUser } = useAuth();
    const pushedRef = useRef(false); // sicherstellen, dass wir nur einmal pushen pro Slot-Mount

    useEffect(() => {
        if (!isProduction || SiteUser?.Premium?.IsPremium) return;

        const tryRenderAd = () => {
            if (pushedRef.current) return;
            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                try {
                    window.adsbygoogle.push({});
                    pushedRef.current = true;
                } catch (e) {
                    console.error('Adsense render error', e);
                }
            }
        };

        // 1) Direkt probieren, falls Script schon da
        if (window.adsenseScriptLoaded) {
            tryRenderAd();
        }

        // 2) Auf das globale Event hören
        const onLoaded = () => tryRenderAd();
        window.addEventListener('adsense:loaded', onLoaded);

        // 3) Kleiner Fallback (falls Event verpasst wurde)
        let attempts = 0;
        const interval = window.setInterval(() => {
            attempts++;
            tryRenderAd();
            if (pushedRef.current || attempts > 40) { // ~10s
                window.clearInterval(interval);
            }
        }, 250);

        return () => {
            window.removeEventListener('adsense:loaded', onLoaded);
            window.clearInterval(interval);
        };
    }, [SiteUser]);

    if (SiteUser?.Premium?.IsPremium) return null;

    return (
        <>
            <div className="AdsManager">
                <div className="Ads-text-below">
                    ❤️ Support Trench Companion for an ad-free experience
                </div>

                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-3744837400491966"
                    data-ad-slot="7868779249"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    {...(!isProduction ? { 'data-adtest': 'on' } : {})}
                />
            </div>

            <div className="AdsManager-bottom-spacer"></div>
        </>
    );
};
