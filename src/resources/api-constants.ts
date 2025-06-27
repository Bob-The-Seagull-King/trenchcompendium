const baseUrl = 'http://exampleurl'

export const getData = (userId: number): string => {
    return baseUrl + '/data/' + userId
}


export const SYNOD = {

    // SYNOD API URL //
    LIVE: 'https://synod.trench-companion.com', // for reference
    DEV: 'http://synod.trench-companion.test', // for reference
    URL: 'https://synod.trench-companion.com', // The currently used API url

    PP_PLAN_MONTH_ID: 'P-1RH12116WR818940FNAVTBDI', // The Plan-ID for the monthly paypal subscription
    PP_PLAN_YEAR_ID: 'P-60U62498HE309964JNAVTCBI', // The Plan-ID for the yearly paypal subscription

    PP_CLIENT_ID: 'AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED', // The API base for Paypal subscription services
    PP_CLIENT_ID_SANDBOX: 'AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED', // For reference
    PP_CLIENT_ID_LIVE: '', // For reference

    PP_API_BASE: 'https://api-m.sandbox.paypal.com', // The API base for Paypal subscription services
    PP_API_SANDBOX: 'https://api-m.sandbox.paypal.com', // for reference
    PP_API_LIVE: 'https://api.paypal.com', // for reference


}