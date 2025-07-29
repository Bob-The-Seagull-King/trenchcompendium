import React, { useContext, useRef } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {useImageCreditPopover} from "./ImageCreditPopoverContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface ImageCreditsProps {
    sourceTitle?: string;
    sourceUrl?: string;
    popoverSlug: string;
}

const ImageCredits: React.FC<ImageCreditsProps> = ({ sourceTitle, sourceUrl, popoverSlug }) => {
    const target = useRef(null);
    const { activeId, setActiveId } = useImageCreditPopover();

    const isOpen = activeId === popoverSlug;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveId(isOpen ? null : popoverSlug);
    };

    return sourceTitle ? (
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
                                  setActiveId(isOpen ? null : popoverSlug.toString());
                              }}
                        >
                            <FontAwesomeIcon icon={faCamera} className={'image-credit-icon'}/>
                        </span>
                    </OverlayTrigger>
                </span>
    ) : null;
};

export default ImageCredits;