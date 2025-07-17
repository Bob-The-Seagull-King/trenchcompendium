import React, {useEffect, useState} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faFloppyDisk, faPen, faPlus, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbModalEditFighterStatus from "./modals/fighter/WbbEditFighterStatus";
import WbbTextarea from "./WbbTextarea";
import WbbOptionBox from "./WbbOptionBox";
import WbbDetailViewCollapse from "./WbbDetailViewCollapse";
import WbbEditGoeticSelectionModal from "./modals/warband/WbbEditGoeticSelectionModal";
import WbbExplorationSkills from "./WbbExplorationSkills";
import WbbExplorationSkill from "./WbbExplorationSkill";
import WbbSpecialRule from "./WbbSpecialRule";
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import WbbEditViewModifier from './WbbEditViewModifier';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import WbbEditViewExtraModifier from './WbbEditViewExtraModifier';
import { Form } from 'react-bootstrap';
import {usePlayMode} from "../../../context/PlayModeContext";
import WbbModalAddFighterCustom from './modals/WbbModalAddFighterCustom';
import { Model } from '../../../classes/feature/model/Model';
import WbbEquipmentAddCustomStash from './modals/WbbEquipmentAddCustomStash';
import { Equipment } from '../../../classes/feature/equipment/Equipment';

interface WbbWarbandDetailViewProps {
    onClose: () => void;
}

