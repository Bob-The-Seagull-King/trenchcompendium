import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Item } from '../../classes/saveitems/item';
import { GenerateDeployment, GenerateObjective, ScenarioGenerator } from '../../classes/feature/scenario/ScenarioGenerator';
import ScenarioDisplay from '../components/features/scenario/ScenarioDisplay';
import GenericDisplay from '../components/generics/GenericDisplay';
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import { Scenario } from '../../classes/feature/scenario/Scenario';
import { returnDescription } from '../../utility/util';
import GloriousDeedDisplay from '../components/features/scenario/GloriousDeedDisplay';
import { DescriptionFactory } from '../../utility/functions';
import RulesGloriousDeed from '../components/rules-content/RulesGloriousDeed';
import PageMetaInformation from "../components/generics/PageMetaInformation";
import SynodImage from '../../utility/SynodImage';
import RulesAnchorLinks, { ContentsLink } from '../components/rules-content/RulesAnchorLinks';
import RulesHeadlineDisplay from '../components/rules-content/RulesHeadlineDisplay';

const ToolsRandomScenarioRules = (prop: any) => {
    const Manager : ScenarioGenerator = prop.manager? prop.manager : getManager();
    
    function getManager() {        
        const ToolsManagerScenario = ToolsController.getInstance();
        ToolsManagerScenario.RandomScenarioManager = new ScenarioGenerator();

        return ToolsManagerScenario.RandomScenarioManager;
    }

    const [_currentItem, returnItem] = useState<Scenario | null>(null);
    const [_keyval, returnkey] = useState(1);

    
    useEffect(() => {
        async function SetScenario() {
            if (Manager.CurrentScenario == null || Manager.CurrentScenario == undefined) {
                await Manager.ResetScenario();
                returnItem(Manager.CurrentScenario);
                returnkey(_keyval + 1)
            }
        }

        SetScenario();
    }, []);
    

    async function newScenario() {
        await Manager.ResetScenario();
        returnItem(Manager.CurrentScenario);
        returnkey(_keyval + 1)
    }

    function returnDeployment(deploy : GenerateDeployment) {
        return (
            <>
                <div className={'rules-scenario-summary-content rules-card-content'}>
                    <div 
                        style={{width:"100%"}}>
                    <h3>{deploy.name}</h3>
                    <SynodImage
                        imageId={Number(deploy.img_link)}
                        size="large"
                        className="rules-banner-image-element"
                    /></div>

                    {
                        returnDescription(Manager, DescriptionFactory(deploy.description, Manager))
                    }
                </div>
            </>
        )
    }

    function returnScenario(deploy : GenerateObjective) {
        return (
            <>
                <div className={'rules-scenario-summary-content rules-card-content'}>
                    <h3>{deploy.name}</h3>
                    {
                        returnDescription(Manager, DescriptionFactory(deploy.description, Manager))
                    }
                </div>
            </>
        )
    }

    
    function GetContents() {
        const ContentsList : ContentsLink[] = [];
        ContentsList.push({ name: "Roll For Scenario Type", route: "rollforscenariotype"})
        ContentsList.push({ name: "Roll for Deployment Type", route: "rollfordeploymenttype"})
        ContentsList.push({ name: "Glorious Deeds", route: "gloriousdeeds"})

        return ( <RulesAnchorLinks title={"Contents"} listofcontents={ContentsList}/> )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ToolsRandomScenario.tsx</div>}>
            <div className={'rules-content-main'}>

                <PageMetaInformation
                    title={'Random Scenario'}
                    description={'Create a random scenario for your trench crusade games'}
                />

                <RulesHeadlineDisplay
                    content="Random Scenario"
                    level={1}
                    className=""
                />
                
                {GetContents()}

                {/* Scenario */}
                {
                    returnDescription(Manager,  Manager.RulesDataDesc )
                }


                <div className={'spacer-20'}></div>

                <RulesHeadlineDisplay
                    content="Roll For Scenario Type"
                    level={1}
                    className=""
                />
                {
                    returnDescription(Manager,  Manager.ScenarioDataDesc )
                }
                {
                    Manager.ListOfObjectives.map((item) =>
                    <div key={item.id}>
                        {returnScenario(item)}
                    </div>)
                }

                {/* Deployments */}
                <RulesHeadlineDisplay
                    content="Roll for Deployment Type"
                    level={1}
                    className=""
                />
                {
                    returnDescription(Manager, Manager.DeploymentDataDesc)
                }
                {
                    Manager.ListOfDeployments.map((item) =>
                    <div key={item.id}>
                        {returnDeployment(item)}
                    </div>)
                }

                {/* Glorious Deeds */}
                <RulesHeadlineDisplay
                    content="Glorious Deeds"
                    level={1}
                    className=""
                />
                {
                    returnDescription(Manager, Manager.DeedDataDesc)
                }

                <h2>Die Result - Player 1</h2>
                {
                    Manager.ListOfDeedsGroupA.map((item) =>
                    <RulesGloriousDeed key={item.ID} data={item}/>)
                }

                <h2>Die Result - Player 2</h2>
                {
                    Manager.ListOfDeedsGroupB.map((item) =>
                    <RulesGloriousDeed key={item.ID} data={item}/>)
                }

                <h2>Deeds to Always Include</h2>
                {
                    Manager.ListOfDeedsGroupC.map((item) =>
                    <RulesGloriousDeed key={item.ID} data={item}/>)
                }
            </div>

        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRandomScenarioRules