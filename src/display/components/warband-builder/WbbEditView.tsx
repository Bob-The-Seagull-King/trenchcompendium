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
import WbbContextualPopover from "./WbbContextualPopover";
import WbbPrintViewSimple from "./WbbPrintViewSimple";
import {useGlobalState} from "../../../utility/globalstate";
import SynodFactionImage from "../../../utility/SynodFactionImage";
import PageMetaInformation from "../generics/PageMetaInformation";
import WbbTitle from './micro-elements/WbbTitle';
import { FactionModelRelationship } from '../../../classes/relationship/faction/FactionModelRelationship';
import WbbFighterAdds from './micro-elements/WbbFighterAdds';
import WbbFighterShows from './micro-elements/WbbFighterShows';
import WbbModifiersList from './modals/warband/WbbModifiersList';
import WbbLocationsList from './Exploration/WbbLocationsList';
import {useWbbMode} from "../../../context/WbbModeContext";
import WbbUserinfo from "./WbbUserinfo";
import WbbEditViewExplorationLocations from "./WbbEditViewExplorationLocations";
import WbbExplorationDetailView from "./WbbExplorationDetailView";
import WbbPostGameDetailView from "./WbbPostGameDetailView";
import WbbJsonLDSchema from "../JSON-LD-Schema/WbbJsonLDSchema";

interface WbbEditViewProps {
    warbandData: SumWarband | null;
    manager : WarbandManager;
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
    type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | 'exploration' | 'post-game' | null;

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

    // theme
    const [theme, setTheme] = useGlobalState('theme');



    /**
     * View Modes v2
     */
    const { mode, play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode();

    /** Print Mode */
    // Manually exit print mode
    const exitPrintMode = () => {
        setMode('edit');

        // Restore previous theme
        document.body.setAttribute('data-theme', theme);

        // Remove print data attribute
        document.body.removeAttribute('data-print');
        // Remove the ?print parameter from the URL and push the change into history
        const url = new URL(window.location.href);
        url.searchParams.delete('print');
        window.history.pushState({}, '', url.toString());
    };

    // Central helper to update the mode based on the current URL
    const updatePrintModeFromUrl = () => {
        // Parse the current query string; URL.searchParams returns a URLSearchParams object:contentReference[oaicite:2]{index=2}
        const params = new URLSearchParams(window.location.search);
        const isPrint = params.get('print') === 'true';

        if (isPrint) {
            // Switch to print mode if ?print=true is present
            setMode('print');
            document.body.setAttribute('data-print', 'print');
        } else {
            if (print_mode) {
                // Otherwise ensure edit mode
                setMode('edit');
            }
            document.body.removeAttribute('data-print');
        }
    };

    // On initial mount and whenever the route or search string changes, apply the correct mode
    useEffect(() => {
        updatePrintModeFromUrl();
    }, [location.pathname, location.search]);

    // Listen for back/forward navigation; the popstate event fires when the user moves within the history stack:contentReference[oaicite:3]{index=3}
    useEffect(() => {
        const handlePopState = () => {
            updatePrintModeFromUrl();
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Optionally intercept calls to history.pushState so that programmatic URL changes also update the mode.
    // pushState itself does not emit a popstate event:contentReference[oaicite:4]{index=4}.
    useEffect(() => {
        const originalPushState = window.history.pushState;
        window.history.pushState = function (...args) {
            originalPushState.apply(this, args);
            updatePrintModeFromUrl();
        };

        return () => {
            window.history.pushState = originalPushState;
        };
    }, []);
    /** End Print Mode */


    return (
        <div className={`WbbEditView ${print_mode ? 'print-mode' : ''}`}>
            {/* The Warband List */}
            {(warband !== null) ? (
                <WarbandProvider warband={warband}>
                    <PopoverProvider>
                        <PageMetaInformation
                            title={warband.warband_data.GetWarbandName() + ' - Warband Manager'}
                            description={'Manage your warband with Trench Companion, the official resource for Trench Crusade.'}
                        />

                        {!print_mode &&
                            <>
                                <div className={`warband-title ${detailType ? 'details-open' : ''}`}>
                                    <div className={'container'}>

                                        <WbbTitle />

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

                                        <WbbUserinfo/>


                                        <WbbEditViewWarband
                                            onClick={() => openDetail('warband', null)}
                                            isActive={detailType === 'warband'}
                                        />

                                        {(edit_mode || view_mode) &&
                                            <WbbEditViewStash
                                                onClick={() => openDetail('stash', null)}
                                                isActive={detailType === 'stash'}
                                            />
                                        }

                                        {(edit_mode || view_mode) &&
                                            <WbbEditViewCampaign
                                                onClick={() => openDetail('campaign', null)}
                                                isActive={detailType === 'campaign'}
                                            />
                                        }

                                        {/* Exploration Tab*/}
                                        {(edit_mode || view_mode) &&
                                            <WbbEditViewExplorationLocations
                                                onClick={() => openDetail('exploration', null)}
                                                isActive={detailType === 'exploration'}
                                            />
                                        }

                                        {/* @TODO: This opens the post-game helper. */}
                                        {/*<button*/}
                                        {/*    onClick={() => openDetail('post-game', null)}*/}
                                        {/*>*/}
                                        {/*    {'open post game helper'}*/}
                                        {/*</button>*/}

                                        <WbbFighterShows
                                            openDetail={openDetail}
                                            detailType={detailType}
                                            detailPayload={detailPayload}
                                            setShowAddFighterEliteModal={setShowAddFighterEliteModal}
                                            setShowAddFighterTroopModal={setShowAddFighterTroopModal}
                                            setShowAddFighterMercenaryModal={setShowAddFighterMercenaryModal}
                                        />

                                        <WbbModifiersList/>
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

                                        {/* The Campaign Exploration View */}
                                        {detailType === 'exploration' && (
                                            <WbbExplorationDetailView
                                                key={detailType}
                                                onClose={closeDetail}
                                            />
                                        )}


                                        {/* The Post Ganme Helper View */}
                                        {/* @TODO this is the post game helper detail view WIP */}
                                        {/*{detailType === 'post-game' && (*/}
                                        {/*    <WbbPostGameDetailView*/}
                                        {/*        onClose={closeDetail}*/}
                                        {/*    />*/}
                                        {/*)}*/}

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
                            </>
                        }

                        {/* Print Mode */}
                        {print_mode &&
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

                    </PopoverProvider>

                    {/* The Schema Markup for the Warband*/}
                    <WbbJsonLDSchema />
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