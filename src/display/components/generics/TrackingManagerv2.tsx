import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// einheitliche Erweiterung des Window‑Objekts
declare global {
    interface Window {
        dataLayer?: any[];
        gtag?: (...args: any[]) => void;
        __gtm_loaded?: boolean;
        __ez?: {
            consentManager?: {
                getConsentData?: (cb: (consent: any) => void) => void;
            };
        };
        EzConsentCallback?: (consent: any) => void;
        // hier ggf. auch die von Ezoic geforderte _ezconsent‑Variable deklarieren
        // _ezconsent?: any;
    }
}

const GTM_ID = "GTM-NFVT7W7X"; // Deine echte GTM‑ID

export default function TrackingManager() {
    const consentSentRef = useRef(false);
    const gtmLoadedRef = useRef(false);
    const location = useLocation();

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== "function") {
            window.gtag = (...args: any[]) => {
                window.dataLayer!.push(args);
            };
        }



        // GTM‑Snippet einmalig laden
        if (!window.__gtm_loaded) {
            window.__gtm_loaded = true;
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
            script.onload = () => { gtmLoadedRef.current = true; };
            document.head.appendChild(script);
        } else {
            gtmLoadedRef.current = true;
        }

        console.log('applying consent default 1');

        window.gtag?.("consent", "default", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            wait_for_update: 500,
        });
        

        // Funktion zum Aktualisieren des Consent‑Status
        const applyConsent = (consent: any) => {
            console.log('applying consent 1');

            if (
                !consentSentRef.current &&
                (consent?.status === "accepted" ||
                    consent?.status === "given" ||
                    consent?.status === true)
            ) {
                console.log('applying consent 2');

                consentSentRef.current = true;
                window.gtag?.("consent", "update", {
                    ad_storage: "granted",
                    analytics_storage: "granted",
                    ad_user_data: "granted",
                    ad_personalization: "granted",
                });
                window.dataLayer!.push({ event: "ezoic_consent_granted" });
                window.dataLayer!.push({ event: "consent_sent" });

                // -------- WICHTIG! --------
                // GA4 initialisieren
                window.gtag?.("config", GTM_ID, {
                    page_path: window.location.pathname + window.location.search,
                    page_title: document.title,
                });
                // --------------------------

                // ggf. die von Ezoic geforderte _ezconsent‑Variable setzen
                // window._ezconsent = { ... };
            }
        };

        // Event‑Listener für benutzerdefiniertes Ezoic‑Event
        const listener = (event: Event) => {
            const detail = (event as CustomEvent)?.detail;
            if (detail) {
                applyConsent(detail);
            }
        };
        window.addEventListener("ezoic_consent", listener);

        // Consent sofort abrufen, falls Ezoic‑API vorhanden ist
        if (window.__ez?.consentManager?.getConsentData) {
            window.__ez.consentManager.getConsentData((consent: any) => {
                applyConsent(consent);
            });
        }

        window.EzConsentCallback = applyConsent;

        return () => {
            window.removeEventListener("ezoic_consent", listener);
        };
    }, []);

    // Page‑View‑Tracking bei Änderung des Standortes
    useEffect(() => {
        console.log('trying to send page view 1');

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (
                typeof window.gtag === "function" &&
                consentSentRef.current &&
                gtmLoadedRef.current
            ) {
                console.log('trying to send page view 2');

                const title = document.title?.trim();
                if (title || attempts > 19) {
                    setTimeout(() => {
                        if (typeof window.gtag === "function") {
                            console.log('page view is sent now');
                            window.gtag("config", GTM_ID, {
                                page_path: location.pathname + location.search,
                                page_title: document.title,
                            });
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

    return null;
}
