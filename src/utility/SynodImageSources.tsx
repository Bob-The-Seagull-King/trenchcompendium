import React from 'react';
import SynodImageSource from './SynodImageSource';


/**
 * This takes an array of image ids and concatenates them as image sources
 */
interface SynodImageSourcesProps {
    imageIds: number[];
}

const SynodImageSources: React.FC<SynodImageSourcesProps> = ({ imageIds }) => {
    if (!imageIds || imageIds.length === 0) return null;

    return (
        <div className="SynodImageSources">
            {'Image Credit: '}

            {imageIds.map((id, index) => (
                <span key={id}>
                    <SynodImageSource imageId={id} />
                    {index < imageIds.length - 1 && ', '}
                </span>
            ))}
        </div>
    );
};

export default SynodImageSources;