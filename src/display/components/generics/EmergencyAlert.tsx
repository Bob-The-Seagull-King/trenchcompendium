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

//const isProduction = false;
const isProduction = window.location.hostname === 'trench-companion.com';

export const EmergencyAlert: React.FC = () => {
    const [consent, setConsent] = useState<boolean | null>(null);
    const { isLoggedIn, userId, authToken,  loadingUser, SiteUser } = useAuth();



    if (!(!isProduction || SiteUser?.Premium.IsPremium)) return null;

    return (
        <>
            <div className={'AdsManager'}>
                <div className={'Ads-text-below'}>
                    {'⚠️ Due to a high volume of warbands, we are migrating databases. During this time we expect difficulties with creating new warbands, please stand by!'}
                </div>
            </div>

            <div className={'AdsManager-bottom-spacer'}>
            </div>
        </>


    );
};