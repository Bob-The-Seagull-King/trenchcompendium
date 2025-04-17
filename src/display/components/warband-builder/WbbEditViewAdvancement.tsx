import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";


interface Advancement {
    Name: string,
    Description: string,
    Table: string,
    Id: string,
    Number: number
}

const WbbEditViewAdvancement: React.FC<{ advancement: Advancement }> = ({ advancement }) => {    return (
    <div className="WbbEditViewAdvancement">
        <div className="advancement-title">
            <strong>{advancement.Name}</strong>
        </div>

        <div className="advancement-source">
            {advancement.Table + " #" + advancement.Number}
        </div>

        <div className="advancement-description">
            {advancement.Description}
        </div>

        <div className={'actions'}>
            <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose={true}
                overlay={
                    <Popover.Body className="popover Wbb-item-actions-popover">
                        <div className='title'>
                            {'Actions'}
                        </div>

                        <div className={'actions'}>
                            <div
                                className={'action action-delete'}
                            >
                                <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                {'Delete Advancement'}
                            </div>
                        </div>
                    </Popover.Body>
                }>
                <div className={'Wbb-item-actions'}
                     onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical} className=""/>
                </div>
            </OverlayTrigger>
        </div>
    </div>
);
};

export default WbbEditViewAdvancement;