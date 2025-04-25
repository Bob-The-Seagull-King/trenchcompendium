import React, { useEffect, useState } from 'react';
import { UserWarband, IUserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import WbbWarbandListItem from "./WbbWarbandListItem";
import WbbEditViewFighter from "./WbbEditViewFighter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
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
import WbbStashDetailView from "./WbbStashDetailView";
import WbbWarbandDetailView from "./WbbWarbandDetailView";
import WbbCampaignDetailView from "./WbbCampaignDetailView";
import {PopoverProvider} from "../../../context/PopoverContext";
import {WarbandProvider} from "../../../context/WarbandContext";

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

    useEffect(() => {
        if (warbandData) {
            // warbandData is already a UserWarband instance
            setWarband(warbandData);
        }
    }, [warbandData]);

    /** Enable Browser Navigation for all detail types */
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('fighter')) {
            const fighterId = searchParams.get('fighter');
            const fighter = warband?.GetFighters().find(f => f.ModelId === fighterId);
            if (fighter) {
                setDetailType('fighter');
                setDetailPayload(fighter);
            }
        } else if (searchParams.has('stash')) {
            setDetailType('stash');
            setDetailPayload(null);
        } else if (searchParams.has('campaign')) {
            setDetailType('campaign');
            setDetailPayload(null);
        } else if (searchParams.has('warband')) {
            setDetailType('warband');
            setDetailPayload(null);
        } else {
            setDetailType(null);
            setDetailPayload(null);
        }
    }, [location.search, warband]);

    //** Start Detail view stuff
    type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | null;

    const [detailType, setDetailType] = useState<DetailType>(null);
    const [detailPayload, setDetailPayload] = useState<any>(null);
    const openDetail = (type: DetailType, payload: any = null) => { // Sets the detail type and payload and uses navigation to enable default browser nav
        setDetailType(type);
        setDetailPayload(payload);

        let query = '';

        if (type === 'fighter' && payload?.ModelId) {
            query = `?fighter=${payload.ModelId}`;
        } else if (type === 'stash') {
            query = `?stash`;
        } else if (type === 'campaign') {
            query = `?campaign`;
        } else if (type === 'warband') {
            query = `?warband`;
        }

        // Always preserve the full pathname (like /warband/edit/WarbandName)
        navigate(`${location.pathname}${query}`, { replace: false });
    };
    const closeDetail = () => {
        setDetailType(null);
        setDetailPayload(null);
        navigate(location.pathname, { replace: false }); // remove search params
    };


    /** Modals */

    // Add Fighter Modal (Troop, Elite, Mercenaries)
    const [showAddFighterTroopModal, setShowAddFighterTroopModal] = useState(false);
    const [showAddFighterEliteModal, setShowAddFighterEliteModal] = useState(false);
    const [showAddFighterMercenaryModal, setShowAddFighterMercenaryModal] = useState(false);
    const handleFighterSubmit = (newFighter: { id: string; name: string }[]) => {
        if (!warband) { return; } // Guard

        warband.AddFighter(newFighter);
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
            {(warband !== null) ? (
                <WarbandProvider warband={warband}>
                    <PopoverProvider>
                        <div className={'container WbbEditViewMain'}>
                            <div className={`warband-wrap ${detailType ? 'details-open' : ''}`}>
                                <h1>{warband.GetWarbandName()}</h1>

                                {/* Warband Meta */}

                                <WbbEditViewWarband
                                    onClick={() => openDetail('warband', null)}
                                    isActive={detailType === 'warband'}
                                />

                                <WbbEditViewStash
                                    onClick={() => openDetail('stash', null)}
                                    isActive={detailType === 'stash'}
                                />

                                <WbbEditViewCampaign
                                    onClick={() => openDetail('campaign', null)}
                                    isActive={detailType === 'campaign'}
                                />

                                {/* Warband Elites */}
                                <h3 className={'category-headline'}>Elites</h3>
                                {warband.GetFighters().map((item, index) => (
                                    <>
                                        {item.IsElite &&
                                            <WbbEditViewFighter
                                                item={item} index={index}
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={detailType === 'fighter' && detailPayload?.FighterIndex === item.FighterIndex}
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
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={detailType === 'fighter' && detailPayload?.FighterIndex === item.FighterIndex}
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
                                                onClick={() => openDetail('fighter', item)}
                                                isActive={detailType === 'fighter' && detailPayload?.FighterIndex === item.FighterIndex}
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
                                    index={123}
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
                                    index={123}
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
                                {detailType === 'fighter' && detailPayload && (
                                    <WbbFighterDetailView
                                        fighter={detailPayload}
                                        onClose={closeDetail}
                                    />
                                )}

                                {/* The Warband Detail View */}
                                {detailType === 'warband' && (
                                    <WbbWarbandDetailView
                                        onClose={closeDetail}
                                    />
                                )}

                                {/* The Stash Detail View */}
                                {detailType === 'stash' && (
                                    <WbbStashDetailView
                                        onClose={closeDetail}
                                    />
                                )}

                                {/* The Campaign Detail View */}
                                {detailType === 'campaign' && (
                                    <WbbCampaignDetailView
                                        onClose={closeDetail}
                                    />
                                )}

                                {/* Empty Fallback */}
                                {detailType === null && (
                                    <div className={'selected-item-empty'}>
                                        {/*{'Nothing selected'}*/}
                                    </div>
                                )}
                            </div>
                        </div>

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
                    </PopoverProvider>
                </WarbandProvider>
            ) : (
                <div className={'WbbLoadingOverlay'}>
                    <div className={'loading-inner'}>
                        <FontAwesomeIcon icon={faCircleNotch} className="fa-spin"/>
                        <div className={'text'}>
                            {'Loading'}
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default WbbEditView;