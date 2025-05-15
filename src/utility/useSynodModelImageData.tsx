// Hook: useSynodModelImageData
import { useEffect, useState, useRef } from 'react';


/**
 * Gets synod image data for a model by its slug
 */


interface ModelImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    modelName: string;
    modelId: number;
    loading: boolean;
    error: boolean;
}

// in-memory cache
const modelImageCache: Record<string, ModelImageData> = {};

export function useSynodModelImageData(modelSlug: string, size = 'full'): ModelImageData {
    const fetchedRef = useRef<Record<string, boolean>>({}); // track fetched slugs

    const [data, setData] = useState<ModelImageData>(() => {
        return modelImageCache[modelSlug] || {
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
        if (!modelSlug) return;

        if (fetchedRef.current[modelSlug]) return; // prevent double fetch
        fetchedRef.current[modelSlug] = true;

        if (modelImageCache[modelSlug]) {
            setData({ ...modelImageCache[modelSlug], loading: false });
            return;
        }

        const synodUrl = 'https://synod.trench-companion.com/';

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

                modelImageCache[modelSlug] = result;
                setData(result);
            })
            .catch(() => {
                setData(prev => ({ ...prev, loading: false, error: true }));
            });
    }, [modelSlug, size]);


    return data;
}