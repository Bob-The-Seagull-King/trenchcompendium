import React, { useEffect, useState } from 'react';
import { initSynodModelImageData, useSynodModelImageData } from './useSynodModelImageData';
import { ModelImageData } from '../classes/_high_level_controllers/SynodImageCache';


/**
 * This shows the source information for a synod image
 */
interface SynodModelImageSourceProps {
    modelSlug: string;
}

const SynodModelImageSource: React.FC<SynodModelImageSourceProps> = ({ modelSlug }) => {
    const [{ sourceTitle, sourceUrl, loading, error }, setData] = useState(initSynodModelImageData(modelSlug, 'medium'));
    const [_keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function SetImageData() {
            const IMG_Model : ModelImageData = await useSynodModelImageData(modelSlug, 'medium')
            setData(IMG_Model)
            setkeyvar(_keyvar + 1)
        }

        SetImageData();
    }, []);


    return (
        <span key={_keyvar}>
            {(!(loading || error || !sourceUrl)) &&
            <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={'synod-image-source'}
            >
                {'@'}
                {sourceTitle || sourceUrl}
            </a>
            }
        </span>
    );
};

export default SynodModelImageSource;
