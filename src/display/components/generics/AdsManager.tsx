import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../utility/AuthContext';

// Toggle this to true when you actually want to show your own sticky ad bar.
// While false, AdsManager returns nothing and anchor ads handle the sticky placement.
const ENABLE_STICKY_AD = false;

declare global {
    interface Window {
        adsbygoogle?: unknown[];
        adsenseScriptLoaded?: boolean;
    }
}

type AdSize = { w: number; h: number };

const pickSize = (w: number): AdSize =>
    w >= 1040 ? { w: 970, h: 90 } :
        w >= 740  ? { w: 728, h: 90 } :
            w >= 480  ? { w: 468, h: 60 } :
                { w: 320, h: 50 };

export const AdsManager: React.FC = () => {
    const { SiteUser } = useAuth();

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLModElement | null>(null);

    const [size, setSize] = useState<AdSize>({ w: 320, h: 50 });
    const [key, setKey] = useState(0);
    const pushedRef = useRef(false);

    // NEW: track whether the ad is actually filled
    const [hasAd, setHasAd] = useState(false);

    const isTestHost =
        typeof window !== 'undefined' ? window.location.hostname !== 'trench-companion.com' : false;

    useEffect(() => {
        // When we remount the <ins>, allow a new push and reset 'hasAd' until we know the status
        pushedRef.current = false;
        setHasAd(false);
    }, [key]);

    // Measure container and pick a fixed <=100px tall size
    useEffect(() => {
        const win = (typeof window !== 'undefined' ? window : undefined) as Window | undefined;
        if (!win) return;

        const measure = () => {
            const w = Math.floor(wrapRef.current?.clientWidth ?? win.innerWidth ?? 0);
            const next = pickSize(w);
            if (next.w !== size.w || next.h !== size.h) {
                setSize(next);
                setKey(k => k + 1);
            }
        };

        if ('ResizeObserver' in win && wrapRef.current) {
            const ro = new (win as any).ResizeObserver(() => measure());
            ro.observe(wrapRef.current);
            measure();
            return () => ro.disconnect();
        } else {
            const onResize = () => measure();
            win.addEventListener('resize', onResize);
            measure();
            return () => win.removeEventListener('resize', onResize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size.w, size.h]);

    // Push the ad when ready (same as before)
    useEffect(() => {
        const win = (typeof window !== 'undefined' ? window : undefined) as Window | undefined;
        if (!win) return;
        if (SiteUser?.Premium?.IsPremium) return;

        const tryRenderAd = () => {
            if (pushedRef.current) return;
            if (win.adsbygoogle && Array.isArray(win.adsbygoogle) && slotRef.current) {
                try {
                    win.adsbygoogle.push({});
                    pushedRef.current = true;
                } catch (e) {
                    console.error('AdSense push error:', e);
                }
            }
        };

        if (win.adsenseScriptLoaded) {
            tryRenderAd();
        }

        const onLoaded = (_e: Event) => tryRenderAd();
        win.addEventListener('adsense:loaded' as any, onLoaded as EventListener);

        let attempts = 0;
        const interval = win.setInterval(() => {
            attempts++;
            tryRenderAd();
            if (pushedRef.current || attempts > 80) {
                win.clearInterval(interval);
            }
        }, 250);

        return () => {
            win.removeEventListener('adsense:loaded' as any, onLoaded as EventListener);
            win.clearInterval(interval);
        };
    }, [SiteUser, key]);

    // NEW: observe the <ins> attribute 'data-ad-status' to toggle .has-ad
    useEffect(() => {
        const slot = slotRef.current;
        if (!slot) return;

        // Helper to read current status and update state
        const syncStatus = () => {
            const status = slot.getAttribute('data-ad-status'); // "filled" | "unfilled" | null
            setHasAd(status === 'filled');
        };

        // Initial check (in case it's already filled by the time we attach)
        syncStatus();

        // Watch only the attribute we care about
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'data-ad-status') {
                    syncStatus();
                }
            }
        });

        mo.observe(slot, { attributes: true, attributeFilter: ['data-ad-status'] });

        return () => mo.disconnect();
    }, [key]);

    // If user is Premium OR sticky ads are disabled, do nothing.
    if (SiteUser?.Premium?.IsPremium || !ENABLE_STICKY_AD) {
        return null;
    }

    return (
        <div className={`AdsManager${hasAd ? ' has-ad' : ''}`}>
            <div className="Ads-text-below">
                {/* This helper text disappears once an ad is filled (via .has-ad) */}
                ❤️ Support Trench Companion for an ad-free experience
            </div>

            <div ref={wrapRef} className="AdSlot AdSlot--leader">
                <ins
                    key={key} // remount on size change
                    ref={slotRef}
                    className="adsbygoogle"
                    // exact, policy-safe ad sizes (<=100px tall)
                    style={{ display: 'inline-block', width: size.w, height: size.h }}
                    data-ad-client="ca-pub-3744837400491966"
                    data-ad-slot="7868779249"
                    {...(isTestHost ? ({ 'data-adtest': 'on' } as any) : {})}
                />
            </div>

            <div className="AdsManager-bottom-spacer" />
        </div>
    );
};
