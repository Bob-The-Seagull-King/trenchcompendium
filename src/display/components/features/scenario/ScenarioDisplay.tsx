import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { Scenario } from '../../../../classes/feature/scenario/Scenario';
import GenericDisplay from '../../generics/GenericDisplay';
import { ToastContainer, toast } from 'react-toastify';
import RuleDisplay from '../faction/RuleDisplay';
import GloriousDeedDisplay from './GloriousDeedDisplay';
import GenericPopup from '../../generics/GenericPopup';
import ItemStat from '../../subcomponents/description/ItemStat';
import { getMoveType, getPotential, getBaseSize } from '../../../../utility/functions';
import ItemRow from '../../../components/subcomponents/description/ItemRow';
import { Faction } from '../../../../classes/feature/faction/Faction';
import ContentsComponentAnchor, { ContentsLink } from '../../../components/subcomponents/informationpanel/ContentsComponentAnchor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import RulesAnchorLinks from "../../rules-content/RulesAnchorLinks";
import RulesHeadlineDisplay from "../../rules-content/RulesHeadlineDisplay";
import RulesGloriousDeed from "../../rules-content/RulesGloriousDeed";
import RulesScenarioSummary from "../../rules-content/RulesScenarioSummary";

const ScenarioDisplay = (props: any) => {
    const scenarioObject: Scenario = props.data




    function GetContents(scenarioObj: Scenario) {
        const ContentsList: ContentsLink[] = [];

        ContentsList.push({name: "Forces", route: "forces"})
        ContentsList.push({name: "Infiltrators", route: "infiltrators"})
        ContentsList.push({ name: "Battle Length", route: "battlelength"})
        ContentsList.push({ name: "Battlefield", route: "battlefield"})
        ContentsList.push({ name: "Deployment", route: "deployment"})
        ContentsList.push({ name: "Victory Conditions", route: "victory"})
        if (scenarioObj.SpecialRules != undefined) {
            for (let i = 0; i < scenarioObj.SpecialRules.length; i++ ) {
                const scenname = scenarioObj.SpecialRules[i].Name
                ContentsList.push({ name: scenname? scenname : "", route: scenarioObj.SpecialRules[i].ID})
            }
        }
        ContentsList.push({ name: "Glorious Deeds", route: "deeds"})

        return ( <RulesAnchorLinks title={"Contents"} listofcontents={ContentsList}/> )
    }

    function runToast() 
    {
        navigator.clipboard.writeText(window.location.href)

        toast.error("Link Copied!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "success"
        });
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ScenarioDisplay.tsx</div>}>

            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                {GetContents(scenarioObject)}


                <RulesScenarioSummary
                    data={scenarioObject}
                />

                {scenarioObject.Description.length > 0 &&
                    <div className={"rules-text-item"}>
                        {returnDescription(scenarioObject, scenarioObject.Description)}
                    </div>
                }

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Forces"}
                        level={2}
                    />

                    {returnDescription(scenarioObject, scenarioObject.ForcesDesc)}
                </div>

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Infiltrators"}
                        level={2}
                    />

                    {returnDescription(scenarioObject, scenarioObject.InfiltratorDesc)}
                </div>

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Battle Length"}
                        level={2}
                    />

                    {returnDescription(scenarioObject, scenarioObject.BattlelengthDesc)}
                </div>

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Battlefield"}
                        level={2}
                    />

                    {scenarioObject.BattlefieldSize &&
                        <>
                            {returnDescription(scenarioObject, scenarioObject.BattlefieldSize)}
                        </>
                    }

                    {scenarioObject.BattlefieldExtra &&
                        <>
                            {returnDescription(scenarioObject, scenarioObject.BattlefieldExtra)}
                        </>
                    }

                    {scenarioObject.StandardTerrain &&
                        <>
                            <RulesHeadlineDisplay
                                content={"Standard Terrain Rules"}
                                level={3}
                            />

                            {returnDescription(scenarioObject, scenarioObject.BattlefieldTerrainStandard)}
                        </>
                    }
                </div>

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Deployment"}
                        level={2}
                    />

                    {returnDescription(scenarioObject, scenarioObject.DeploymentDesc)}
                </div>

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Victory Conditions"}
                        level={2}
                    />

                    {returnDescription(scenarioObject, scenarioObject.VictoryDesc)}
                </div>


                {scenarioObject.SpecialRules != undefined && <>
                    
                    {scenarioObject.SpecialRules.map((item) => (
                                    
                                    <div key={item.ID} className={"rules-text-item"}>
                                        <RulesHeadlineDisplay
                                            content={item.Name? item.Name : ""}
                                            level={2}
                                        />

                                        {returnDescription(item, item.Description)}
                                    </div>
                            ))}
                    </>}

                <div className={"rules-text-item"}>
                    <RulesHeadlineDisplay
                        content={"Glorious Deeds"}
                        level={2}
                    />

                    <p>
                        {returnDescription(scenarioObject, scenarioObject.DeedsDesc)}
                    </p>

                    {scenarioObject.Deeds.map((item) => (
                        <React.Fragment key={"faction_rule_" + scenarioObject.ID + "_rule_id_" + item.ID}>
                            <RulesGloriousDeed
                                data={item}
                            />
                        </React.Fragment>
                    ))}


                    {scenarioObject.OptionalDeeds.length > 0 &&
                        <>
                            <RulesHeadlineDisplay
                                content={"Optional Glorious Deeds"}
                                level={2}
                            />

                            {"If agreed by the players prior to starting the game, you may replace one of the Glory Deeds above for one of the following options:"}

                            {scenarioObject.OptionalDeeds.map((item) => (
                                <React.Fragment key={"faction_rule_" + scenarioObject.ID + "_rule_id_" + item.ID}>
                                    {/* Your child components here */}
                                    <RulesGloriousDeed
                                        data={item}
                                    />
                                </React.Fragment>
                            ))}
                        </>
                    }
                </div>

                <div className="">

                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ScenarioDisplay;