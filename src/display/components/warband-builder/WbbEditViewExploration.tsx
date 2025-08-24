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

interface WbbEditViewExplorationProps {
    location : WarbandProperty;
    initiallyOpen?: boolean;
}

const WbbEditViewExploration: React.FC<WbbEditViewExplorationProps> = ({  location, initiallyOpen }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    // @TODO: set initially open if this exploration location has NOT been applied yet
    const [open, setOpen] = useState<boolean>(initiallyOpen ?? true);
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2

    // Handler to apply an exploration location
    const handleApply = () => {
        // @TODO
        alert('Apply Exploration now');
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

                        {(location.SelfDynamicProperty.Selections.length > 0 ) && 
                            <ul className={'exploration-description-options'}>
                                {location.SelfDynamicProperty.Selections.map((item) => 
                                    <div key={location.SelfDynamicProperty.Selections.indexOf(item)}>
                                        {item.SelectedChoice != null && <>
                                        <li  className={'exploration-description-option'}>
                                            <span className={'option-name'}>
                                                {item.SelectedChoice.display_str}
                                            </span>
                                            <span className={'option-description'}>
                                                {returnDescription(item.SelectedChoice.value, item.SelectedChoice.value.Description)}
                                            </span>
                                        </li></>
                                        }
                                    </div>   
                                ) }
                            </ul>
                        }
                        {location.SelfDynamicProperty.Selections.length > 0 &&
                            <>
                            {location.SelfDynamicProperty.Selections.map((item) =>
                                <WbbOptionSelect
                                    property={location}
                                    hidedesc={true}
                                    key={location.SelfDynamicProperty.Selections.indexOf(item)}
                                    choice={item}
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




                            {/*<div className={'alert-exploration alert-exploration-success'}>
                                {@TODO: Add descriptive text what this has done }
                                {'XY and Z has been added to your to your stash'}
                            </div>*/}

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

export default WbbEditViewExploration;