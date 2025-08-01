import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {ROUTES} from "../../../resources/routes-constants";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

// only send on prod server
const isProduction = window.location.hostname === 'trench-companion.com';

// allows for manual event triggers
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

interface ConsentPreferences {
    essential: boolean;
    marketing: boolean,
    tracking: boolean;
}

const DEFAULT_CONSENT: ConsentPreferences = {
    essential: true,
    marketing: false,
    tracking: false
};

const STORAGE_KEY = 'cookie_consent_1';

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

interface TrackingManager {
    forceShow?: number;
}

export const TrackingManager: React.FC<TrackingManager> = ({ forceShow }) => {
    // show the popup
    const [showPopup, setShowPopup] = useState(false);

    // is set when consent is sent -> so the page view gets always sent later
    const hasSentConsent = useRef(false);

    const location = useLocation();

    // consent values
    const [consent, setConsent] = useState<ConsentPreferences>({
        essential: true,
        marketing: false,
        tracking: false
    });

    // Track page views on every route change
    useEffect(() => {
        if (!isProduction) return;

        let attempts = 0;

        console.log('start attempting to set pageview');

        // defer sending
        const interval = setInterval(() => {
            attempts++;

            console.log('attempting to set pageview ' + attempts);
            console.log(window.gtag);
            console.log(hasSentConsent.current);

            // wait for gtag to be loaded and consent to be sent
            if (typeof window.gtag === 'function' && hasSentConsent.current) {
                const title = document.title?.trim();

                console.log('setting pageview at');
                console.log(location.pathname);
                console.log(document.title);

                // wait for document title or after long loads
                if( title || attempts > 19 ) {
                    const timeout = setTimeout(() => {
                        if (typeof window.gtag === 'function') {
                            window.gtag('event', 'page_view', {
                                page_path: location.pathname + location.search,
                                page_title: document.title,
                            });

                            console.log('pageview was set');
                        }
                    }, 200);
                    clearInterval(interval);

                }
            } else if (attempts > 20) {
                clearInterval(interval);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [location]);


    // Force to show popup on click of a button
    useEffect(() => {
        if (forceShow) {
            setShowPopup(true);
        }
    }, [forceShow]);

    // get stored consent
    useEffect(() => {
        const stored = getStoredConsent();

        if (stored) {
            setConsent(stored);
            applyConsent(stored);
        } else { // show popup if no stored consent exists
            setShowPopup(true);
        }
    }, []);

    // handle click accept all
    const handleAcceptAll = () => {
        const updated = { essential: true, tracking: true, marketing: true };
        storeConsent(updated);
        setConsent(updated);
        applyConsent(updated);
        setShowPopup(false);
    };

    // handle click accept some
    const handleAcceptSome = () => {
        storeConsent(consent);
        applyConsent(consent);
        setShowPopup(false);
    };

    // applies the consent
    const applyConsent = ( thisConsent: ConsentPreferences ) => {
        console.log('trying to apply consent');

        if (
            typeof window.gtag === 'function'
        ) {
            console.log('applying consent');

            window.gtag('consent', 'update', {
                ad_storage: thisConsent.marketing ? 'granted' : 'denied',
                analytics_storage: thisConsent.essential ? 'granted' : 'denied',
                ad_user_data: thisConsent.marketing ? 'granted' : 'denied',
                ad_personalization: thisConsent.marketing ? 'granted' : 'denied',
                functionality_storage: thisConsent.tracking ? 'granted' : 'denied',
                personalization_storage: thisConsent.tracking ? 'granted' : 'denied',
                security_storage: thisConsent.tracking ? 'granted' : 'denied'
            });

            window.gtag('event', 'consent_sent');

            hasSentConsent.current = true;
        }
    }



    // changes of checkboxes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;

        if (id === 'tracking') {
            setConsent(prev => ({ ...prev, tracking: checked }));
        }
        if (id === 'marketing') {
            setConsent(prev => ({ ...prev, marketing: checked }));
        }

    };



    // return the privacy modal maybe
    if (!showPopup) return null;

    return (
        <Modal className={'privacy-popup'} show={showPopup} onHide={ () => setShowPopup(false)}>
            <div className="privacy-popup-inner">
                <h3>{'We value your privacy'}</h3>
                <p>
                    {'We use cookies and similar technologies from third parties like Google to analyze our website (e.g., with Google Analytics) and display personalized advertising (e.g., via Google Ads or the Meta Pixel).\n' +
                        'With your consent, data such as IP addresses, device information, or your usage behavior may be processed and shared with our advertising partners.\n' +
                        'You can find more information on how Google uses data here:\n'}
                    <a href={"https://business.safety.google/privacy/"} target="_blank"
                       rel="noopener noreferrer nofollow">
                        {'How Google uses data when you use our partners’ sites or apps'}
                    </a>

                    <br/>
                    <br/>
                    {'Your consent is voluntary and can be withdrawn at any time. For details, please refer to our '}
                    <a href={ROUTES.PAGE_PRIVCACY}>
                        {'privacy policy'}
                    </a>
                    {'.'}
                    <br/>

                </p>

                <div className={'my-3 tracking-options'}>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="essential"
                            checked={true}
                            disabled
                        />
                        <label className="form-check-label" htmlFor="essential">
                            {'Necessary'}

                            <OverlayTrigger
                                placement={'top-end'}
                                trigger={['hover', 'focus']}
                                rootClose
                                overlay={
                                    <Popover.Body bsPrefix="credit"
                                                  className="popover cmp-info-popover"
                                                  id="tooltip"
                                    >
                                        {'These cookies are technically necessary for the operation of our website. They enable essential functions such as site navigation, access to secure areas, and order and payment processes in the online shop. Without these cookies, our website cannot function properly.'}
                                    </Popover.Body>
                                }>

                                    <span className={'cmp-info-trigger'}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} className={'cmp-info-trigger-icon'}/>
                                    </span>
                            </OverlayTrigger>

                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="tracking"
                            checked={consent.tracking}
                            onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="tracking">
                            {'Statistics'}

                            <OverlayTrigger
                                placement={'top-end'}
                                trigger={['hover', 'focus']}
                                rootClose
                                overlay={
                                    <Popover.Body bsPrefix="credit"
                                                  className="popover cmp-info-popover"
                                                  id="tooltip"
                                    >
                                        {'With your consent, we use analytics tools such as Google Analytics 4 and Usermaven to better understand user behavior on our website. This involves processing information such as pages viewed, time spent on the site, and interactions. The data helps us optimize our website. Google Analytics anonymizes IP addresses within the EU. Data processing by Google may occur in third countries (e.g., the USA).'}
                                    </Popover.Body>
                                }>

                                    <span className={'cmp-info-trigger'}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} className={'cmp-info-trigger-icon'}/>
                                    </span>
                            </OverlayTrigger>

                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="marketing"
                            checked={consent.marketing}
                            onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="marketing">
                            {'Marketing'}

                            <OverlayTrigger
                                placement={'top-end'}
                                trigger={['hover', 'focus']}
                                rootClose
                                overlay={
                                    <Popover.Body bsPrefix="credit"
                                                  className="popover cmp-info-popover"
                                                  id="tooltip"
                                    >
                                        {'With your consent, we use marketing technologies such as Google Ads, Google Remarketing, the Meta Pixel, and HubSpot to display relevant advertisements to visitors and measure the success of our advertising campaigns. This may involve the creation of user profiles and the sharing of data such as IP address, device type, or visited pages with our advertising partners. These tools also enable retargeting on other platforms. Data processing in third countries such as the USA is possible.'}
                                    </Popover.Body>
                                }>

                                    <span className={'cmp-info-trigger'}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} className={'cmp-info-trigger-icon'}/>
                                    </span>
                            </OverlayTrigger>

                        </label>
                    </div>
                </div>


                <div className="privacy-popup-actions">
                    <button className="btn btn-primary btn-block" onClick={handleAcceptAll}>Accept All</button>
                    <button className="btn btn-secondary btn-block" onClick={handleAcceptSome}>Accept selected</button>
                </div>
            </div>
        </Modal>
    );
};
