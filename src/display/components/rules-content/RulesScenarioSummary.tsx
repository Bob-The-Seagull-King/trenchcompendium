import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import {Scenario} from "../../../classes/feature/scenario/Scenario";
import SynodImage from '../../../utility/SynodImage';

const RulesScenarioSummary = (props: any) => {
    const scenarioObject: Scenario = props.data

    function ScenarioSummaryTable(statlist : Scenario) {
        return (
            <>
                <tr>
                    <td className={'label-cell'}>
                        {"Players"}
                    </td>
                    <td>
                        {(statlist.EvenMatch ? "Even Match" : "Attack / Defend")}
                    </td>
                </tr>

                <tr>
                    <td className={'label-cell'}>
                        {"Infiltrators"}
                    </td>
                    <td>
                        {(statlist.InfiltratorType == 0 ? "Not Allowed" : statlist.InfiltratorType == 1 ? "Allowed" : "Special")}
                    </td>
                </tr>

                <tr>
                    <td className={'label-cell'}>
                        {"Battle Length"}
                    </td>
                    <td>
                        {(statlist.BattleMin == statlist.BattleMax ? statlist.BattleMin : (statlist.BattleMin + "-" + statlist.BattleMax)) + " Turns"}
                    </td>
                </tr>

                <tr>
                    <td className={'label-cell'}>
                        {"Standard Terrain"}
                    </td>
                    <td>
                        {(statlist.StandardTerrain == true ? "Yes" : "No")}
                    </td>
                </tr>

                <tr>
                    <td className={'label-cell'}>
                        {"Staggered Deployment"}
                    </td>
                    <td>
                        {(statlist.StaggeredDeployment == true ? "Yes" : "No")}
                    </td>
                </tr>
            </>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with GloriousDeedDisplay.tsx</div>}>
            <div className={'RulesScenarioSummary rules-scenario-summary rules-card'}>
                <div className={'rules-scenario-summary-title rules-card-title'}>
                    {'Scenario Summary'}
                </div>

                <div className={'rules-scenario-summary-content rules-card-content'}>
                    <div 
                        style={{width:"100%"}}>
                        <SynodImage
                        imageId={Number(scenarioObject.ImgLink)}
                        size="large"
                        className="rules-banner-image-element"
                    /></div>

                    <table className={'rules-scenario-summary-table rules-card-table'}>
                        <tbody>
                            {ScenarioSummaryTable(scenarioObject)}
                        </tbody>
                    </table>

                </div>


            </div>
        </ErrorBoundary>
)
}

export default RulesScenarioSummary;