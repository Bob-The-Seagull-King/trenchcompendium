export interface SynodImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
}

export interface SynodProfilePicData {
    urls: any; // Record<string, string>
    id: number; // the identifier of the image post
    image_id: number // the id of the image
    source_url: string // source url for credits
    source_title: string  // source title for credits
}

/**
 * Gets synod image data for a model by its slug
 */
export interface ModelImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    modelName: string;
    modelId: number;
    loading: boolean;
    error: boolean;
}

/**
 * Gets synod image data for a faction by its slug
 */
export interface FactionImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    factionName: string;
    factionId: number;
    loading: boolean;
    error: boolean;
}

/**
 * Stores image data from the Synod, to prevent excessive
 * calls from being made by a single app instance.
 */
class SynodImageCache {
   
    private static instance: SynodImageCache;    // basic in-memory cache
    
    // Gets the single instance of the cache
    public static getInstance(): SynodImageCache {
        if (!SynodImageCache.instance) {
            SynodImageCache.instance = new SynodImageCache();
        }
        return SynodImageCache.instance;
    }

    // BASIC IMAGES
    imageDataCache: Record<string, SynodImageData> = {}; // Cache of image data
    callCache: Record<string, boolean> = {}; // Images that haven't been found, but are currently already being searched for
    
    public CheckCache(key : string) { return (this.imageDataCache[key]) } // Sees if an image is in the cache
    public CheckCallCache(key : string) { return (this.callCache[key]) } // Sees if an image is in the process of being found

    public AddCache(key : string, data : SynodImageData) { this.imageDataCache[key] = data; } // Adds an image to the cache
    public AddCallCache(key : string) { this.callCache[key] = true; } // Adds an identifier when the call for an image is first made

    // MODEL IMAGES
    imageModelCache: Record<string, ModelImageData> = {}; // Cache of image data
    callModelCache: Record<string, boolean> = {}; // Images that haven't been found, but are currently already being searched for
    
    public CheckModelCache(key : string) { return (this.imageModelCache[key]) } // Sees if an image is in the cache
    public CheckModelCallCache(key : string) { return (this.callModelCache[key]) } // Sees if an image is in the process of being found

    public AddModelCache(key : string, data : ModelImageData) { this.imageModelCache[key] = data; } // Adds an image to the cache
    public AddModelCallCache(key : string) { this.callModelCache[key] = true; } // Adds an identifier when the call for an image is first made

    // FACTION IMAGES
    imageFactionCache: Record<string, FactionImageData> = {}; // Cache of image data
    callFactionCache: Record<string, boolean> = {}; // Images that haven't been found, but are currently already being searched for
    
    public CheckFactionCache(key : string) { return (this.imageFactionCache[key]) } // Sees if an image is in the cache
    public CheckFactionCallCache(key : string) { return (this.callFactionCache[key]) } // Sees if an image is in the process of being found

    public AddFactionCache(key : string, data : FactionImageData) { this.imageFactionCache[key] = data; } // Adds an image to the cache
    public AddFactionCallCache(key : string) { this.callFactionCache[key] = true; } // Adds an identifier when the call for an image is first made

    // PROFILE PIC IMAGES
    imageProfileCache: Record<string, SynodProfilePicData> = {}; // Cache of image data
    callProfileCache: Record<string, boolean> = {}; // Images that haven't been found, but are currently already being searched for
    
    public CheckProfileCache(key : string) { return (this.imageProfileCache[key]) } // Sees if an image is in the cache
    public CheckProfileCallCache(key : string) { return (this.callProfileCache[key]) } // Sees if an image is in the process of being found

    public AddProfileCache(key : string, data : SynodProfilePicData) { this.imageProfileCache[key] = data; } // Adds an image to the cache
    public AddProfileCallCache(key : string) { this.callProfileCache[key] = true; } // Adds an identifier when the call for an image is first made

}

export {SynodImageCache}