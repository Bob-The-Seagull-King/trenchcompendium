import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        ezstandalone?: {
            cmd: Array<() => void>;
            showAds: (id: number) => void;
        };
    }
}

const COOKIE_KEY = 'ezoic_ads_consent';
const isProduction = false;
// const isProduction = window.location.hostname === 'trench-companion.com';

export const AdsManager: React.FC = () => {
    const [consent, setConsent] = useState<boolean | null>(null);

    console.log(consent);

    useEffect(() => {
        if (!isProduction) return;

        const val = localStorage.getItem(COOKIE_KEY);
        setConsent(val === 'true');
    }, []);

    useEffect(() => {
        if (!isProduction ) return;

        if (typeof window.ezstandalone !== 'undefined' && window.ezstandalone.cmd) {
            window.ezstandalone?.cmd.push(() => {
                window.ezstandalone?.showAds(118);
            });
        }
    }, [consent]);

    if (!isProduction) return null;

    return (
        <>
            <div className={'AdsManager'}>
                <div className={'Ads-text-below'}>
                    {'❤️ Support Trench Companion for an ad-free experience'}
                </div>

                <div
                    id="ezoic-pub-ad-placeholder-118"
                    className={'ads-placeholder'}
                />
            </div>

            <div className={'AdsManager-bottom-spacer'}>
            </div>
        </>


    );
};