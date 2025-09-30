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
import WbbExploration_Selection_SmallList from "./Exploration/WbbExploration_Selection_SmallListEquipment";
import WbbExploration_Selection_SingleEquipment from "./Exploration/WbbExploration_Selection_SingleEquipment";
import WbbExploration_Selection_MultiEquipment from "./Exploration/WbbExploration_Selection_MultiEquipment";
import WbbExploration_Selection_DieRollResult from "./Exploration/WbbExploration_Selection_DieRollResult";
import { ExplorationLocation } from '../../../classes/feature/exploration/ExplorationLocation';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { containsTag } from '../../../utility/functions';
import { EventRunner } from '../../../classes/contextevent/contexteventhandler';
import { WarbandConsumable } from '../../../classes/saveitems/Warband/WarbandConsumable';
import WbbConsumableSelect from './modals/warband/WbbConsumableSelect';
import { ContextObject } from '../../../classes/contextevent/contextobject';
import { CheckRelevantBaseOptions, CheckRelevantFullOptions, StoredLocation } from '../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';
import WbbExploration_Selection_Parent from './Exploration/WbbExploration_Selection_Parent';

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
    const [cansave, setcansave] = useState<boolean>(GetCanSave() );
    
    function GetCanSave() {
        const IsRealID = location.base_item.location?.GetID()
        const IsForced = !(containsTag(location.base_item.location.Tags, 'unforced'))
        const optionList = location.base_item?.options
        const ListOfFullOptions = CheckRelevantFullOptions(location.base_item)
        const FilteredOptions = location.selected_options
        const BaseOptions = CheckRelevantBaseOptions(location.base_item)
        let OptionsAreValid = false
        if (optionList != undefined) {
            OptionsAreValid = true
        }

        return !IsRealID || IsForced && OptionsAreValid && ListOfFullOptions.length > 0 && (FilteredOptions.length != BaseOptions.length )
    }

    function createBaseItem() {
        if (!warband) { return; }
        warband.warband_data.Exploration.AddTempExplorationLocation(location.base_item.location, location.selected_options).then(() => {
            onbaseItemCreate()
        })
    }

    async function onbaseItemCreate() {
        
        if (location.true_obj) {
            const Events : EventRunner = new EventRunner();
            const IDString = await Events.runEvent(
                "getLocationMessage",
                location.true_obj,
                [],
                [],
                null
            )
            setContextMessage(IDString)
        }
        setkeyvar(keyvar + 1);
    }

    useEffect(() => {
        async function GetMessage() {
            if (CheckRelevantBaseOptions(location.base_item).length == 0 && location.true_obj == undefined) {
                createBaseItem();
            } else {
                await onbaseItemCreate();
            }
            setkeyvar(keyvar + 1);
            
        }

        GetMessage();
    }, [updateState]);
    
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2

    // Handler to apply an exploration location
    const handleApply = () => {
        if (!warband) { return; }
        if (location.true_obj == undefined) {
            warband.warband_data.Exploration.AddTempExplorationLocation(location.base_item.location, location.selected_options).then(() => {warband.warband_data.Exploration.AssignTempLocation().then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {clear(); reloadDisplay()})
        })})} else {
        warband.warband_data.Exploration.AssignTempLocation().then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => {clear(); reloadDisplay()})
        })
    }
    }
    
    function UpdateSelectedOptionIDs(newoption : ISelectedOption) {
        let found = false
        for (let i = 0; i < location.selected_options.length; i++) {
            if (location.selected_options[i].option_refID == newoption.option_refID) {
                found = true;
                location.selected_options[i].selection_ID = newoption.selection_ID;
            }
        }
        if (found == false) {
            location.selected_options.push(newoption);
        }
        setcansave(GetCanSave() )
        setUpdateState(updateState + 1);
        createBaseItem()
            setkeyvar(keyvar + 1);

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
                <div key={keyvar}>
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
                        {(CheckRelevantBaseOptions(location.base_item).length > 0 )  &&
                            <ul className={'exploration-description-options'}>
                                {CheckRelevantBaseOptions(location.base_item).map((item) => 
                                    <div key={CheckRelevantBaseOptions(location.base_item).indexOf(item)}>
                                        {item.baseopt.Tags.base_loc != undefined &&
                                            <>
                                        {item.baseopt.Selections.map((choice) => 
                                        <li key={item.baseopt.Selections.indexOf(choice)} className={'exploration-description-option'}>
                                            <span className={'option-name'}>
                                                {choice.display_str}
                                            </span>
                                            <span className={'option-description'}>
                                                {returnDescription(choice.value, choice.value.Description)}
                                            </span>
                                        </li>)

                                        }</>}
                                    </div>   
                                ) }
                            </ul>
                        }

                        {/* Show option Radio 1 */}
                        { (CheckRelevantBaseOptions(location.base_item).length > 0) &&
                            <>
                                {CheckRelevantBaseOptions(location.base_item).map((item, index) =>
                                    <WbbExploration_OptionSelect_Radio
                                        key={location.base_item.options.indexOf(item)}
                                        options={item}
                                        curSelection={location.selected_options[index]? location.selected_options[index] : null}
                                        onChange={UpdateSelectedOptionIDs}
                                    />
                                )}
                                
                            </>
                        }

                        {((location.true_obj != undefined) && (location.true_obj != null)) &&
                            <div>
                                
                                {(location.true_obj.SelfDynamicProperty.OptionChoice.MyOptions.length > 0 ) && 
                                    <ul className={'exploration-description-options'}>
                                        {location.true_obj.SelfDynamicProperty.OptionChoice.MyOptions.map((item) => 
                                            <div key={location.true_obj!.SelfDynamicProperty.OptionChoice.MyOptions.indexOf(item)}>
                                                {(item.Tags.base_loc == undefined && item.Tags.hide_info == undefined) &&
                                                    <>
                                            {item.Selections.map((selectedchoice) => 
                                                <div key={item.Selections.indexOf(selectedchoice)}>
                                                <li  className={'exploration-description-option'}>
                                                    <span className={'option-name'}>
                                                        {selectedchoice.display_str}
                                                    </span>
                                                    <span className={'option-description'}>
                                                        {returnDescription(selectedchoice.value, selectedchoice.value.Description)}
                                                    </span>
                                                </li></div>
                                                )}</>
                                                }
                                            </div>   
                                        ) }
                                    </ul>
                                }
                                {location.true_obj.SelfDynamicProperty.Selections.length > 0 &&
                                    <>
                                    {location.true_obj.SelfDynamicProperty.Selections.map((item) =>
                                        <div
                                            key={location.true_obj!.SelfDynamicProperty.Selections.indexOf(item)}>
                                                {item.Option.Tags.base_loc == undefined &&
                                                    <>
                                                <WbbOptionSelect
                                                    property={location.true_obj!}
                                                    hidedesc={true}
                                                    choice={item}
                                                /></>
                                                }
                                        </div>
                                    )}
                                </>
                                }
                                {location.true_obj.Consumables.length > 0 &&
                                <div className="stash-items-wrap">
                                    <div className={'stash-items-category'}>
                                        {location.true_obj.Consumables.map((item: WarbandConsumable, index: number) => (
                                            <WbbExploration_Selection_Parent
                                                key={index}
                                                property={item}
                                                doshow={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                                }
                            </div>
                        }

                        {contextMessage.length == 0 &&
                        <br/>
                        }

                        {/* Bottom info and apply action */}
                        {contextMessage.length > 0 &&
                        <div className={'alert-exploration alert-exploration-info'}>
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
                        


                    </div>
                </div>
            </Collapse>
        </div>
    );

};

export default WbbEditViewExplorationUnstored;