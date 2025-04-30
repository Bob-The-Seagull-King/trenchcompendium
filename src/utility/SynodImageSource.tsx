import React from 'react';
import { useSynodImageData } from './useSynodImageData';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

interface SynodImageSourceProps {
    imageId: number;
    size?: string;
}

const SynodImageSource: React.FC<SynodImageSourceProps> = ({ imageId, size = 'medium' }) => {
    const { sourceTitle, sourceUrl } = useSynodImageData(imageId, size);



    if (!sourceUrl) return null;

    return (
        <a target="_blank" rel="noopener noreferrer"
            href={sourceUrl}
            className={'synod-image-source'}>
            {sourceTitle || sourceUrl}
        </a>
    );
};

export default SynodImageSource;
