import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Globale Typdefinitionen
 */
declare global {
    interface Window {
        dataLayer: any[];
        gtag?: (...args: any[]) => void; // optional!
        __gtm_loaded?: boolean;
        __ez?: {
            consentManager?: {
                getConsentData?: (cb: (consent: any) => void) => void;
            };
        };
        EzConsentCallback?: (consent: any) => void;
    }
}

// GTM‑Container‑ID
const GTM_ID = "GTM-NFVT7W7X";

// Falls Sie GA4 außerhalb des GTM verwenden, können Sie hier optional
// eine Mess‑ID angeben (beginnend mit "G-"). Standard: leer lassen.
const GA_MEASUREMENT_ID: string | undefined = undefined;

export default function TrackingManagerv2() {
    const consentGrantedRef = useRef(false);
    const gtmLoadedRef = useRef(false);
    const location = useLocation();

    useEffect(() => {
        // DataLayer und gtag Stub initialisieren
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== "function") {
            window.gtag = (...args: any[]) => {
                window.dataLayer.push(args);
            };
        }

        // Consent-Default setzen, bevor Google-Tags geladen werden
        window.gtag?.("consent", "default", {
            ad_storage: "denied",
            analytics_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            wait_for_update: 500,
        });

        // Tag Manager laden (nur einmal)
        if (!window.__gtm_loaded) {
            window.__gtm_loaded = true;
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
            script.onload = () => {
                gtmLoadedRef.current = true;
            };
            document.head.appendChild(script);
        } else {
            gtmLoadedRef.current = true;
        }

        /**
         * Consent‑Update anhand des Ezoic‑Consent‑Objekts.
         * Ezoic übergibt gewöhnlich Booleans für marketing/statistics:contentReference[oaicite:5]{index=5}.
         */
        const applyConsent = (consent: any) => {
            // Bestimmen, ob Analytics/Ads erlaubt sind:
            const analyticsOk =
                typeof consent?.statistics === "boolean"
                    ? consent.statistics
                    : consent?.status === "accepted" ||
                    consent?.status === "given" ||
                    consent?.status === true;
            const marketingOk =
                typeof consent?.marketing === "boolean"
                    ? consent.marketing
                    : analyticsOk;

            // Wenn beide Kategorien (Statistics/Marketing) abgelehnt wurden, bleiben wir bei denied.
            if (analyticsOk || marketingOk) {
                consentGrantedRef.current = true;
                window.gtag?.("consent", "update", {
                    analytics_storage: analyticsOk ? "granted" : "denied",
                    ad_storage: marketingOk ? "granted" : "denied",
                    ad_user_data: marketingOk ? "granted" : "denied",
                    ad_personalization: marketingOk ? "granted" : "denied",
                });

                // optionales Event für GTM, falls Trigger benötigt werden
                window.dataLayer.push({ event: "ezoic_consent_granted" });
                window.dataLayer.push({ event: "consent_sent" });

                // Falls Sie GA4 ohne GTM nutzen: nach Consent gtag.js laden und konfigurieren
                if (GA_MEASUREMENT_ID) {
                    // gtag.js laden (falls noch nicht vorhanden)
                    const existingScript = document.querySelector(
                        `script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`
                    );
                    if (!existingScript) {
                        const gtagScript = document.createElement("script");
                        gtagScript.async = true;
                        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
                        document.head.appendChild(gtagScript);
                    }
                    // gtag initialisieren und GA konfigurieren
                    window.gtag?.("js", new Date());
                    window.gtag?.("config", GA_MEASUREMENT_ID, {
                        // send_page_view: false könnte gesetzt werden, wenn Sie Pageviews selbst steuern
                    });
                }
            }
        };

        // Listener für den benutzerdefinierten Ezoic‑Event
        const listener = (event: Event) => {
            const detail = (event as CustomEvent)?.detail;
            if (detail) {
                applyConsent(detail);
            }
        };
        window.addEventListener("ezoic_consent", listener);

        // Consent direkt abrufen (falls Ezoic‑API vorhanden)
        if (window.__ez?.consentManager?.getConsentData) {
            window.__ez.consentManager.getConsentData((consent: any) => {
                applyConsent(consent);
            });
        }

        // Callback registrieren, falls Ezoic dieses aufruft
        window.EzConsentCallback = applyConsent;

        return () => {
            window.removeEventListener("ezoic_consent", listener);
        };
    }, []);

    // Seitenaufrufe bei URL‑Wechsel an den DataLayer pushen (für GA4 in GTM)
    useEffect(() => {
        // Warten, bis Consent und GTM geladen sind
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (consentGrantedRef.current && gtmLoadedRef.current) {
                const title = document.title?.trim();
                if (title || attempts > 19) {
                    // Push eines page_view Events, das in Ihrem GTM ausgelöst werden kann
                    window.dataLayer.push({
                        event: "page_view",
                        page_path: location.pathname + location.search,
                        page_title: document.title,
                    });
                    clearInterval(interval);
                }
            }
            if (attempts > 20) {
                clearInterval(interval);
            }
        }, 250);
        return () => clearInterval(interval);
    }, [location]);

    return null;
}
