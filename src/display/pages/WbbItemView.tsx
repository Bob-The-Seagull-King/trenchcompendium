import React, { useEffect, useRef, useState } from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { SumWarband, WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { useLocation, useNavigate } from 'react-router-dom';
import WarbandItemViewDisplay from '../components/features/saveitem/Warband/WarbandItemViewDisplay';
import {PrintModeProvider} from "../../context/PrintModeContext";
import PageMetaInformation from "../components/generics/PageMetaInformation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../components/generics/Loading-Overlay';
import { WarbandFactory } from '../../factories/warband/WarbandFactory';
import { WarbandProvider } from '../../context/WarbandContext';
import { PopoverProvider } from '../../context/PopoverContext';
import { PlayModeProvider } from '../../context/PlayModeContext';
import SynodFactionImage from '../../utility/SynodFactionImage';
import WbbTitle from '../components/warband-builder/micro-elements/WbbTitle';
import WbbEditViewWarband from '../components/warband-builder/WbbEditViewWarband';
import WbbEditViewStash from '../components/warband-builder/WbbEditViewStash';
import WbbEditViewCampaign from '../components/warband-builder/WbbEditViewCampaign';
import WbbViewFighters from '../components/warband-builder/micro-elements/WbbViewFighters';
import WbbModifiersList from '../components/warband-builder/modals/warband/WbbModifiersList';
import WbbViewFighterDetailView from '../components/warband-builder/WbbViewFighterDetailView';
import WbbWarbandDetailView from '../components/warband-builder/WbbWarbandDetailView';
import WbbViewStashDetailView from '../components/warband-builder/WbbViewStashDetailView';
import WbbViewCampaignDetailView from '../components/warband-builder/WbbViewCampaignDetailView copy';
import WbbViewLocations from '../components/warband-builder/modals/warband/WbbViewLocations';
import WbbContextualPopover from "../components/warband-builder/WbbContextualPopover";

const WbbItemView = (prop: any) => {
    
    const Warband : SumWarband = prop.warbandData;

    const navigate = useNavigate();
    const location = useLocation();
    
    /** Play mode */
    const [playMode, setPlayMode] = useState(true);
    const togglePlayMode = () => setPlayMode(true);

    /** Enable Browser Navigation for all detail types */
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('fighter')) {
            const fighterId = searchParams.get('fighter');
            const fighter = Warband.warband_data.GetFighters().find(f => f.model.ID === fighterId);
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
    }, [location.search]);

    //** Start Detail view stuff
    type DetailType = 'fighter' | 'stash' | 'warband' | 'campaign' | null;

    const [detailType, setDetailType] = useState<DetailType>(null);
    const [detailPayload, setDetailPayload] = useState<any>(null);
    const openDetail = (type: DetailType, payload: any = null) => { // Sets the detail type and payload and uses navigation to enable default browser nav
        setDetailType(type);
        setDetailPayload(payload);

        let query = '';

        if (type === 'fighter' && payload?.Slug) {
            query = `?fighter=${payload.Slug}`;
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

    // scroll to top when item is selected
    const selectedItemWrapRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`WbbEditView`}>
            {/* The Warband List */}
            <WarbandProvider warband={Warband}>
                <PopoverProvider> <PlayModeProvider value={{ playMode, togglePlayMode }}>
                    <PageMetaInformation
                        title={Warband.warband_data.GetWarbandName() + ' - Warband Display'}
                        description={'View the warband ' + Warband.warband_data.GetTrueName()}
                    />

                    <>
                        <div className={`warband-title ${detailType ? 'details-open' : ''}`}>
                            <div className={'container'}>

                                <WbbTitle/>

                            </div>
                        </div>

                        <div className={'WbbEditView-hero'}>
                            <SynodFactionImage
                                factionSlug={Warband.warband_data.GetFactionSlug()}
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

                                <WbbEditViewStash
                                    onClick={() => openDetail('stash', null)}
                                    isActive={detailType === 'stash'}
                                />

                                <WbbEditViewCampaign
                                    onClick={() => openDetail('campaign', null)}
                                    isActive={detailType === 'campaign'}
                                />

                                <WbbViewFighters 
                                    playMode={playMode}
                                    openDetail={openDetail}
                                    detailType={detailType}
                                    detailPayload={detailPayload}
                                />

                                <WbbModifiersList/>
                                <WbbViewLocations/>

                            </div>

                            <div className={'selected-item-wrap'} ref={selectedItemWrapRef}>
                                {/* The Fighter Detail View */}
                                {detailType === 'fighter' && detailPayload && (
                                    <WbbViewFighterDetailView
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
                                    <WbbViewStashDetailView
                                        onClose={closeDetail}
                                    />
                                )}

                                {/* The Campaign Detail View */}
                                {detailType === 'campaign' && (
                                    <WbbViewCampaignDetailView
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
                    </>
                </PlayModeProvider> </PopoverProvider>
            </WarbandProvider>
        </div>
    );
};

export default WbbItemView;