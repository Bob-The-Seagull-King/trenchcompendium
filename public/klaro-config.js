// increment storageName name to force new user consent
var klaroConfig = {
    elementID: 'privacy-modal',
    storageMethod: 'localStorage',
    storageName: 'trench_companion_consent_v2',
    mustConsent: true,
    acceptAll: true,
    hideDeclineAll: false,
    privacyPolicy: 'https://trench-companion.com/page/privacy',
    noCss: true,
    translations: {
        de: {
            consentNotice: {
                title: 'Wir respektieren Ihre Privatsphäre',
                description: 'Wir nutzen Cookies, um unsere Website zu verbessern (Statistik) und Werbung anzuzeigen.',
            },
            consentModal: {
                title: 'Datenschutz-Einstellungen',
            },
            purposes: {
                functional: 'Notwendig',
                statistics: 'Statistik',
                advertising: 'Marketing',
            },
        },
    },
    services: [
        {
            name: 'google-tag-manager',
            title: 'Google Tag Manager',
            required: true,
            purposes: ['functional'],
            onInit: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){ dataLayer.push(arguments); };
                gtag('consent', 'default', {
                  ad_storage: 'granted',
                  analytics_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
                });
                gtag('set', 'ads_data_redaction', true);
            `,
            onAccept: `
                if (!window.gtmScriptLoaded) {
                    var s = document.createElement('script');
                    s.async = true;
                    s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NFVT7W7X";
                    document.head.appendChild(s);
                    window.gtmScriptLoaded = true;
                }
            `
        },
        {
            name: 'google-analytics',
            title: 'Google Analytics 4',
            purposes: ['statistics'],
            onAccept: `
                gtag('consent', 'update', { analytics_storage: 'granted' });
            `,
            onDecline: `
                gtag('consent', 'update', { analytics_storage: 'denied' });
            `,
            cookies: [/^_ga(_.*)?/],
        },
        {
            name: 'google-ads',
            title: 'Google Ads (Personalisierung)',
            purposes: ['advertising'],
            onAccept: `
                gtag('consent', 'update', {
                  ad_user_data: 'granted',
                  ad_personalization: 'granted'
                });
                gtag('set', 'ads_data_redaction', false);
            `,
            onDecline: `
                gtag('consent', 'update', {
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
                });
                gtag('set', 'ads_data_redaction', true);
            `,
        },
        {
            name: 'google-adsense',
            title: 'Google AdSense',
            purposes: ['advertising'],
            required: true, // immer laden!
            onInit: `
                if (!window.adsenseScriptLoaded) {
                    var s = document.createElement('script');
                    s.async = true;
                    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3744837400491966";
                    s.crossOrigin = "anonymous";
                    document.head.appendChild(s);
                    window.adsenseScriptLoaded = true;
                }
            `,
        }
    ]
};
