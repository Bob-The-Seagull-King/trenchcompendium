import { useEffect, useState } from 'react';
import { SynodImageCache, SynodImageData } from '../classes/_high_level_controllers/SynodImageCache';

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

            /*if (synodcache.CheckCallCache(key)) {
                while (!synodcache.CheckCache(key)) {
                    setTimeout('', 100);
                }
                setData(synodcache.imageDataCache[key])
            } else {
                
            }*/
        }

        runImageCheck();
    }, [imageId, size]);

    return data;
}