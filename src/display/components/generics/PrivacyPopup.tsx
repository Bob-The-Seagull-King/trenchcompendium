import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";

interface ConsentPreferences {
    essential: boolean;
    tracking: boolean;
}

const DEFAULT_CONSENT: ConsentPreferences = {
    essential: true,
    tracking: false
};

const STORAGE_KEY = 'cookie_consent';

const getStoredConsent = (): ConsentPreferences | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const storeConsent = (consent: ConsentPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
};

interface PrivacyPopupProps {
    forceShow?: boolean;
}

const PrivacyPopup: React.FC<PrivacyPopupProps> = ({ forceShow }) => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (forceShow) {
            setShowPopup(true);
        }
    }, [forceShow]);

    useEffect(() => {
        const stored = getStoredConsent();
        if (!stored) setShowPopup(true);
    }, []);

    const handleAcceptAll = () => {
        storeConsent({ essential: true, tracking: true });
        setShowPopup(false);
    };

    const handleRejectAll = () => {
        storeConsent({ essential: true, tracking: false });
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <div className="privacy-popup">
            <div className="privacy-popup-inner">
                <h3>{'We value your privacy'}</h3>
                <p>
                    {'We use cookies to enhance site navigation, analyze site usage, and support personalized content and features. We only use non-essential cookies (e.g. for analytics) if you give your consent. You can change your preferences at any time.'}
                    <br/>
                    <br/>
                    {'Additional information can be found in our '}
                    <a href={'/privacy'}>
                        {'privacy dislcaimer'}
                    </a>
                    <br/>
                </p>
                <div className="privacy-popup-actions">
                    <button className="btn btn-primary btn-block" onClick={handleAcceptAll}>Accept All</button>
                    <button className="btn btn-secondary btn-block" onClick={handleRejectAll}>Accept Essential</button>
                </div>
            </div>
        </div>
    );
};

export const hasConsent = (type: keyof ConsentPreferences): boolean => {
    const stored = getStoredConsent();
    return stored ? stored[type] : false;
};

export default PrivacyPopup;
