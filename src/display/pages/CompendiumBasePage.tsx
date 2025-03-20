import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import ViewTableItemDisplay from '../../display/components/subcomponents/list/ViewTableItemDisplay'
import BaseFilterSelectDisplay from '../../display/components/subcomponents/filters/BaseFilterSelectDisplay'
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import ContentsComponentLink, { ContentsLink } from '../components/subcomponents/informationpanel/ContentsComponentLink';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const CompendiumBasePage: React.FC<IControllerProp> = (prop: any) => {
    
    

        function GetContentsTableRules() {
            const ContentsList : ContentsLink[] = [];
    
            ContentsList.push({ name: "Campaigns", route: "campaign"})
            ContentsList.push({ name: "Game Rules", route: "gamerule"})
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
            ContentsList.push({ name: "Exploration", route: "exploration"})
            ContentsList.push({ name: "Injuries", route: "injury"})
            ContentsList.push({ name: "Patrons", route: "patron"})
            ContentsList.push({ name: "Skills", route: "skill"})
    
            return ( <ContentsComponentLink title={"Campaign"} showheader={true} listofcontents={ContentsList}/> )
        }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with BaseDisplayCompendium.tsx</div>}>
            <div className="col-lg-6 col-md-12">
                <div>
                    <div className="colourdefault font-seriftext size-section">
                        {"Compendium"}
                    </div>
                </div>
                <div>
                    <div className="verticalspacermed"/>
                    <div className="colourBasicText font-default">
                        {GetContentsTableRules()}
                    </div>
                    <div className="verticalspacermed"/>
                    <div className="colourBasicText font-default">
                        {GetContentsTableWarbands()}
                    </div>
                    <div className="verticalspacermed"/>
                    <div className="colourBasicText font-default">
                        {GetContentsTableScenarios()}
                    </div>
                    <div className="verticalspacermed"/>
                    <div className="colourBasicText font-default">
                        {GetContentsTableCampaign()}
                    </div>
                </div>
                <div className="verticalspacermed"/>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CompendiumBasePage