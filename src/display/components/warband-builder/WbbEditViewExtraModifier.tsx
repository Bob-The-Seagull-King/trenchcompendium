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
import {useWbbMode} from "../../../context/WbbModeContext";

interface WbbEditViewModifierProps {
    warbprop: WarbandProperty;
    index : number
    isinner?: boolean;
}

const WbbEditViewExtraModifier: React.FC<WbbEditViewModifierProps> = ({ warbprop, index, isinner }) => {

    const { warband, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2
    const [open, setOpen] = useState(false);

    return (
        <div className={`WbbEditViewExtraModifier ${isinner != undefined ? 'inner' : ''}`}
             key={updateKey}>
            <div className={'WbbEditViewExtraModifier-title'}
                 onClick={() => setOpen(!open)}
            >
                <div className={'WbbEditViewExtraModifier-name'}>
                    {warbprop.GetTrueName()}
                </div>


                {/* Show collapse and popover icon states*/}
                {(edit_mode && warband?.warband_data.HasModifier(warbprop)) ? (
                    <>
                        <span className={'collapse-chevron-wrap mx-4'}>
                            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                        </span>

                        <WbbContextualPopover
                            id={`WbbEditViewExtraModifier-${warbprop.ID}`}
                            type="modifier"
                            item={warbprop}
                        />
                    </>
                ) : (
                    <span className={'collapse-chevron-wrap'}>
                        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                    </span>
                )}
            </div>

            <Collapse in={open}>
                <div>
                    <div className={'WbbEditViewExtraModifier-body'}>
                        {warbprop.SelfDynamicProperty.Selections.length > 0 &&
                            <>
                            {warbprop.SelfDynamicProperty.Selections.map((item) =>
                                <WbbOptionSelect
                                    property={warbprop}
                                    key={warbprop.SelfDynamicProperty.Selections.indexOf(item)}
                                    choice={item}
                                />
                            )}
                        </>
                        }

                        {(warbprop.GetOwnDescription() != null) &&
                        <>
                            {
                                returnDescription(warbprop, warbprop.GetOwnDescription())
                            }
                        </>
                        }
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default WbbEditViewExtraModifier;