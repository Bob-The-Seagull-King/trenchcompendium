import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import ViewTableItemDisplay from '../../display/components/subcomponents/list/ViewTableItemDisplay'
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import ContentsComponentLink, { ContentsLink } from '../components/subcomponents/informationpanel/ContentsComponentLink';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumBasePage: React.FC<IControllerProp> = (prop: any) => {
    
    

        function GetContentsTableRules() {
            const ContentsList : ContentsLink[] = [];
    
            ContentsList.push({ name: "Game Rules", route: "gamerule"})
            ContentsList.push({ name: "Errata", route: "errata"})
            ContentsList.push({ name: "Glossary", route: "glossary"})
            ContentsList.push({ name: "Keywords", route: "keyword"})
    
            return ( <ContentsComponentLink title={"Rules"} showheader={true} listofcontents={ContentsList}/> )
        }

        function GetContentsTableWarbands() {
            const ContentsList : ContentsLink[] = [];

            ContentsList.push({ name: "Equipment & Weapons", route: "equipment"})
            ContentsList.push({ name: "Factions", route: "faction"})
            ContentsList.push({ name: "Models", route: "model"})
    
            return ( <ContentsComponentLink title={"Warbands"} showheader={true} listofcontents={ContentsList}/> )
        }

        function GetContentsTableScenarios() {
            const ContentsList : ContentsLink[] = [];
    
            ContentsList.push({ name: "Scenarios", route: "scenario"})
    
            return ( <ContentsComponentLink title={"Scenario"} showheader={true} listofcontents={ContentsList}/> )
        }

        function GetContentsTableCampaign() {
            const ContentsList : ContentsLink[] = [];
            ContentsList.push({ name: "Campaigns", route: "campaignrule"})
            ContentsList.push({ name: "Exploration", route: "explorationtable"})
            ContentsList.push({ name: "Injuries", route: "injury"})
            ContentsList.push({ name: "Patrons", route: "patron"})
            ContentsList.push({ name: "Skills", route: "skillgroup"})
    
            return ( <ContentsComponentLink title={"Campaign"} showheader={true} listofcontents={ContentsList}/> )
        }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with BaseDisplayCompendium.tsx</div>}>
            <>
                <div>
                    {/*<div className="colourdefault font-seriftext size-section">*/}
                    <h1 className="">
                        {"Compendium"}
                    </h1>
                </div>
                <div>
                    <div className=""/>
                    <div className="colourBasicText  ">
                        {GetContentsTableRules()}
                    </div>
                    <div className=""/>
                    <div className="colourBasicText  ">
                        {GetContentsTableWarbands()}
                    </div>
                    <div className=""/>
                    <div className="colourBasicText  ">
                        {GetContentsTableScenarios()}
                    </div>
                    <div className=""/>
                    <div className="colourBasicText  ">
                        {GetContentsTableCampaign()}
                    </div>
                </div>
                <div className=""/>
            </>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumBasePage