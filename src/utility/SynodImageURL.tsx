import { useEffect, useState } from 'react';

interface SynodImageURLProps {
    imageId: number;
    size?: string;
}


/**
 * This gets an image url from the synod by its Post ID
 *
 * @param imageId
 * @param size
 */
const SynodImageURL = ({ imageId, size = 'medium' }: SynodImageURLProps): string => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {

        const synodUrl = 'https://synod.trench-companion.com/';

        fetch(`${synodUrl}wp-json/wp/v2/media/${imageId}`)
            .then((res) => res.json())
            .then((data) => {

                const sizes = data.media_details?.sizes;
                const sizedImage = sizes?.[size]?.source_url;

                setImageUrl(sizedImage || data.source_url);

            })
            .catch(console.error);
    }, [imageId, size]);

    return imageUrl;
};

export default SynodImageURL;