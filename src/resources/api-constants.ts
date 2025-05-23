const baseUrl = 'http://exampleurl'

export const getData = (userId: number): string => {
    return baseUrl + '/data/' + userId
}


export const SYNOD = {

    // SYNOD API URL //
    LIVE: 'https://synod.trench-companion.com', // for reference
    DEV: 'http://synod.trench-companion.test', // for reference
    URL: 'https://synod.trench-companion.com', // The currently used API url

}