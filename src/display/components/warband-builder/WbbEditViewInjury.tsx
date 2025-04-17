import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";

interface Injury {
    Name: string,
    Description: string,
    Table: string,
    Id: string,
    Number: number
}

const WbbEditViewInjury: React.FC<{ injury: Injury }> = ({ injury }) => {
    return (
        <div className="WbbEditViewInjury">
            <div className="injury-title">
                <strong>{injury.Name}</strong>
            </div>

            <div className="injury-source">
                {injury.Table + " #" + injury.Number}
            </div>

            <div className="injury-description">
                {injury.Description}
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
                                    {'Delete Injury'}
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

export default WbbEditViewInjury;