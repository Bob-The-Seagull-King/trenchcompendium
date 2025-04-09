import React from 'react';
import useSynodImageURL from './SynodImageURL';

interface SynodImageProps {
    imageId: number; // The image id as per WP ID
    size?: string;// The size string as per WP sizes
    className?: string; // optional class for the image
}

/**
 * This outputs an image from the synod by its WP Post ID
 *
 * @param imageId
 * @param size
 * @param className
 * @constructor
 */

const SynodImage: React.FC<SynodImageProps> = ({ imageId, size = 'medium', className = '' }) => {
    const imageUrl = useSynodImageURL({ imageId, size });

    // transparent 1px*1px gif
    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // return image or fallback that has animation
    return (
        <img
            src={imageUrl || fallback}
            className={imageUrl ? `loaded-image ${className}` : `ghost-image ${className}`}
            alt=""
        />
    );
};

export default SynodImage;