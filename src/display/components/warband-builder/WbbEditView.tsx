import React, { useEffect, useState } from 'react';
import { UserWarband, IUserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import WbbWarbandListItem from "./WbbWarbandListItem";
import WbbEditViewFighter from "./WbbEditViewFighter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbEditViewStash from "./WbbEditViewStash";
import WbbEditViewModifier from "./WbbEditViewModifier";
import WbbEditViewExploration from "./WbbEditViewExploration";
import WbbFighterDetailView from "./WbbFighterDetailView";
import { useNavigate, useLocation } from 'react-router-dom';
import {WarbandManager} from "../../../classes/saveitems/Warband/WarbandManager";
import WbbModalAddFighterTroop from "./modals/WbbModalAddFighterTroop";
import WbbModalAddFighterElite from "./modals/WbbModalAddFighterElite";
import WbbModalAddFighterMercenary from "./modals/WbbModalAddFighterMercenary";
import WbbModalAddExplorationLocation from "./modals/WbbModalAddExplorationLocation";
import WbbModalAddModifier from "./modals/WbbModalAddModifier";
import WbbEditViewWarband from "./WbbEditViewWarband";
import WbbEditViewCampaign from "./WbbEditViewCampaign";

interface WbbEditViewProps {
    warbandData: UserWarband | null;
    manager : WarbandManager
}



const WbbEditView: React.FC<WbbEditViewProps> = ({ warbandData }) => {

    /** Set Navigation */
    const navigate = useNavigate();
    const location = useLocation();

    /** Set Warband as Class */
    const [warband, setWarband] = useState<UserWarband | null>(null);

    // if( warband === null ) {
    //     return ''; // @TODO: what if warband is null
    // }

    useEffect(() => {
        if (warbandData) {
            // warbandData is already a UserWarband instance
            setWarband(warbandData);
        }
    }, [warbandData]);

    /** Use effect for fighter card*/
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const fighterId = searchParams.get('fighter');

        if (warband && fighterId) {
            const fighter = warband.GetFighters().find((m) => m.ModelId === fighterId);
            if (fighter) {
                setSelectedFighter(fighter);
            }
        } else {
            setSelectedFighter(null);
        }
    }, [location.search]);

    // will check which popover is active to only have 1 open at the same time
    const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

    // keeps track of which fighter opened a detail view
    const [selectedFighter, setSelectedFighter] = useState<any | null>(null);

    const openFighter = (item: any) => {
        setSelectedFighter(item);
        navigate(`?fighter=${item.ModelId}`, { replace: false });
    };

    const closeFighter = (item: any) => {
        navigate('.', { replace: false }); // removes the ?fighter param
        setSelectedFighter(null);
    };


    /** Modals */

    // Add Fighter Modal (Troop, Elite, Mercenaries)
    const [showAddFighterTroopModal, setShowAddFighterTroopModal] = useState(false);
    const [showAddFighterEliteModal, setShowAddFighterEliteModal] = useState(false);
    const [showAddFighterMercenaryModal, setShowAddFighterMercenaryModal] = useState(false);
    const handleFighterSubmit = (selectedFighter: { id: string; name: string }[]) => {
        if (!warband) { return; } // Guard

        warband.AddFighter(selectedFighter);
    };

    // Exploration Location Modal
    const [showAddExplorationModal, setShowAddExplorationModal] = useState(false);
    const handleAddExplorationLocation = (location: any, selectedOptions: any[]) => {
        if (!warband) { return; } // Guard

        warband.AddExplorationLocation(location, selectedOptions);
    };

    // Modifier Modal
    const [showAddModifierModal, setShowAddModifierModal] = useState(false);
    const handleAddModifier = (modifier: any, selectedOption: any) => {
        if (!warband) { return; } // Guard
        warband.AddModifier( modifier, selectedOption );
    };


    return (
        <div className="WbbEditView">
            {/* The Warband List */}
            {(warband != null) &&
                <div className={'container WbbEditViewMain'}>
                    <div className={`warband-wrap ${selectedFighter ? 'fighter-selected' : ''}`}>
                        <h1>{warband.GetWarbandName()}</h1>

                        {/* Warband Meta */}

                        <WbbEditViewWarband
                            faction={warband.GetFactionName()}
                            name={warband.GetWarbandName()}
                            ratingDucats={warband.GetCostDucats()}
                            ratingGlory={warband.GetCostGlory()}
                            countElite={warband.GetFighters().filter(f => f.IsElite).length}
                            countTroop={warband.GetFighters().filter(f => !f.IsElite && !f.IsMercenary).length}
                        />

                        <WbbEditViewStash
                            warband={warband}
                        />

                        <WbbEditViewCampaign
                            campaignName={warband.GetCampaignName()}
                            patron={warband.GetPatron()?.Name || 'None'}
                            victoryPoints={warband.GetVictoryPoints()}
                            campaignCycle={warband.GetCampaignCycle()}
                            battlesFought={warband.GetBattleCount()}
                        />

                        {/* Warband Elites */}
                        <h3 className={'category-headline'}>Elites</h3>
                        {warband.GetFighters().map((item, index) => (
                            <>
                                {item.IsElite &&
                                    <WbbEditViewFighter
                                        item={item} index={index}
                                        activePopoverId={activePopoverId}
                                        setActivePopoverId={setActivePopoverId}
                                        onClick={() => openFighter(item)}
                                    />
                                }
                            </>
                        ))}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddFighterEliteModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Elite'}
                        </div>


                        {/* Warband Troops */}
                        <h3 className={'category-headline'}>Troops</h3>
                        {warband.GetFighters().map((item, index) => (
                            <>
                                {!item.IsElite &&
                                    <WbbEditViewFighter
                                        item={item} index={index}
                                        activePopoverId={activePopoverId}
                                        setActivePopoverId={setActivePopoverId}
                                        onClick={() => openFighter(item)}
                                    />
                                }
                            </>
                        ))}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddFighterTroopModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Troop'}
                        </div>


                        {/* Warband Mercenaries */}
                        <h3 className={'category-headline'}>Mercenaries</h3>
                        {warband.GetFighters().map((item, index) => (
                            <>
                                {item.IsMercenary &&
                                    <WbbEditViewFighter
                                        item={item} index={index}
                                        activePopoverId={activePopoverId}
                                        setActivePopoverId={setActivePopoverId}
                                        onClick={() => openFighter(item)}
                                    />
                                }
                            </>
                        ))}

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddFighterMercenaryModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Mercenary'}
                        </div>

                        {/* Warband Modifiers */}
                        <h3 className={'category-headline'}>Modifiers</h3>
                        <WbbEditViewModifier
                            warband={warband} index={123}
                            activePopoverId={activePopoverId}
                            setActivePopoverId={setActivePopoverId}
                        />

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddModifierModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Modifier'}
                        </div>

                        {/* Warband Exploration */}
                        <h3 className={'category-headline'}>Exploration</h3>

                        <WbbEditViewExploration
                            warband={warband} index={123}
                            activePopoverId={activePopoverId}
                            setActivePopoverId={setActivePopoverId}
                        />

                        <div className={'btn btn-add-element btn-block'}
                             onClick={() => setShowAddExplorationModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                            {'Add Exploration'}
                        </div>
                    </div>

                    <div className={'selected-item-wrap'}>
                        {/* The Fighter Detail View */}
                        {selectedFighter && (
                            <WbbFighterDetailView
                                fighter={selectedFighter}
                                onClose={() => setSelectedFighter(null)}
                            />
                        )}

                        {!selectedFighter && (
                            <div className={'selected-item-empty'}>
                                {/*{'Nothing selected'}*/}
                            </div>
                        )}
                    </div>
                </div>
            }



            <WbbModalAddFighterTroop
                show={showAddFighterTroopModal}
                onClose={() => setShowAddFighterTroopModal(false)}
                onSubmit={handleFighterSubmit}
            />
            <WbbModalAddFighterElite
                show={showAddFighterEliteModal}
                onClose={() => setShowAddFighterEliteModal(false)}
                onSubmit={handleFighterSubmit}
            />
            <WbbModalAddFighterMercenary
                show={showAddFighterMercenaryModal}
                onClose={() => setShowAddFighterMercenaryModal(false)}
                onSubmit={handleFighterSubmit}
            />
            <WbbModalAddModifier
                show={showAddModifierModal}
                onClose={() => setShowAddModifierModal(false)}
                onSubmit={handleAddModifier}
            />
            <WbbModalAddExplorationLocation
                show={showAddExplorationModal}
                onClose={() => setShowAddExplorationModal(false)}
                onSubmit={handleAddExplorationLocation}
            />
        </div>
    );
};

export default WbbEditView;