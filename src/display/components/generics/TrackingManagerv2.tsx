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

const GTM_ID = "GTM‑NFVT7W7X"; // Deine echte GTM‑ID

export default function TrackingManager() {
    const consentSentRef = useRef(false);
    const location = useLocation();

    useEffect(() => {
        // dataLayer und gtag initialisieren
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== "function") {
            window.gtag = (...args: any[]) => {
                window.dataLayer!.push(args);
            };
        }

        // Default‑Consent (Consent Mode v2) setzen
        window.gtag?.("consent", "default", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            wait_for_update: 500,
        });

        // GTM‑Snippet einmalig laden
        if (!window.__gtm_loaded) {
            window.__gtm_loaded = true;
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
            document.head.appendChild(script);
        }

        // Funktion zum Aktualisieren des Consent‑Status
        const applyConsent = (consent: any) => {
            if (
                !consentSentRef.current &&
                (consent?.status === "accepted" ||
                    consent?.status === "given" ||
                    consent?.status === true)
            ) {
                consentSentRef.current = true;
                window.gtag?.("consent", "update", {
                    ad_storage: "granted",
                    analytics_storage: "granted",
                    ad_user_data: "granted",
                    ad_personalization: "granted",
                });
                window.dataLayer!.push({ event: "ezoic_consent_granted" });

                // ggf. die von Ezoic geforderte _ezconsent‑Variable setzen
                // window._ezconsent = { ... };
            }
        };

        // Event‑Listener für benutzerdefiniertes Ezoic‑Event
        const listener = (event: Event) => {
            // Typische Ezoic‑Events haben ein detail‑Feld
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

        // Globale Callback‑Funktion definieren, falls Ezoic sie aufruft
        window.EzConsentCallback = applyConsent;

        return () => {
            window.removeEventListener("ezoic_consent", listener);
        };
    }, []);

    // Page‑View‑Tracking bei Änderung des Standortes
    useEffect(() => {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;

            // gtag muss definiert und Consent gesendet worden sein
            if (typeof window.gtag === "function" && consentSentRef.current) {
                const title = document.title?.trim();
                // auf aussagekräftigen Titel warten oder nach mehreren Versuchen fortfahren
                if (title || attempts > 19) {
                    const timeout = setTimeout(() => {
                        if (typeof window.gtag === "function") {
                            window.gtag("event", "page_view", {
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
