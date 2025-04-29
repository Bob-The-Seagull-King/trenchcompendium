import { useEffect, useState } from 'react';

interface SynodImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
}

export function useSynodImageData(imageId: number, size = 'medium'): SynodImageData {
    const [data, setData] = useState<SynodImageData>({
        url: '',
        sourceTitle: '',
        sourceUrl: '',
    });

    useEffect(() => {
        if (!imageId) return;

        const synodUrl = 'https://synod.trench-companion.com/';

        fetch(`${synodUrl}wp-json/wp/v2/media/${imageId}`)
            .then((res) => res.json())
            .then((json) => {
                const sizes = json.media_details?.sizes;
                const sizedImage = sizes?.[size]?.source_url;

                console.log(json);


                setData({
                    url: sizedImage || json.source_url,
                    sourceTitle: json.meta.attachment_source_title || '',
                    sourceUrl: json.meta.attachment_source || '',
                });
            })
            .catch(console.error);
    }, [imageId, size]);

    console.log('loremm');
    console.log(data);

    return data;
}