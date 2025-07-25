import React from 'react';
import { useSynodFactionImageData } from './useSynodFactionImageData';

/**
 * Shows a synod image for a faction by its slug
 */

interface SynodFactionImageProps {
    factionSlug?: string;
    size?: string;
    className?: string;
}

const SynodFactionImage: React.FC<SynodFactionImageProps> = ({ factionSlug, size = 'full', className = '' }) => {

    if( !factionSlug) {
        return null;
    }

    const { url, factionName, error } = useSynodFactionImageData(factionSlug, size);

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    if (error) return null;

    return (
        <img
            src={url || fallback}
            alt={factionName || ''}
            className={url ? `loaded-image ${className}` : `ghost-image ${className}`}
        />
    );
};

export default SynodFactionImage;
