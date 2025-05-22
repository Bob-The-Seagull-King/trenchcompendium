import { useEffect, useState } from 'react';
import { SynodImageCache, SynodImageData } from '../classes/_high_level_controllers/SynodImageCache';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

export function useSynodImageData(imageId: number, size = 'medium'): SynodImageData {

    const [data, setData] = useState<SynodImageData>(() => {
        const key = `${imageId}-${size}`;
        const synodcache : SynodImageCache = SynodImageCache.getInstance();
        return synodcache.imageDataCache[key] || { url: '', sourceTitle: '', sourceUrl: '' };
    });

    useEffect(() => {

        async function runImageCheck() {
            if (!imageId) return;

            const synodcache : SynodImageCache = SynodImageCache.getInstance();

            const key = `${imageId}-${size}`;
            if (synodcache.CheckCache(key)) {
                setData(synodcache.imageDataCache[key]);
                return;
            }

            const synodUrl = 'https://synod.trench-companion.com/';
            synodcache.AddCallCache(key);

            if (synodcache.CheckCallCache(key)) {    
                for (let i = 0; i < 20; i++) {
                    await delay(250);
                    if (synodcache.CheckCache(key)) {                        
                        setData(synodcache.imageDataCache[key])
                    }
                }
            }

            if (!synodcache.CheckCache(key)) {
            fetch(`${synodUrl}wp-json/wp/v2/media/${imageId}`)
                .then((res) => res.json())
                .then((json) => {
                    const sizes = json.media_details?.sizes;
                    const sizedImage = sizes?.[size]?.source_url;

                    const result = {
                        url: sizedImage || json.source_url,
                        sourceTitle: json.meta.attachment_source_title || '',
                        sourceUrl: json.meta.attachment_source || '',
                    };

                    synodcache.AddCache(key,result);
                    setData(result);
                })
                .catch(console.error);
            }
            
        }

        runImageCheck();
    }, [imageId, size]);

    return data;
}