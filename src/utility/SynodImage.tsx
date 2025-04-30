import React from 'react';
import { useSynodImageData } from './useSynodImageData';

interface SynodImageProps {
    imageId: number;
    size?: string;
    className?: string;
}

const SynodImage: React.FC<SynodImageProps> = ({ imageId, size = 'medium', className = '' }) => {
    const { url } = useSynodImageData(imageId, size);

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    return (
        <img
            src={url || fallback}
            className={url ? `loaded-image ${className}` : `ghost-image ${className}`}
            alt=""
        />
    );
};

export default SynodImage;
