import '../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import RulesMenuItem from "./RulesMenuItem";
import RulesMenuSettings from "./RulesMenuSettings";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc? : any;
    showState? : any;
    responseshow? : string;
}

const RulesMenuBody: React.FC<IControllerProp> = (prop) => {

    // Navigation
    const navigate = useNavigate();

    function NavigateHome() {
        navigate('/', {state: Date.now().toString()});
    }

    const [menu_struc] = useState(returnMenuStruc())

    function returnMenuStruc() {
        /**
        Playtest 1.6
            - Rules (controller)
            - Keywords
            - Glossary
        Factions (controller)
        Models
        Equipment
        Scenarios (controller)
        Campaigns
            - Rules (controller)
            - Patrons (controller)
            - Exploration
            - Injuries
            - Skills
         */
        const menu_structure = [
            {
                title: "Playtest v1.6",
                slug: "",
                children: [
                    {
                        title: "Rules",
                        slug: "gamerule",
                        controller: prop.controller.GameRulesCollectionController
                    }   ,
                    {
                        title: "Keywords",
                        slug: "keyword"
                    }   ,
                    {
                        title: "Glossary",
                        slug: "glossary"
                    }                       
                ]
            },
            {
                title: "Factions",
                slug: "faction",
                controller: prop.controller.FactionCollectionController
            },
            {
                title: "Weapons & Equipment",
                slug: "equipment"
            },
            {
                title: "Units / Models",
                slug: "model"
            },
            {
                title: "Scenarios",
                slug: "scenario",
                controller: prop.controller.ScenarioCollectionController
            },
            {
                title: "Campaigns 1.3",
                slug: "",
                children: [
                    {
                        title: "Rules",
                        slug: "campaignrule",
                        controller: prop.controller.CampaignRulesCollectionController
                    },
                    {
                        title: "Patrons",
                        slug: "patron",
                        controller: prop.controller.PatronCollectionController
                    },
                    {
                        title: "Exploration",
                        slug: "explorationtable"
                    },
                    {
                        title: "Skills",
                        slug: "skillgroup"
                    },
                    {
                        title: "Injuries",
                        slug: "injury"
                    }                       
                ]
            }
        ]
        return menu_structure;
    }


    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesMenuBody.tsx</div>}>
            <div className={'RulesMenuBody rules-menu-body'}>
                <div className={'rules-menu-header'}>
                    <div onClick={() => NavigateHome()} className={'home-link'}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>

                    <div onClick={() => navigate('/compendium/')} className={'compendium-link'}>
                        {'Rules Compendium'}
                    </div>
                </div>

                {menu_struc.map((item => (
                    <RulesMenuItem key={item.title}
                    data={[item]}
                    />
                )))}

                <RulesMenuSettings />
                {/* @TODO: Add secondary elements here   */}
            </div>
        </ErrorBoundary>

    );
}

export default RulesMenuBody

