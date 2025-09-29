import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../utility/AuthContext';

declare global {
    interface Window {
        adsbygoogle?: unknown[];
        adsenseScriptLoaded?: boolean; // set true by your Klaro loader
    }
}

// Horizontal <=100px sizes we support
type AdSize = { w: number; h: number };

// Pick a valid <=100px size for a given container width
const pickSize = (w: number): AdSize =>
    w >= 1040 ? { w: 970, h: 90 } :
        w >= 740  ? { w: 728, h: 90 } :
            w >= 480  ? { w: 468, h: 60 } :
                { w: 320, h: 50 };

export const AdsManager: React.FC = () => {
    const { SiteUser } = useAuth();

    // Measure the container, not the viewport
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLModElement | null>(null); // <ins> element

    // Start with a safe default; updated on mount/resize
    const [size, setSize] = useState<AdSize>({ w: 320, h: 50 });

    // Changing `key` forces <ins> to remount → new adsbygoogle.push({})
    const [key, setKey] = useState(0);

    // Ensure we only push once per <ins> mount
    const pushedRef = useRef(false);

    // Detect host for test creatives (no top-level window access to keep SSR-safe)
    const isTestHost =
        typeof window !== 'undefined' ? window.location.hostname !== 'trench-companion.com' : false;

    // Reset push flag when we remount the <ins>
    useEffect(() => {
        pushedRef.current = false;
    }, [key]);

    // Measure container width and bucket into <=100px sizes
    useEffect(() => {
        const win = (typeof window !== 'undefined' ? window : undefined) as
            | (Window & typeof globalThis)
            | undefined;
        if (!win) return; // SSR safety

        const measure = () => {
            const cw = wrapRef.current?.clientWidth ?? win.innerWidth ?? 0;
            const w = Math.floor(cw);
            const next = pickSize(w);
            if (next.w !== size.w || next.h !== size.h) {
                setSize(next);
                setKey(k => k + 1); // force <ins> remount so we can push again
            }
        };

        // Prefer ResizeObserver for layout changes
        const hasRO = typeof (win as any).ResizeObserver !== 'undefined';
        if (hasRO && wrapRef.current) {
            const RO: typeof ResizeObserver = (win as any).ResizeObserver;
            const ro = new RO(() => measure());
            ro.observe(wrapRef.current);
            // initial
            measure();
            return () => ro.disconnect();
        }

        // Fallback to window resize
        const onResize = () => measure();
        win.addEventListener('resize', onResize);
        // initial
        measure();
        return () => win.removeEventListener('resize', onResize);
        // Dependencies: do NOT include wrapRef.current; it isn't stable and
        // causes needless re-subscriptions. We rely on RO/resize to re-measure.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size.w, size.h]);

    // Push the ad when AdSense is ready and the slot is mounted
    useEffect(() => {
        const win = (typeof window !== 'undefined' ? window : undefined) as
            | (Window & typeof globalThis)
            | undefined;
        if (!win) return; // SSR safety
        if (SiteUser?.Premium?.IsPremium) return;

        const tryRenderAd = () => {
            if (pushedRef.current) return;
            if (win.adsbygoogle && Array.isArray(win.adsbygoogle) && slotRef.current) {
                try {
                    win.adsbygoogle.push({});
                    pushedRef.current = true;
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error('AdSense push error:', e);
                }
            }
        };

        // 1) Try immediately if loader already injected the script
        if (win.adsenseScriptLoaded) {
            tryRenderAd();
        }

        // 2) Listen for your custom loader event (typed to avoid TS issues)
        const onLoaded = (_e: Event) => tryRenderAd();
        win.addEventListener('adsense:loaded' as any, onLoaded as EventListener);

        // 3) Fallback polling to cover rare timing races
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

    if (SiteUser?.Premium?.IsPremium) return null;

    return (
        <div className="AdsManager">
            <div className="Ads-text-below">
                {/* Keep copy short to minimize layout movement */}
                ❤️ Support Trench Companion for an ad-free experience
            </div>

            {/* This wrapper is what we measure for choosing the size */}
            <div ref={wrapRef} className="AdSlot AdSlot--leader">
                <ins
                    key={key}                 // force remount on size change
                    ref={slotRef}
                    className="adsbygoogle"
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
