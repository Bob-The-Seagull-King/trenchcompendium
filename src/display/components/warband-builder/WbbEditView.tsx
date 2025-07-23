import React, {useEffect, useRef, useState} from 'react';
import { UserWarband, IUserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import WbbWarbandListItem from "./WbbWarbandListItem";
import WbbEditViewFighter from "./WbbEditViewFighter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faCircleNotch, faCopy, faDice, faPen, faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbEditViewStash from "./WbbEditViewStash";
import WbbEditViewModifier from "./WbbEditViewModifier";
import WbbEditViewExploration from "./WbbEditViewExploration";
import WbbFighterDetailView from "./WbbFighterDetailView";
import { useNavigate, useLocation } from 'react-router-dom';
import {SumWarband, WarbandManager} from "../../../classes/saveitems/Warband/WarbandManager";
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
import {useWarband, WarbandProvider} from "../../../context/WarbandContext";
import {PlayModeProvider, usePlayMode} from "../../../context/PlayModeContext";
import WbbContextualPopover from "./WbbContextualPopover";
import {PrintModeProvider, usePrintMode} from "../../../context/PrintModeContext";
import WbbPrintViewSimple from "./WbbPrintViewSimple";
import {useGlobalState} from "../../../utility/globalstate";
import SynodFactionImage from "../../../utility/SynodFactionImage";
import PageMetaInformation from "../generics/PageMetaInformation";
import WbbTitle from './micro-elements/WbbTitle';
import { FactionModelRelationship } from '../../../classes/relationship/faction/FactionModelRelationship';
import WbbFighterAdds from './micro-elements/WbbFighterAdds';
import WbbFighterShows from './micro-elements/WbbFighterShows';
import WbbModifiersList from './modals/warband/WbbModifiersList';
import WbbLocationsList from './modals/warband/WbbLocationsList';

interface WbbEditViewProps {
    warbandData: SumWarband | null;
    manager : WarbandManager
}



const WbbEditView: React.FC<WbbEditViewProps> = ({ warbandData }) => {

    /** Set Navigation */
    const navigate = useNavigate();
    const location = useLocation();

    /** Set Warband as Class */
    const [warband, setWarband] = useState<SumWarband | null>(null);

    useEffect(() => {
        if (warbandData) {
            // warbandData is already a UserWarband instance
            setWarband(warbandData);
        }
    }, [warbandData]);

    //** Start Detail view stuff
    type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | null;

    const [detailType, setDetailType] = useState<DetailType>(null);
    const [detailPayload, setDetailPayload] = useState<any>(null);

    const openDetail = (type: DetailType, payload: any = null) => {
        setDetailPayload(payload);
        setDetailType(type);

        // Only push history if detail view was not open
        if (detailType === null) {
            window.history.pushState({ detailOpen: true }, '');
        }
    };

    const closeDetail = () => {
        setDetailPayload(null);
        setDetailType(null);
        
        // Recover old history state
        window.history.replaceState({}, '');
    };

    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            if (detailType !== null) {
                closeDetail();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [detailType]);



    // scroll to top when item is selected
    const selectedItemWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!detailType) return; // Only react when a detail is selected (fighter, stash, etc.)

        const isMobile = window.innerWidth <= 767;

        if (isMobile && selectedItemWrapRef.current) {
            window.scrollTo(0, 0);
        }
    }, [detailType]);

    /** Modals */
    // Add Fighter Modal (Troop, Elite, Mercenaries)
    const [showAddFighterTroopModal, setShowAddFighterTroopModal] = useState(false);
    const [showAddFighterEliteModal, setShowAddFighterEliteModal] = useState(false);
    const [showAddFighterMercenaryModal, setShowAddFighterMercenaryModal] = useState(false);
    


    // Modifier Modal
    const [showAddModifierModal, setShowAddModifierModal] = useState(false);
    const handleAddModifier = (modifier: any, selectedOption: any) => {
        if (!warband) { return; } // Guard
        warband.warband_data.AddModifier( modifier, selectedOption );
    };



    /** Play mode */
    const [playMode, setPlayMode] = useState(false);
    const togglePlayMode = () => setPlayMode(prev => !prev);


    /** Print Mode */
    const [theme, setTheme] = useGlobalState('theme');

    const { printMode, setPrintMode } = usePrintMode();
    const exitPrintMode = () => {
        setPrintMode(false);

        // Restore previous theme
        document.body.setAttribute('data-theme', theme);

        // Remove print data attribute
        document.body.removeAttribute('data-print');
    };


    return (
        <div className={`WbbEditView ${printMode ? 'print-mode' : ''}`}>
            {/* The Warband List */}
            {(warband !== null) ? (
                <WarbandProvider warband={warband}>
                    <PopoverProvider> <PlayModeProvider value={{ playMode, togglePlayMode }}>
                        <PageMetaInformation
                            title={warband.warband_data.GetWarbandName() + ' - Warband Manager'}
                            description={'Manage your warband with Trench Companion, the official resource for Trench Crusade.'}
                        />

                        {!printMode &&
                            <>
                                <div className={`warband-title ${detailType ? 'details-open' : ''}`}>
                                    <div className={'container'}>

                                        <WbbTitle/>

                                        <WbbContextualPopover
                                            id={'warband-actions'}
                                            type="warband"
                                            item={warband}
                                        />

                                    </div>
                                </div>

                                <div className={'WbbEditView-hero'}>
                                    <SynodFactionImage
                                        factionSlug={warband.warband_data.GetFactionSlug()}
                                        size={'full'}
                                    />
                                </div>

                                <div className={'container WbbEditViewMain'}>

                                    <div className={`warband-wrap ${detailType ? 'details-open' : ''}`}>
                                        {/* Warband Meta */}

                                        <WbbEditViewWarband
                                            onClick={() => openDetail('warband', null)}
                                            isActive={detailType === 'warband'}
                                        />

                                        {!playMode &&
                                            <WbbEditViewStash
                                                onClick={() => openDetail('stash', null)}
                                                isActive={detailType === 'stash'}
                                            />
                                        }

                                        {!playMode &&
                                            <WbbEditViewCampaign
                                                onClick={() => openDetail('campaign', null)}
                                                isActive={detailType === 'campaign'}
                                            />
                                        }

                                        <WbbFighterShows 
                                            playMode={playMode}
                                            openDetail={openDetail}
                                            detailType={detailType}
                                            detailPayload={detailPayload}
                                            setShowAddFighterEliteModal={setShowAddFighterEliteModal}
                                            setShowAddFighterTroopModal={setShowAddFighterTroopModal}
                                            setShowAddFighterMercenaryModal={setShowAddFighterMercenaryModal}
                                        />

                                        <WbbModifiersList/>

                                        {!playMode &&
                                            <WbbLocationsList/>
                                        }
                                    </div>

                                    <div className={'selected-item-wrap'} ref={selectedItemWrapRef}>
                                        {/* The Fighter Detail View */}
                                        {detailType === 'fighter' && detailPayload && (
                                            <WbbFighterDetailView
                                                warbandmember={detailPayload}
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

                                <WbbFighterAdds
                                    showAddFighterEliteModal={showAddFighterEliteModal}
                                    showAddFighterTroopModal={showAddFighterTroopModal}
                                    showAddFighterMercenaryModal={showAddFighterMercenaryModal}
                                    onCloseMercenary={() => setShowAddFighterMercenaryModal(false)}
                                    onCloseElite={() => setShowAddFighterEliteModal(false)}
                                    onCloseTroop={() => setShowAddFighterTroopModal(false)}
                                />
                                <WbbModalAddModifier
                                    show={showAddModifierModal}
                                    onClose={() => setShowAddModifierModal(false)}
                                    onSubmit={handleAddModifier}
                                />
                            </>
                        }

                        {/* Print Mode */}
                        {printMode &&
                            <>
                                <div className={'container'}>
                                    <div className={'exit-print-view'} onClick={exitPrintMode}>
                                    <FontAwesomeIcon icon={faChevronLeft} className="icon-inline-left-l"/>
                                        {'Back to Warband'}
                                    </div>
                                </div>

                                <WbbPrintViewSimple />
                            </>
                        }

                    </PlayModeProvider> </PopoverProvider>
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