import React, {useState} from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faFloppyDisk, faPen, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
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

interface WbbWarbandDetailViewProps {
    onClose: () => void;
}

const WbbWarbandDetailView: React.FC<WbbWarbandDetailViewProps> = ({  onClose }) => {

    const { warband, reloadDisplay } = useWarband();
    if (warband == null) return (<div>Loading...</div>);



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
                    </div>

                    { warband.warband_data.HasValidationErrors() &&
                        <div className="detail-section-text-element detail-section-text-element-validation-error">
                            <div className={'alert alert-warning'}>
                                <div className={'detail-section-text-element-validation-error-title'}>
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="icon-inline-left-l"/>
                                    {'Your warband is not valid'}
                                </div>

                                <ul>
                                    {warband.warband_data.GetValidationErrors().map((item, index) =>
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
                    {/* @TODO: only show if warband has options */}
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

                            {/*
                            // @TODO: Option like Sultan's Favour goes here
                            */}
                        </WbbDetailViewCollapse>
                    }

                    {/* Faction Selections */}
                    {warband?.warband_data.GetWarbandFactionOptionsModifiersList().length > 0 &&
                        <WbbDetailViewCollapse title='Faction Selections' initiallyOpen={true}>
                            
                            {warband?.warband_data.GetWarbandFactionOptionsModifiersList().map((item) =>
                                <WbbEditViewModifier
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


                </div>

            </div>
        </div>
    );
};

export default WbbWarbandDetailView;
