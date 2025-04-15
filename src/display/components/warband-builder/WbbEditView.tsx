import React, { useEffect, useState } from 'react';
import { UserWarband, IUserWarband } from '../../../classes/saveitems/Warband/UserWarband';

interface WbbEditViewProps {
    warbandData: IUserWarband;
}



const WbbEditView: React.FC = () => {

    /** Testing Data - @TODO: replace with actual warband Data */
    const warband = {
        Name:   'Lorem Warband Name',
        FactionName: 'The Iron Sultanate',
        CostDucats: 340,
        CostGlory: 4,
        MaxDucats: 700,
        MaxGlory: false,
        CampaignName: 'An awesome Campaign',
        CampaignId: 123,
        Models: [
            {
                FighterName: 'Ipsum Fighter Name',
                ModelName: 'Jabirean Alchemist',
                ModelId: 'rl_alchemists',
                FighterTotalBaseDucats: 75,
                FighterTotalBaseGlory: 0,
                FighterTotalCostDucats: 102,
                FighterTotalCostGlory: 2,
                IsElite: true,
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
                FighterName: 'Azeb Fighter Name',
                ModelName: 'Azeb',
                ModelId: 'rl_azeb',
                FighterTotalBaseDucats: 25,
                FighterTotalBaseGlory: 0,
                FighterTotalCostDucats: 35,
                FighterTotalCostGlory: 0,
                IsElite: false,
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





        return (
        <div className="WbbEditView">
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

                {/* Warband Elites */}

                {/* Warband Troops */}

                {/* Warband Mercenaries */}

                {/* Warband Modifiers */}

                {/* Warband Exploration */}


            </div>
        </div>
        );
};

export default WbbEditView;