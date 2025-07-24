const baseUrl = 'http://exampleurl'

export const getData = (userId: number): string => {
    return baseUrl + '/data/' + userId
}


export const SYNOD = {

    // SYNOD API URL //
    LIVE: 'https://synod.trench-companion.com', // for reference
    DEV: 'http://synod.trench-companion.test', // for reference
    URL: 'https://synod.trench-companion.com', // The currently used API url

    PLAN_M_NAME: 'Trench Companion Plus - Monthly',
    PLAN_Y_NAME: 'Trench Companion Plus - Yearly',

    PP_PLAN_MONTH_ID: 'P-4YK72240DG152144TNBN7EKI', // The Plan-ID for the monthly paypal subscription
    PP_PLAN_MONTH_ID_SANDBOX: 'P-4YK72240DG152144TNBN7EKI', // Reference
    PP_PLAN_MONTH_ID_LIVE: 'P-1RH12116WR818940FNAVTBDI', // Reference

    PP_PLAN_YEAR_ID: 'P-784241401A144594JNBPII7Q', // The Plan-ID for the yearly paypal subscription
    PP_PLAN_YEAR_ID_SANDBOX: 'P-784241401A144594JNBPII7Q', // Reference
    PP_PLAN_YEAR_ID_LIVE: 'P-60U62498HE309964JNAVTCBI', // Reference

    PP_CLIENT_ID: 'AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED', // The API base for Paypal subscription services
    PP_CLIENT_ID_SANDBOX: 'AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED', // For reference
    PP_CLIENT_ID_LIVE: 'Aec-yU2DQrRWFRDJGWuAErhXFwFfDovX80gsj85SaxsF0bnOxP2GgeLd3wS3Pawk-vN2SwghgVRxKCYn', // For reference

    PP_API_BASE: 'https://api-m.sandbox.paypal.com', // The API base for Paypal subscription services
    PP_API_SANDBOX: 'https://api-m.sandbox.paypal.com', // for reference
    PP_API_LIVE: 'https://api.paypal.com', // for reference


}