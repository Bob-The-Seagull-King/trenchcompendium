import React, { useEffect, useState } from 'react';
import { initSynodModelImageData, useSynodModelImageData } from './useSynodModelImageData';
import { ModelImageData } from '../classes/_high_level_controllers/SynodImageCache';


/**
 * Shows a synod image for a model by its slug
 */

interface SynodModelImageProps {
    modelSlug: string;
    size?: string;
    className?: string;
}

const SynodModelImage: React.FC<SynodModelImageProps> = ({ modelSlug, size = 'full', className = '' }) => {
    const [data, setData] = useState(initSynodModelImageData(modelSlug, size));
    const [_keyvar, setkeyvar] = useState(0);
    
    
    useEffect(() => {
        async function SetImageData() {
            const IMG_Model : ModelImageData = await useSynodModelImageData(modelSlug, size)
            setData(IMG_Model) 
            setkeyvar(_keyvar + 1)
        }
        setData({
            url: undefined,
            sourceTitle: '',
            sourceUrl: '',
            imageId: 0,
            modelName: '',
            modelId: 0,
            loading: true,
            error: false,
        }) 
        SetImageData();
    }, [modelSlug]);

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    if( data.error ) {
        return null;
    }

    return (
        <img
            key={_keyvar}
            src={data.url || fallback}
            alt={data.modelName || ''}
            className={data.url ? `loaded-image ${className}` : `ghost-image ${className}`}
        />
    );


};

export default SynodModelImage;
