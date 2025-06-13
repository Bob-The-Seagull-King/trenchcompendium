import React, {useState} from 'react';
import { useWarband } from '../../../../context/WarbandContext';
import { usePrintMode } from '../../../../context/PrintModeContext';
import logoDarkMode from "../../../../resources/images/trench-companion-logo-white-v2.png";
import logoLightMode from "../../../../resources/images/trench-companion-logo-black-v2.png";
import {UserWarband} from "../../../../classes/saveitems/Warband/UserWarband";

const WbbPrintViewSimpleOverview: React.FC = () => {
    const { printMode } = usePrintMode();

    const { warband } = useWarband();

    if (!warband ) return <div>Loading Warband...</div>;

    const stash = warband.warband_data.GetStash();
    const fighters = warband.warband_data.GetFighters();

    return (
        <div className="WbbPrintViewSimpleOverview">
            <div className={'page-fill'}>
                <div className={'logo-wrap'}>
                    <img src={logoLightMode}
                         alt="Trench Companion Logo"
                         className={'logo'}
                    />
                </div>

                <div className={'headline'}>
                    {'Warband Roster Sheet'}
                </div>

                <div className={'warband-name warband-box'}>
                    <div className={'warband-label'}>
                        {'Warband Name'}
                    </div>
                    <div className={'warband-value'}>
                        {warband.warband_data.GetWarbandName()}
                    </div>
                </div>

                <div className={'row'}>
                    <div className={'col-6'}>
                        <div className={'warband-faction warband-box'}>
                            <div className={'warband-label'}>
                                {'Faction'}
                            </div>
                            <div className={'warband-value'}>
                                {warband.warband_data.GetFactionBaseName()}
                            </div>
                        </div>
                    </div>
                    <div className={'col-6'}>
                        <div className={'warband-faction-variant warband-box'}>
                            <div className={'warband-label'}>
                                {'Variant'}
                            </div>
                            <div className={'warband-value'}>
                                {warband.warband_data.GetFactionVariantName()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'row'}>
                    <div className={'col-3'}>
                        <div className={'warband-ducats warband-box'}>
                            <div className={'warband-label'}>
                                {'Pay Chest'}
                            </div>
                            <div className={'warband-value'}>
                                {stash.ValueDucats}
                            </div>
                        </div>
                    </div>

                    <div className={'col-3'}>
                        <div className={'warband-glory warband-box'}>
                            <div className={'warband-label'}>
                                {'Glory Points'}
                            </div>
                            <div className={'warband-value'}>
                                {stash.ValueGlory}
                            </div>
                        </div>
                    </div>

                    <div className={'col-3'}>
                        <div className={'warband-campaign warband-box'}>
                            <div className={'warband-label'}>
                                {'Campaign Points'}
                            </div>
                            <div className={'warband-value'}>
                                {/* @TODO: Add campaign points*/}
                                {'0'}
                            </div>
                        </div>
                    </div>

                    <div className={'col-3'}>
                        <div className={'warband-rating warband-box'}>
                            <div className={'warband-label'}>
                                {'Warband Rating'}
                            </div>
                            <div className={'warband-value'}>

                                {warband.warband_data.GetCostDucats()}{' Ducats'}
                                {' | '}
                                {warband.warband_data.GetCostGlory()}{' Glory'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'row stretch-to-bottom'}>
                    <div className={'col-6'}>
                        <div className={'warband-notes warband-box '}>
                            <div className={'warband-label'}>
                                {'Notes'}
                            </div>
                            <div className={'warband-value'}>
                                {/* @TODO: add warband notes here */}
                            </div>
                        </div>
                    </div>

                    <div className={'col-6'}>
                        <div className={'warband-stash warband-box'}>
                            <div className={'warband-label'}>
                                {'Stash'}
                            </div>
                            <div className={'warband-value'}>
                                {stash.Items.length > 0
                                    ? stash.Items.map((item: any, idx: number) => (
                                        <div className={'warband-value-item'} key={idx}>
                                            {item.Name}
                                        </div>
                                    ))
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'page-fill'}>
                <div className={'row stretch-to-bottom'}>
                    <div className={'col-6'}>
                        <div className={'warband-exploration warband-box '}>
                            <div className={'warband-label'}>
                                {'Exploration'}
                            </div>
                            <div className={'warband-value'}>
                                {/* @TODO: add exploration locations here */}
                            </div>
                        </div>
                    </div>

                    <div className={'col-6'}>
                        <div className={'warband-exploration warband-box '}>
                            <div className={'warband-label'}>
                                {'Modifiers'}
                            </div>
                            <div className={'warband-value'}>
                                {/* @TODO: add modifiers here */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WbbPrintViewSimpleOverview;
