import React, {useEffect, useState} from 'react';
import { useSynodImageData } from './useSynodImageData';
import {useGlobalState} from "./globalstate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera, faChevronRight, faLink} from "@fortawesome/free-solid-svg-icons";
import {Popover} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {useImageCreditPopover} from "./ImageCreditPopoverContext";

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

            {sourceTitle && (
                <span className={'image-credit-wrap'}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <OverlayTrigger
                        placement={'top-end'}
                        trigger="click"
                        rootClose
                        show={isOpen}
                        overlay={
                            <Popover.Body bsPrefix="credit" className="popover image-credit-popover" id="tooltip">

                                <div className="popover-content">
                                    <div className={'mb-2'}>
                                        <strong>{'Image Credit'}</strong>
                                    </div>
                                    <a target="_blank" rel="noopener noreferrer"
                                       href={sourceUrl}
                                       className={'image-credit-link'}>
                                        {sourceTitle || sourceUrl}
                                        <FontAwesomeIcon icon={faChevronRight} className={'icon-inline-right'}/>
                                    </a>
                                </div>
                            </Popover.Body>
                        }>

                        <span className={'image-credit'}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setActiveId(isOpen ? null : imageId.toString());
                              }}
                        >
                            <FontAwesomeIcon icon={faCamera} className={'image-credit-icon'}/>
                        </span>
                    </OverlayTrigger>
                </span>
            )}
        </>

    );
};

export default SynodImageWithCredit;