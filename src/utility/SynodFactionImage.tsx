import React from 'react';
import { useSynodFactionImageData } from './useSynodFactionImageData';
import {useImageCreditPopover} from "./ImageCreditPopoverContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import ImageCredits from "./ImageCredits";

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

    const { url, factionName, error, sourceTitle, sourceUrl } = useSynodFactionImageData(factionSlug, size);
    const { activeId, setActiveId } = useImageCreditPopover();
    const isOpen = activeId === factionSlug.toString();

    const fallback =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    if (error) return null;

    return (
        <>
            <img
                src={url || fallback}
                alt={factionName || ''}
                className={url ? `loaded-image ${className}` : `ghost-image ${className}`}
            />


            <ImageCredits
                sourceTitle={sourceTitle}
                sourceUrl={sourceUrl}
                popoverSlug={factionSlug.toString()}
            />
        </>

    );
};

export default SynodFactionImage;
