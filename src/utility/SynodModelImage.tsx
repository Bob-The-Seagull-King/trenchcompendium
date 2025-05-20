import React, { useState } from 'react';
import { useSynodModelImageData } from './useSynodModelImageData';


/**
 * Shows a synod image for a model by its slug
 */

interface SynodModelImageProps {
    modelSlug: string;
    size?: string;
    className?: string;
}

const SynodModelImage: React.FC<SynodModelImageProps> = ({ modelSlug, size = 'full', className = '' }) => {
    const { url, modelName, error } = useSynodModelImageData(modelSlug, size);

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


    if( error ) {
        return null;
    }

    return (
        <img
            src={url || fallback}
            alt={modelName || ''}
            className={url ? `loaded-image ${className}` : `ghost-image ${className}`}
        />
    );


};

export default SynodModelImage;