const WbbWarbandDetailView: React.FC<WbbWarbandDetailViewProps> = ({  onClose }) => {

    const { warband, setWarband , reloadDisplay, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);


    const { playMode } = usePlayMode();

    // Does this warband have advanced options enabled?
    // @TODO: Lane: Save this to the warband and use it to toggle the display of advanced options
    const [warbandEnableAdvancedOptions, setWarbandEnableAdvancedOptions] = useState<boolean>(warband.warband_data.IsWarbandCustom());

    const [showAddFighterCustomModal, setShowAddFighterCustomModal] = useState(false);
    const [showCustomitemAddToStash, setShowCustomitemAddToStash] = useState(false);
    const [warbandErrors, setwarbanderrors] = useState<string[]>([])
    const [keyvar, setkeyvar] = useState(0)

    useEffect(() => {
        async function RunErrorCheck() {
            const Errors = await warband?.warband_data.GetValidationErrors()
            if (Errors) {
                setwarbanderrors(Errors )
                setkeyvar(keyvar + 1)
            }
        }
        RunErrorCheck();
    }, [updateKey])


    
    const handleCustomItemToStash = (item: Equipment, cost : number, costtype : number) => {
        if (!warband) { return; } // Guard
        
        warband.warband_data.CustomStash(item, cost, costtype).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
        })
    };

    const handleCustomFighterSubmit = (newFighter : Model, cost : number, costtype : number) => {
        if (!warband) { return; } // Guard

        warband.warband_data.AddCustomFighter(newFighter, cost, costtype).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        });
    }

    return (
        <div className="WbbDetailView WbbWarbandDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Warband'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* Detailed information */}
                <div className={'detail-section-title'}>
                    {'Warband Details'}
                </div>

                <div className={'detail-section-text'}>
                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Faction: '}
                        </strong>

                        {warband.warband_data.GetFactionName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Name: '}
                        </strong>
                        {warband.warband_data.GetWarbandName()}
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Rating: '}
                        </strong>
                        {warband.warband_data.GetCostDucats()} Ducats
                        | {warband.warband_data.GetCostGlory()} Glory
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>
                            {'Value: '}
                        </strong>
                        {warband.warband_data.GetCostDucatsTotal()} Ducats
                        | {warband.warband_data.GetCostGloryTotal()} Glory
                    </div>

                    <div className={'detail-section-text-element'}>
                        <strong>{'Fighters: '}</strong>
                        {'Elite: '}{warband.warband_data.GetNumElite()}
                        {' | '}
                        {'Troop: '}{warband.warband_data.GetNumTroop()}
                        {' | '}
                        {'Mercenary: '}{warband.warband_data.GetNumMercenary()}
                        {' | '}
                        {'Fielded: '}{warband.warband_data.GetNumFielded()}
                    </div>

                    { warbandErrors.length > 0 &&
                        <div className="detail-section-text-element detail-section-text-element-validation-error">
                            <div className={'alert alert-warning'}>
                                <div className={'detail-section-text-element-validation-error-title'}>
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-left-l"/>
                                    {'The warband is not valid'}
                                </div>

                                <ul>
                                    {warbandErrors.map((item, index) =>
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )}
                                </ul>
                            </div>

                        </div>
                    }
                </div>

                {/* Warband level options */}
                <div className={'WbbDetailViewCollapse-wrap'}>
                    {(warband.warband_data.Faction.MyFaction ? warband.warband_data.Faction.MyFaction.SelfDynamicProperty.Selections.length : 0) > 0 &&
                        <WbbDetailViewCollapse title="Warband Options" initiallyOpen={true}>

                        {(warband.warband_data.Faction.MyFaction? warband.warband_data.Faction.MyFaction.SelfDynamicProperty.Selections.length : 0) > 0 &&
                                <span className={'title-choice'}>
                                    {(warband.warband_data.Faction.MyFaction? warband.warband_data.Faction.MyFaction.SelfDynamicProperty.Selections : []).map((item) => 
                                        <WbbOptionSelect 
                                            property={warband.warband_data.Faction.MyFaction}
                                            key={warband.warband_data.Faction.MyFaction? warband.warband_data.Faction.MyFaction.SelfDynamicProperty.Selections.indexOf(item) : 0}
                                            choice={item}
                                        />
                                    )}                        
                                </span>
                            }
                        </WbbDetailViewCollapse>
                    }

                    {/* Faction Selections */}
                    {warband?.warband_data.GetWarbandFactionOptionsModifiersList().length > 0 &&
                        <WbbDetailViewCollapse title='Faction Selections' initiallyOpen={true}>
                            
                            {warband?.warband_data.GetWarbandFactionOptionsModifiersList().map((item) =>
                                <WbbEditViewExtraModifier
                                    key={item.GetTrueName()}
                                    warbprop={item}
                                    isinner={true}
                                    index={warband?.warband_data.GetWarbandFactionOptionsModifiersList().indexOf(item)}
                                />
                            )}
                        </WbbDetailViewCollapse>
                    }

                    {/* Faction Special Rules */}
                    {warband?.warband_data.GetWarbandFactionModifiersList().length > 0 &&
                        <WbbDetailViewCollapse title='Faction Special Rules' initiallyOpen={true}>
                            
                            {warband?.warband_data.GetWarbandFactionModifiersList().map((item) =>
                                <WbbEditViewModifier
                                    key={item.GetTrueName()}
                                    warbprop={item}
                                    isinner={true}
                                    index={warband?.warband_data.GetWarbandFactionModifiersList().indexOf(item)}
                                />
                            )}
                        </WbbDetailViewCollapse>
                    }

                    <WbbDetailViewCollapse title="Exploration Skills" initiallyOpen={true}>

                        <WbbExplorationSkills />

                    </WbbDetailViewCollapse>

                    {/* Notes textarea */}
                    <WbbDetailViewCollapse title="Notes & Lore" initiallyOpen={false}>
                        <WbbTextarea
                            initialText={warband.warband_data.GetWarbandNotes()}
                            title="Warband Notes"
                            onSave={(newText : string) => {
                                warband?.warband_data.SaveNote(newText, 'notes')
                                
                    
                                const Manager : ToolsController = ToolsController.getInstance();
                                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                                    () => reloadDisplay())
                            }}
                        />

                        {/* Lore  textarea */}
                        <WbbTextarea
                            initialText={warband.warband_data.GetLore()}
                            title="Warband Lore"
                            onSave={(newText : string) => {
                                warband?.warband_data.SaveNote(newText, 'lore')
                                
                    
                                const Manager : ToolsController = ToolsController.getInstance();
                                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                                    () => reloadDisplay())
                            }}
                        />
                    </WbbDetailViewCollapse>

                    { !playMode &&
                        <WbbDetailViewCollapse title="Advanced Options" initiallyOpen={false}>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="customModeToggle"
                                    checked={warbandEnableAdvancedOptions}
                                    onChange={(e) => setWarbandEnableAdvancedOptions(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="customModeToggle">
                                    {'Enable Advanced Options'}
                                </label>

                            </div>
                            <div className="form-text">
                                {'These options allow you to add custom fighters and items to your warband. They are not part of the official rules and should be used with caution.'}
                            </div>

                            {warbandEnableAdvancedOptions &&
                                <>
                                    <hr/>
                                    <div className={'btn btn-add-element btn-block mb-3'}
                                         onClick={() => setShowAddFighterCustomModal(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                        {'Add Custom Fighter'}
                                    </div>

                                    <div className={'btn btn-add-element btn-block mb-3'}
                                         onClick={() => setShowCustomitemAddToStash(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                                        {'Add Custom Item'}
                                    </div>
                                </>
                            }


                        </WbbDetailViewCollapse>
                    }
                </div>

                {showAddFighterCustomModal &&
                    <WbbModalAddFighterCustom
                        show={showAddFighterCustomModal}
                        onClose={() => setShowAddFighterCustomModal(false)}
                        onSubmit={handleCustomFighterSubmit}
                    />
                }
                {showCustomitemAddToStash &&
                    
                    <WbbEquipmentAddCustomStash
                        show={showCustomitemAddToStash}
                        onClose={() => setShowCustomitemAddToStash(false)}
                        onSubmit={handleCustomItemToStash}
                    />
                }
            </div>
        </div>
    );
};

export default WbbWarbandDetailView;
