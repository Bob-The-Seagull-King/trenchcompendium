import React from 'react';
import { useSynodModelImageData } from './useSynodModelImageData';


/**
 * This shows the source information for a synod image
 */
interface SynodModelImageSourceProps {
    modelSlug: string;
}

const SynodModelImageSource: React.FC<SynodModelImageSourceProps> = ({ modelSlug }) => {
    const { sourceTitle, sourceUrl, loading, error } = useSynodModelImageData(modelSlug, 'medium');


    if (loading || error || !sourceUrl) return null;

    return (
        <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={'synod-image-source'}
        >
            {'@'}
            {sourceTitle || sourceUrl}
        </a>
    );
};

export default SynodModelImageSource;
