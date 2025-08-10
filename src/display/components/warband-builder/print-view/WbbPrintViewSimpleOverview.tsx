import React, {useEffect, useState} from 'react';
import { useWarband } from '../../../../context/WarbandContext';
import logoDarkMode from "../../../../resources/images/trench-companion-logo-white-v2.png";
import logoLightMode from "../../../../resources/images/trench-companion-logo-black-v2.png";
import {UserWarband} from "../../../../classes/saveitems/Warband/UserWarband";
import { Faction } from '../../../../classes/feature/faction/Faction';
import {WarbandProperty} from "../../../../classes/saveitems/Warband/WarbandProperty";
import WbbEditViewExploration from "../WbbEditViewExploration";

const WbbPrintViewSimpleOverview: React.FC = () => {

    const { warband, updateKey } = useWarband();

    if (!warband ) return <div>Loading Warband...</div>;

    const stash = warband.warband_data.GetStash();
    const fighters = warband.warband_data.GetFighters();

    const [basevariant, setbasevariant] = useState<Faction | null>(null)
    const [keyvar, setkeyvar] = useState(0)
    
    useEffect(() => {
        async function RunGetLocations() {
            const facbase = await warband?.warband_data.GetFactionBase();
            if (facbase != undefined) {
                setbasevariant(facbase);
            }
            setkeyvar(keyvar + 1)
        }

        RunGetLocations()
    }, [updateKey]);

    const [locations, setlocations] = useState<WarbandProperty[]>([]);

    useEffect(() => {
        async function RunUpdate() {
            if (warband) {
                const Modifiers = warband?.warband_data.GetLocations();
                setlocations(Modifiers);
            }
            setkeyvar(keyvar + 1);
        }

        RunUpdate()
    }, [updateKey]);

    return (
        <div className="WbbPrintViewSimpleOverview" key={keyvar}>
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
                                {basevariant &&
                                    <>
                                        {basevariant.GetFactionName()}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'col-6'}>
                        <div className={'warband-faction-variant warband-box'}>
                            <div className={'warband-label'}>
                                {'Variant'}
                            </div>
                            <div className={'warband-value'}>
                                {warband.warband_data.GetFactionName()}
                                {warband.warband_data.Faction.MyFactionRules.map(
                                    (item : WarbandProperty) =>
                                        <div key={warband.warband_data.Faction.MyFactionRules.indexOf(item)}>
                                            {item.SelfDynamicProperty.Selections.map((sel) =>
                                            <div key={item.SelfDynamicProperty.Selections.indexOf(sel)}>
                                                {sel.SelectedChoice != null &&
                                                <>
                                                    {sel.SelectedChoice.display_str}
                                                </>}
                                            </div>)

                                            }
                                        </div>
                                )

                                }
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
                                {stash.AmountDucats}
                            </div>
                        </div>
                    </div>

                    <div className={'col-3'}>
                        <div className={'warband-glory warband-box'}>
                            <div className={'warband-label'}>
                                {'Glory Points'}
                            </div>
                            <div className={'warband-value'}>
                                {stash.AmountGlory}
                            </div>
                        </div>
                    </div>

                    <div className={'col-3'}>
                        <div className={'warband-campaign warband-box'}>
                            <div className={'warband-label'}>
                                {'Victory Points'}
                            </div>
                            <div className={'warband-value'}>
                                {warband.warband_data.GetVictoryPoints()}
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
                                {warband.warband_data.GetWarbandNotes()}
                            </div>
                        </div>
                    </div>

                    <div className={'col-6'}>
                        <div className={'warband-stash warband-box'}>
                            <div className={'warband-label'}>
                                {'Stash'}
                            </div>
                            <div className={'warband-value'}>
                                {warband?.warband_data.Equipment.map((item: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {item.GetItemName()}

                                        {/* Add comma if not the last item */}
                                        {index < warband?.warband_data.Equipment.length -1 &&
                                            <>
                                                {', '}
                                            </>
                                        }
                                    </React.Fragment>
                                ))}
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
                                {'Exploration Locations'}
                            </div>
                            <div className={'warband-value'}>
                                {locations.length > 0 &&
                                    <>
                                        {locations.map((location, index) =>
                                            <div key={index}>
                                                {location.GetOwnName()}
                                            </div>
                                        )}
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className={'col-6'}>
                        <div className={'warband-exploration warband-box '}>
                            <div className={'warband-label'}>
                                {'Modifiers'}
                            </div>
                            <div className={'warband-value'}>
                                {warband.warband_data.Modifiers.map(
                                    (item : WarbandProperty) =>
                                        <div key={warband.warband_data.Modifiers.indexOf(item)}>
                                            {item.SelfDynamicProperty.OptionChoice.GetTrueName()}
                                            {item.SelfDynamicProperty.Selections.map((sel) =>
                                            <div key={item.SelfDynamicProperty.Selections.indexOf(sel)}>
                                                {sel.SelectedChoice != null &&
                                                <>
                                                    {sel.SelectedChoice.display_str}
                                                </>}
                                            </div>)

                                            }
                                        </div>
                                )}
                                {warband.warband_data.Fireteams.map(
                                    (item : WarbandProperty) =>
                                        <div key={warband.warband_data.Fireteams.indexOf(item)}>
                                            {item.SelfDynamicProperty.OptionChoice.GetTrueName()}
                                            {item.SelfDynamicProperty.Selections.map((sel) =>
                                            <div key={item.SelfDynamicProperty.Selections.indexOf(sel)}>
                                                {sel.SelectedChoice != null &&
                                                <>
                                                    {sel.SelectedChoice.display_str}
                                                </>}
                                            </div>)

                                            }
                                        </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WbbPrintViewSimpleOverview;
