import { useEffect, useState } from 'react';

interface SynodImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
}

// basic in-memory cache
const imageDataCache: Record<string, SynodImageData> = {};

export function useSynodImageData(imageId: number, size = 'medium'): SynodImageData {
    const [data, setData] = useState<SynodImageData>(() => {
        const key = `${imageId}-${size}`;
        return imageDataCache[key] || { url: '', sourceTitle: '', sourceUrl: '' };
    });

    useEffect(() => {
        if (!imageId) return;

        const key = `${imageId}-${size}`;
        if (imageDataCache[key]) {
            setData(imageDataCache[key]);
            return;
        }

        const synodUrl = 'https://synod.trench-companion.com/';

        fetch(`${synodUrl}wp-json/wp/v2/media/${imageId}`)
            .then((res) => res.json())
            .then((json) => {
                const sizes = json.media_details?.sizes;
                const sizedImage = sizes?.[size]?.source_url;

                const result = {
                    url: sizedImage || json.source_url,
                    sourceTitle: json.attachment_source_title || '',
                    sourceUrl: json.attachment_source || '',
                };

                imageDataCache[key] = result;
                setData(result);
            })
            .catch(console.error);
    }, [imageId, size]);

    return data;
}