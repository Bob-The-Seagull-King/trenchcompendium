import React, {useEffect, useState} from 'react';
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
import WbbConsumableSelect from './modals/warband/WbbConsumableSelect';
import { WarbandConsumable } from '../../../classes/saveitems/Warband/WarbandConsumable';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import WbbExploration_Selection_Parent from './Exploration/WbbExploration_Selection_Parent';

interface WbbEditViewExplorationProps {
    location : WarbandProperty;
    initiallyOpen?: boolean;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({  location, initiallyOpen }) => {

    const { warband , updateKey} = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    // @TODO: set initially open if this exploration location has NOT been applied yet
    const [open, setOpen] = useState<boolean>(initiallyOpen ?? false);
    const [contextMessage, setContextMessage] = useState<string[]>([]);
    const [keyvar, setkeyvar] = useState(0);
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2

    
    useEffect(() => {
        async function GetMessage() {
            
            const Events : EventRunner = new EventRunner();
            const IDString = await Events.runEvent(
                "getLocationSavedMessage",
                location,
                [warband?.warband_data],
                [],
                null
            )
            setContextMessage(IDString)
            setkeyvar(keyvar + 1)
        }

        GetMessage();
    }, [updateKey]);
    
    function isValidNameTag(val : any) {
        if (val.Tags == undefined) { return false;}
        return val.Tags["validation_rules"] != undefined
    }

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
                        {/* Main description text */}
                        <div className={'exploration-description'}>
                            {(location.GetOwnDescription() != null) &&
                                <>
                                    {
                                        returnDescription(location, location.GetOwnDescription())
                                    }
                                </>
                            }
                        </div>

                        {(location.SelfDynamicProperty.OptionChoice.MyOptions.length > 0 ) && 
                            <ul className={'exploration-description-options'}>
                                {location.SelfDynamicProperty.OptionChoice.MyOptions.map((item) => 
                                    <div key={location.SelfDynamicProperty.OptionChoice.MyOptions.indexOf(item)}>
                                    {item.Selections.map((selectedchoice) => 
                                        <div key={item.Selections.indexOf(selectedchoice)}>
                                        <li  className={'exploration-description-option'}>
                                            <span className={'option-name'}>
                                                {selectedchoice.display_str}
                                            </span>
                                            {isValidNameTag(selectedchoice.value) &&                                                                            
                                                <span className={'option-description'}>
                                                    {selectedchoice.value.Tags["validation_rules"]}
                                                </span>
                                            }
                                            <span className={'option-description'}>
                                                {returnDescription(selectedchoice.value, selectedchoice.value.Description)}
                                            </span>
                                        </li></div>
                                        )}
                                    </div>   
                                ) }
                            </ul>
                        }
                        {location.SelfDynamicProperty.Selections.length > 0 &&
                            <>
                            {location.SelfDynamicProperty.Selections.map((item) =>
                                <div
                                    key={location.SelfDynamicProperty.Selections.indexOf(item)}>
                                        <WbbOptionSelect
                                            leadtext={"Your Choice: "}
                                            property={location}
                                            hidedesc={true}
                                            choice={item}
                                        />
                                </div>
                            )}
                        </>
                        }
                        {location.Consumables.length > 0 &&
                        <div className="stash-items-wrap">
                            <div className={'stash-items-category'}>
                                {location.Consumables.map((item: WarbandConsumable, index: number) => (
                                    
                                            <WbbExploration_Selection_Parent
                                                key={index}
                                                property={item}
                                                doshow={false}
                                                dochange={false}
                                            />
                                ))}
                            </div>
                        </div>
                        }
                        
                        {/* Bottom info and apply action */}
                        {contextMessage.length > 0 &&
                        <div key={keyvar} className={'alert-exploration alert-exploration-info'}>
                            <span>
                                {contextMessage.map((item, index) => 
                                <span key={index}>
                                    {item + " "}
                                </span>)}
                            </span>
                        </div>
                        }


                        
                    </div>
                </div>
            </Collapse>
        </div>
    );

};

export default WbbEditViewExploration;