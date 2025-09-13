import React, {useEffect, useState} from 'react';
import {Button, Collapse, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronUp,
    faCopy,
    faEllipsisVertical,
    faTrash,
    faTriangleExclamation,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { ISelectedOption, IWarbandProperty, WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import {useWbbMode} from "../../../context/WbbModeContext";
import WbbExploration_OptionSelect_Radio from "./Exploration/WbbExploration-OptionSelect-Radio";
import WbbExploration_Selection_Fallen_Knight from "./Exploration/WbbExploration_Selection_Fallen_Knight";
import WbbExploration_Selection_SingleEquipment from "./Exploration/WbbExploration_Selection_SingleEquipment";
import WbbExploration_Selection_MoonshineStash_Destroy
    from "./Exploration/WbbExploration_Selection_MoonshineStash_Destroy";
import WbbExploration_Selection_AngelicInstrument from "./Exploration/WbbExploration_Selection_AngelicInstrument";
import WbbExploration_Selection_HolyDNA from "./Exploration/WbbExploration_Selection_HolyDNA";
import WbbExploration_Selection_GolgothaTektites from "./Exploration/WbbExploration_Selection_GolgothaTektites";
import WbbExploration_Selection_Fruit from "./Exploration/WbbExploration_Selection_Fruit";
import WbbExploration_Selection_BattlefieldOfCorpses from "./Exploration/WbbExploration_Selection_BattlefieldOfCorpses";
import WbbExploration_Selection_FallenSoldier from "./Exploration/WbbExploration_Selection_FallenSoldier";
import WbbExploration_Selection_GloryPurchase from "./Exploration/WbbExploration_Selection_GloryPurchase";
import WbbExploration_Selection_MultiEquipment from "./Exploration/WbbExploration_Selection_MultiEquipment";
import WbbExploration_Selection_DieRollResult from "./Exploration/WbbExploration_Selection_DieRollResult";
import { ExplorationLocation } from '../../../classes/feature/exploration/ExplorationLocation';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { containsTag } from '../../../utility/functions';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import { WarbandConsumable } from '../../../classes/saveitems/Warband/WarbandConsumable';
import WbbConsumableSelect from './modals/warband/WbbConsumableSelect';
import { ContextObject } from '../../../classes/contextevent/contextobject';
import { StoredLocation } from '../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';

interface WbbEditViewExplorationProps {
    location : StoredLocation;
    initiallyOpen?: boolean;
    clear: () => void;
}

const WbbEditViewExplorationUnstored: React.FC<WbbEditViewExplorationProps> = ({  location, initiallyOpen, clear }) => {

    const { warband, reloadDisplay, updateKey} = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    
    const [open, setOpen] = useState<boolean>(initiallyOpen ?? true);
    const [keyvar, setkeyvar] = useState(0);
    const [updateState, setUpdateState] = useState(0);
    const [contextMessage, setContextMessage] = useState<string[]>([]);
    const [selectedOptions, setselectedOptions] = useState<ISelectedOption[]>([]);
    const [cansave, setcansave] = useState<boolean>(!location.base_item.location?.GetID() || (!(containsTag(location.base_item.location.Tags, 'unforced')) && location.base_item?.options && location.base_item.options.length > 0 && (location.base_item.options.length != selectedOptions.length )));
    
    useEffect(() => {
        async function GetMessage() {
            /*
            const EventProc : EventRunner = new EventRunner();

            let MessageList : string[]  = await EventProc.runEvent(
                "getLocationMessage",
                location.loc ,
                [],
                [],
                null
            )
            
            for (let i = 0; i < selectedOptions.length; i++) {
                const value = location.loc.MyOptions.filter((item) => item.RefID == selectedOptions[i].option_refID)

                if (value.length > 0) {
                    const option = value[0].Selections.filter((item) => item.id == selectedOptions[i].selection_ID)
                    if (option.length > 0) {
                        if (option[0].value instanceof ContextObject) {
                            MessageList = await EventProc.runEvent(
                                "getLocationMessage",
                                option[0].value,
                                [],
                                [],
                                null
                            )
                        }
                    }
                }
                selectedOptions[i].option_refID
            }

            setContextMessage(MessageList);
            setkeyvar(keyvar + 1);*/
        }

        GetMessage();
    }, [updateState]);
    
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2

    // Handler to apply an exploration location
    const handleApply = () => {
        if (!warband) { return; }
        warband.warband_data.Exploration.AddExplorationLocation(location.base_item.location, selectedOptions).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {clear(); reloadDisplay()})
        })
    }
    
    function UpdateSelectedOptionIDs(newoption : ISelectedOption) {
        let found = false
        for (let i = 0; i < selectedOptions.length; i++) {
            if (selectedOptions[i].option_refID == newoption.option_refID) {
                found = true;
                selectedOptions[i].selection_ID = newoption.selection_ID;
            }
        }
        if (found == false) {
            selectedOptions.push(newoption);
        }
        setcansave(!location.base_item.location?.GetID() || (!(containsTag(location.base_item.location.Tags, 'unforced')) && location.base_item?.options && location.base_item.options.length > 0 && (location.base_item.options.length != selectedOptions.length )))
        setUpdateState(updateState + 1);
    }


    return (
        <div className="WbbEditViewExploration">
            <div className={'WbbEditViewExploration-title'}
                 onClick={() => setOpen(!open)}
            >
                <div className={'exploration-name'}>
                    {location.base_item.location.GetName()}
                    <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-right-l icon-wraning"/>
                </div>

                {/* Collapse icon */}
                <span className={'collapse-chevron-wrap mx-1'}>
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className=""/>
                </span>
            </div>

            <Collapse in={open}>
                <div>
                    <div className={'exploration-body'}>
                        {/* Main description text */}
                        <div className={'exploration-description'}>
                            {(location.base_item.location.Description != null) &&
                                <>
                                    {
                                        returnDescription(location.base_item.location, location.base_item.location.Description)
                                    }
                                </>
                            }
                        </div>
                        {/* Show option descriptions if any */}
                        {(location.base_item.location.MyOptions.length > 0 )  &&
                            <ul className={'exploration-description-options'}>
                                {location.base_item.location.MyOptions.map((item) => 
                                    <div key={location.base_item.location.MyOptions.indexOf(item)}>
                                        {item.Selections.map((choice) => 
                                        <li key={item.Selections.indexOf(choice)} className={'exploration-description-option'}>
                                            <span className={'option-name'}>
                                                {choice.display_str}
                                            </span>
                                            <span className={'option-description'}>
                                                {returnDescription(choice.value, choice.value.Description)}
                                            </span>
                                        </li>)

                                        }
                                    </div>   
                                ) }
                            </ul>
                        }

                        {/* Show option Radio 1 */}
                        { (location.base_item.options.length > 0) &&
                            <>
                                {location.base_item.options.map((item) =>
                                    <WbbExploration_OptionSelect_Radio
                                        key={location.base_item.options.indexOf(item)}
                                        options={item}
                                        onChange={UpdateSelectedOptionIDs}
                                    />
                                )}
                                
                            </>
                        }


                        {/* Show additional Selection Options for the location */}

                        {/* @TODO: show this conditionally */}
                        {/* Show selection of sword or polearm */}
                        {/*<WbbExploration_Selection_Fallen_Knight*/}
                        {/*    onChange={() => {alert('option changed - fallen knight')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Show selection for falles soldier*/}
                        {/*<WbbExploration_Selection_FallenSoldier*/}
                        {/*    onChange={() => {alert('option changed - fallen soldier')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select a single equipment from a list */}
                        {/*<WbbExploration_Selection_SingleEquipment*/}
                        {/*    onSubmit={() => {console.log('equipment selected')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/*/!* Select 4 fighters to gain 1 XP *!/*/}
                        {/*<WbbExploration_Selection_MoonshineStash_Destroy*/}
                        {/*    // onChange={() => {alert('changed')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select one fighter with an instrument */}
                        {/*<WbbExploration_Selection_AngelicInstrument*/}
                        {/*    // onChange={() => {alert('changed')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select one fighter to gain Holy DNA*/}
                        {/*<WbbExploration_Selection_HolyDNA*/}
                        {/*    // onChange={() => {alert('changed')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select one armour to Upgrade*/}
                        {/*<WbbExploration_Selection_GolgothaTektites*/}
                        {/*    // onChange={() => {alert('changed')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select one skill for a fighter*/}
                        {/*<WbbExploration_Selection_Fruit*/}
                        {/*    // onSubmit={() => {alert('skill selected')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select two items costing 100D or less */}
                        {/*<WbbExploration_Selection_BattlefieldOfCorpses*/}
                        {/*    // onSubmit={() => {alert('skill selected')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select one items glory to purchase */}
                        {/*<WbbExploration_Selection_GloryPurchase*/}
                        {/*    onSubmit={() => {alert('glory item selected')}}*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select multiple items from a list within a limit */}
                        {/*<WbbExploration_Selection_MultiEquipment*/}
                        {/*/>*/}

                        {/* @TODO: show this conditionally */}
                        {/* Select a die Roll value */}
                        {/*<WbbExploration_Selection_DieRollResult*/}
                        {/*    label={'6D6 roll result'}*/}
                        {/*    onChange={(result) => {*/}
                        {/*        /!* @TODO: ceck if entered number is withing range and disable submit if not*!/*/}
                        {/*        alert('roll result = ' + result)*/}
                        {/*    }}*/}
                        {/*/>*/}

                        {contextMessage.length == 0 &&
                        <br/>
                        }

                        {/* Bottom info and apply action */}
                        {contextMessage.length > 0 &&
                        <div key={keyvar} className={'alert-exploration alert-exploration-info'}>
                            <ul>
                                {contextMessage.map((item, index) => 
                                <li key={index}>
                                    {item}
                                </li>)}
                            </ul>
                        </div>
                        }

                        {/* @TODO: disable if necessary options are not made*/}
                        <button
                            className={'btn btn-primary'}
                            onClick={handleApply}
                            disabled={cansave}
                        >
                            {'Save Exploration'}
                        </button>

                        {/* @TODO: remove - this is for reference */}
                        {/*{location.SelfDynamicProperty.Selections.length > 0 &&*/}
                        {/*    <>*/}
                        {/*        {location.SelfDynamicProperty.Selections.map((item) =>*/}
                        {/*            <WbbOptionSelect*/}
                        {/*                overrideplay={false}*/}
                        {/*                property={location}*/}
                        {/*                key={location.SelfDynamicProperty.Selections.indexOf(item)}*/}
                        {/*                choice={item}*/}
                        {/*            />*/}
                        {/*        )}*/}
                        {/*    </>*/}
                        {/*}*/}
                    </div>
                </div>
            </Collapse>
        </div>
    );

};

export default WbbEditViewExplorationUnstored;