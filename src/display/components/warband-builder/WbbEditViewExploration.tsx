import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';

interface WbbEditViewExplorationProps {
    location : WarbandProperty;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({  location }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className="WbbEditViewExploration">
            <div className={'exploration-name'}>
                {location.GetOwnName()}
            </div>


            {location.SelfDynamicProperty.Selections.length > 0 &&
                <span className={'title-choice'}>
                    {location.SelfDynamicProperty.Selections.map((item) =>
                        <WbbOptionSelect
                            property={location}
                            key={location.SelfDynamicProperty.Selections.indexOf(item)}
                            choice={item}
                        />
                    )}
                </span>
            }

            <div className={'modifier-body'}>
                
                {(location.GetOwnDescription() != null) &&
                <>
                    {
                        returnDescription(location, location.GetOwnDescription())
                    }
                </>
                }
            </div>

            {/* actions */}
            <WbbContextualPopover
                id={`exploration-${location.ID}`}
                type="exploration"
                item={location}
            />

        </div>
    );
};

export default WbbEditViewExploration;