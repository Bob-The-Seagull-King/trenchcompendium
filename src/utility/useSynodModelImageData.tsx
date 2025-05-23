// Hook: useSynodModelImageData
import { ModelImageData, SynodImageCache } from '../classes/_high_level_controllers/SynodImageCache';
import { useEffect, useState, useRef } from 'react';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));


export function initSynodModelImageData(modelSlug: string, size = 'full'): ModelImageData {
    
    const synodcache : SynodImageCache = SynodImageCache.getInstance();    
    const key = `${modelSlug}-${size}`;

    if (synodcache.CheckModelCache(key)) {
        return synodcache.imageModelCache[key];
    }
    return {
            url: '',
            sourceTitle: '',
            sourceUrl: '',
            imageId: 0,
            modelName: '',
            modelId: 0,
            loading: true,
            error: false,
        };
}

export async function useSynodModelImageData(modelSlug: string, size = 'full'): Promise<ModelImageData> {


    let data : ModelImageData = {
            url: '',
            sourceTitle: '',
            sourceUrl: '',
            imageId: 0,
            modelName: '',
            modelId: 0,
            loading: true,
            error: false,
        };

    if (!modelSlug) {return data;}

    const synodcache : SynodImageCache = SynodImageCache.getInstance();
    const key = `${modelSlug}-${size}`;
    if (synodcache.CheckModelCache(key)) {
        data = synodcache.imageModelCache[key]
        return data;
    }

    const synodUrl = 'https://synod.trench-companion.com/';

    if (synodcache.CheckModelCallCache(key)) {    
        const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one image, just give up
        let count_check = 0;
        while ((!synodcache.CheckModelCache(key)) && (count_check < EMERGENCY_OUT)) {
            await delay(100);
            count_check += 1;
        }    
        if (synodcache.CheckModelCache(key)) {
            return synodcache.imageModelCache[key]
        }               
    }

    if (!synodcache.CheckModelCache(key)) {
        synodcache.AddModelCallCache(key);
        const response : Response = await fetch(`${synodUrl}wp-json/synod/v1/model-image/${modelSlug}`)

        if (response) {
            console.log(response)
            const json : any = await response.json();
            console.log(json)
            const sizes = json.image?.media_details?.sizes;
            const sizedImage = sizes?.[size]?.source_url;

            const result: ModelImageData = {
                url: sizedImage || json.image?.source_url || '',
                sourceTitle: json.image?.meta.attachment_source_title || '',
                sourceUrl: json.image?.meta.attachment_source || '',
                imageId: json.image?.id || 0,
                modelName: json.model_name || '',
                modelId: json.model_id || 0,
                loading: false,
                error: !json.image || !json.image?.source_url,
            };
            console.log("DASHKJDHS")
            console.log(result)
            synodcache.AddModelCache(key, result);
            return synodcache.imageModelCache[key];
        }
    } else {
        return synodcache.imageModelCache[key];
    }

    return data;
}