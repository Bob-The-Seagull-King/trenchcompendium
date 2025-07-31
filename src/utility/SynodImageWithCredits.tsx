import React, {useEffect, useState} from 'react';
import { useSynodImageData } from './useSynodImageData';
import {useGlobalState} from "./globalstate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faChevronRight, faLink} from "@fortawesome/free-solid-svg-icons";
import {Popover} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {useImageCreditPopover} from "./ImageCreditPopoverContext";
import ImageCredits from "./ImageCredits";

interface SynodImageWithCreditProps {
    imageId: number;
    size?: string;
    className?: string;
}

const SynodImageWithCredit: React.FC<SynodImageWithCreditProps> = ({ imageId, size = 'medium', className = '' }) => {
    const { url, sourceTitle, sourceUrl } = useSynodImageData(imageId, size);

    const { activeId, setActiveId } = useImageCreditPopover();
    const isOpen = activeId === imageId.toString();

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const [applycurse] = useGlobalState('applycurse');
    const [glitch, setGlitch] = useState(false);

    const curse_interval = 25000;
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
        <>
            <img
                src={url || fallback}
                className={imageClass}
                alt=""
                style={{width: "100%"}}
            />

            <ImageCredits
                sourceTitle={sourceTitle}
                sourceUrl={sourceUrl}
                popoverSlug={imageId.toString()}
            />
        </>

    );
};

export default SynodImageWithCredit;