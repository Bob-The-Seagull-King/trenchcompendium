import React, { useEffect, useState } from 'react';
import {useAuth} from "../../../utility/AuthContext";

declare global {
    interface Window {
        ezstandalone?: {
            cmd: Array<() => void>;
            showAds: (id: number) => void;
        };
    }
}

// const isProduction = true;
const isProduction = window.location.hostname === 'trench-companion.com';

export const AdsManager: React.FC = () => {
    const [consent, setConsent] = useState<boolean | null>(null);
    const { isLoggedIn, userId, authToken,  loadingUser, SiteUser } = useAuth();


    // Show ads in placeholder - check if this is needed?
    useEffect(() => {
        if (!isProduction ) return;

        if (typeof window.ezstandalone !== 'undefined' && window.ezstandalone.cmd) {
            window.ezstandalone?.cmd.push(() => {
                window.ezstandalone?.showAds(118);
            });
        }
    }, [consent]);

    if (!isProduction || SiteUser?.Premium.IsPremium) return null;

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