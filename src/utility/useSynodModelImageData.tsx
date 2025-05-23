// Hook: useSynodModelImageData
import { ModelImageData, SynodImageCache } from '../classes/_high_level_controllers/SynodImageCache';
import { useEffect, useState, useRef } from 'react';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

export function useSynodModelImageData(modelSlug: string, size = 'full'): ModelImageData {

    const [data, setData] = useState<ModelImageData>(() => {
        const key = `${modelSlug}-${size}`;
        const synodcache : SynodImageCache = SynodImageCache.getInstance();
        return synodcache.imageModelCache[key] || {
            url: '',
            sourceTitle: '',
            sourceUrl: '',
            imageId: 0,
            modelName: '',
            modelId: 0,
            loading: true,
            error: false,
        };
    });

    useEffect(() => {
        async function runImageCheck() {
            if (!modelSlug) return;


            const synodcache : SynodImageCache = SynodImageCache.getInstance();

            const key = `${modelSlug}-${size}`;
            if (synodcache.CheckModelCache(key)) {
                setData(synodcache.imageModelCache[key]);
                return;
            }

            if (synodcache.imageModelCache[key]) {
                setData(synodcache.imageModelCache[key]);
                return;
            }

            const synodUrl = 'https://synod.trench-companion.com/';

            if (synodcache.CheckModelCallCache(key)) {    
                const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one image, just give up
                let count_check = 0;
                while ((!synodcache.CheckModelCache(key)) && (count_check < EMERGENCY_OUT)) {
                    await delay(100);
                    count_check += 1;
                }                   
                setData(synodcache.imageModelCache[key])
            }

            if (!synodcache.CheckModelCache(key)) {
                synodcache.AddModelCallCache(key);
                fetch(`${synodUrl}wp-json/synod/v1/model-image/${modelSlug}`)
                    .then((res) => {
                        if (!res.ok) throw new Error('Network response was not ok');
                        return res.json();
                    })
                    .then((json) => {
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

                        synodcache.AddModelCache(modelSlug, result);
                        setData(result);
                    })
                    .catch(() => {
                        setData(prev => ({ ...prev, loading: false, error: true }));
                    });
            }
        }

        runImageCheck();
    }, [modelSlug, size]);


    return data;
}