import React, {useState} from 'react';
import {Button, Collapse, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronUp,
    faCopy,
    faEllipsisVertical,
    faTrash,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import {usePlayMode} from "../../../context/PlayModeContext";

interface WbbEditViewExplorationProps {
    location : WarbandProperty;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({  location }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    const [open, setOpen] = useState(false);
    const { playMode } = usePlayMode();

    return (
        <div className="WbbEditViewExploration">
            <div className={'WbbEditViewExploration-title'}
                 onClick={() => setOpen(!open)}
            >
                <div className={'exploration-name'}>
                    {location.GetOwnName()}
                </div>

                {/* Collapse icon */}
                <span className={'collapse-chevron-wrap mx-4'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>

                {/* actions */}
                <WbbContextualPopover
                    id={`exploration-${location.ID}`}
                    type="exploration"
                    item={location}
                />
            </div>

            <Collapse in={open}>
                <div>
                    <div className={'exploration-body'}>
                        {(location.GetOwnDescription() != null) &&
                            <>
                                {
                                    returnDescription(location, location.GetOwnDescription())
                            }
                        </>
                        }

                        {location.SelfDynamicProperty.Selections.length > 0 &&
                            <>
                                {location.SelfDynamicProperty.Selections.map((item) =>
                                    <WbbOptionSelect
                                        overrideplay={false}
                                        property={location}
                                        key={location.SelfDynamicProperty.Selections.indexOf(item)}
                                        choice={item}
                                    />
                                )}
                            </>
                        }
                    </div>
                </div>
            </Collapse>
        </div>
    );

};

export default WbbEditViewExploration;