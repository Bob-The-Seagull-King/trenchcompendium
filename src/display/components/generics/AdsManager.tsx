import { useEffect, useRef } from 'react';
import { useAuth } from '../../../utility/AuthContext';

const host = window.location.hostname;
const isLiveHost = host === 'trench-companion.com';
const isTestHost = !isLiveHost;

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
        if (SiteUser?.Premium?.IsPremium) return;

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

                {/* Wrapper begrenzt die max. Breite → AdSense wählt flaches Format */}
                <div className="AdSlot AdSlot--leader">
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-client="ca-pub-3744837400491966"
                        data-ad-slot="7868779249"
                        data-ad-format="horizontal"                 // ⬅️ flache Ads
                        data-full-width-responsive="true"
                        {...(isTestHost ? { 'data-adtest': 'on' } as any : {})}
                    />
                </div>
            </div>

            <div className="AdsManager-bottom-spacer"></div>
        </>
    );
};
