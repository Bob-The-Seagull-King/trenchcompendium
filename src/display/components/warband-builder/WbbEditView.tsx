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

    return (
        <div className="WbbEditView">
            {/* The Warband List */}
            {(warband != null && !selectedFighter) &&
                <div className={'container WbbEditViewMain'}>
                    <h1>{warband.GetWarbandName()}</h1>

                    {/* Warband Intro */}
                    <div className={'warband-summary'}>
                        <div className={''}>
                            {warband.GetFactionName()}
                        </div>

                        <div className={'summary-cost-element'}>
                        <span className={'summary-cost-element-cost'}>
                            {'Ducats: '}{warband.GetCostDucats()}
                        </span>

                            {warband.GetMaxDucats() > 0 &&
                                <>
                                    <span className={'summary-cost-element-seperator'}>
                                        {' / '}
                                    </span>

                                    <span className={'summary-cost-element-max'}>
                                        {warband.GetMaxDucats()}
                                    </span>
                                </>
                            }
                        </div>

                        <div className={'summary-cost-element'}>
                        <span className={'summary-cost-element-cost'}>
                            {'Glory Points: '}{warband.GetCostGlory()}
                        </span>

                            {warband.GetMaxGlory() > 0 &&
                                <>
                                    <span className={'summary-cost-element-seperator'}>
                                        {' / '}
                                    </span>

                                    <span className={'summary-cost-element-max'}>
                                        {warband.GetMaxGlory()}
                                    </span>
                                </>
                            }
                        </div>

                        {warband.GetCampaignName() &&
                            <div className={''}>
                                {warband.GetCampaignName()}
                            </div>
                        }
                    </div>

                    {/* Warband Ressources */}
                    <h3 className={'category-headline'}>Ressources</h3>
                    <WbbEditViewStash
                        warband={warband}
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

                    <div className={'btn btn-add-element btn-block'}>
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

                    <div className={'btn btn-add-element btn-block'}>
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

                    <div className={'btn btn-add-element btn-block'}>
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

                    <div className={'btn btn-add-element btn-block'}>
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

                    <div className={'btn btn-add-element btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Exploration'}
                    </div>
                </div>
            }

            {/* The Fighter Detail View */}
            {selectedFighter && (
                <WbbFighterDetailView
                    fighter={selectedFighter}
                    onClose={() => setSelectedFighter(null)}
                />
            )}
        </div>
    );
};

export default WbbEditView;