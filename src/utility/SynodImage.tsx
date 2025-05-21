import React, {useEffect, useState} from 'react';
import { useSynodImageData } from './useSynodImageData';
import {useGlobalState} from "./globalstate";

interface SynodImageProps {
    imageId: number;
    size?: string;
    className?: string;
}

const SynodImage: React.FC<SynodImageProps> = ({ imageId, size = 'medium', className = '' }) => {
    const { url } = useSynodImageData(imageId, size);

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const [applycurse] = useGlobalState('applycurse');
    const [glitch, setGlitch] = useState(false);

    const curse_interval = 5000;
    const curse_variance = 9000;


    useEffect(() => {
        if (applycurse === 'true') {
            const interval = setInterval(() => {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 1000); // remove after animation
            }, curse_interval + Math.random() * curse_variance); // random interval between 3-5s
            return () => clearInterval(interval);
        }
    }, [applycurse]);

    const imageClass = [
        url ? 'loaded-image' : 'ghost-image',
        className,
        applycurse === 'true' ? 'cursed-image' : '',
        glitch ? 'curse-active' : ''
    ].join(' ').trim();

    return (
        <img
            src={url || fallback}
            className={imageClass}
            alt=""
            style={{width: "100%"}}
        />
    );
};

export default SynodImage;
