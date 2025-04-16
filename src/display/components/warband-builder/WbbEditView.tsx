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

interface WbbEditViewProps {
    warbandData: IUserWarband;
}



const WbbEditView: React.FC = () => {

    /** Testing Data - @TODO: replace with actual warband Data */
    const warband = {
        Name:   'Lorem Warband Name test',
        FactionName: 'The Iron Sultanate',
        CostDucats: 340,
        CostGlory: 4,
        MaxDucats: 700,
        MaxGlory: false,
        CampaignName: 'An awesome Campaign',
        LocalId: '2025-04-11-lorem-warband-test',
        SynodId: 222,
        CampaignId: 123,
        Models: [
            {
                FighterName: 'Olaf',
                ModelName: 'Jabirean Alchemist',
                ModelId: 'rl_alchemists',
                FighterBaseDucats: 75,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 102,
                FighterTotalCostGlory: 2,
                IsElite: true,
                IsMercenary: false,
                ExperiencePoints: 4,
                BattleScars: 1,
                Injuries: [
                    {
                        Name: 'Hand Wound',
                        Description: 'The character suffers -1 DICE for all of its melee attack ACTIONS.',
                        InjuryId: 'in_hand_wound'
                    }
                ],
                Advancements: [
                    {
                        Name: 'Stand Firm',
                        Description: 'This model treats the first Down result it suffers each battle as a Minor Hit.',
                        InjuryId: 'sk_standfirm',
                    }
                ],
                Equipment: [
                    {
                        Name: 'Siege Jezzail',
                        CostDucats: 30,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    }
                ]
            },
            {
                FighterName: 'Olaf',
                ModelName: 'Azeb',
                ModelId: 'rl_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 0,
                BattleScars: 0,
                Injuries: [
                ],
                Advancements: [

                ],
                Equipment: [
                    {
                        Name: 'Jezzail',
                        CostDucats: 7,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    },
                    {
                        Name: 'Alchemical Ammunition',
                        CostDucats: 3,
                        CostGlory: 0,
                        Type: 'Equipment'
                    }
                ]
            },
            {
                FighterName: 'Günther',
                ModelName: 'Azeb',
                ModelId: 'rl_azeb',
                FighterBaseDucats: 25,
                FighterBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
                IsMercenary: false,
                ExperiencePoints: 0,
                BattleScars: 0,
                Injuries: [
                ],
                Advancements: [

                ],
                Equipment: [
                    {
                        Name: 'Jezzail',
                        CostDucats: 7,
                        CostGlory: 0,
                        Type: 'Ranged Weapon'
                    },
                    {
                        Name: 'Alchemical Ammunition',
                        CostDucats: 3,
                        CostGlory: 0,
                        Type: 'Equipment'
                    }
                ]
            }
        ]

    }

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const fighterId = searchParams.get('fighter');

        if (fighterId) {
            const fighter = warband.Models.find((m) => m.ModelId === fighterId);
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
            {!selectedFighter &&
                <div className={'container'}>
                    <h1>{warband.Name}</h1>

                    {/* Warband Intro */}
                    <div className={'warband-summary'}>
                        <div className={''}>
                            {warband.FactionName}
                        </div>

                        <div className={'summary-cost-element'}>
                        <span className={'summary-cost-element-cost'}>
                            {'Ducats: '}{warband.CostDucats}
                        </span>

                            {warband.MaxDucats &&
                                <>
                                <span className={'summary-cost-element-seperator'}>
                                    {' / '}
                                </span>

                                    <span className={'summary-cost-element-max'}>
                                    {warband.MaxDucats}
                                </span>
                                </>
                            }
                        </div>

                        <div className={'summary-cost-element'}>
                        <span className={'summary-cost-element-cost'}>
                            {'Glory Points: '}{warband.CostGlory}
                        </span>

                            {warband.MaxGlory &&
                                <>
                                <span className={'summary-cost-element-seperator'}>
                                    {' / '}
                                </span>

                                    <span className={'summary-cost-element-max'}>
                                    {warband.MaxGlory}
                                </span>
                                </>
                            }
                        </div>

                        {warband.CampaignName &&
                            <div className={''}>
                                {warband.CampaignName}
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
                    {warband.Models.map((item, index) => (
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

                    <div className={'btn btn-primary btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Elite'}
                    </div>


                    {/* Warband Troops */}
                    <h3 className={'category-headline'}>Troops</h3>
                    {warband.Models.map((item, index) => (
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

                    <div className={'btn btn-primary btn-block'}>
                        <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                        {'Add Troop'}
                    </div>


                    {/* Warband Mercenaries */}
                    <h3 className={'category-headline'}>Mercenaries</h3>
                    {warband.Models.map((item, index) => (
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

                    <div className={'btn btn-primary btn-block'}>
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

                    <div className={'btn btn-primary btn-block'}>
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

                    <div className={'btn btn-primary btn-block'}>
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