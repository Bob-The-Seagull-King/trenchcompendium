import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import RulesMenuItem from "./RulesMenuItem";
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';

interface RulesMenuBodyProps {
    controller: any;
    onBack?: () => void;
}

const RulesMenuBody: React.FC<RulesMenuBodyProps> = ({ controller, onBack }) => {

    // Navigation
    const navigate = useNavigate();

    function NavigateHome() {
        navigate('/', {state: Date.now().toString()});
    }

    const [menu_struc] = useState(returnMenuStruc())

    function returnMenuStruc() {
        const menu_structure = [
            {
                title: "Playtest v1.6",
                slug: "",
                superslug: "compendium/gamerule",
                children: [
                    {
                        title: "Rules",
                        slug: "gamerule",
                        controller: controller.GameRulesCollectionController
                    },
                    {
                        title: "Keywords",
                        slug: "keyword"
                    },
                    {
                        title: "Glossary",
                        slug: "glossary"
                    },
                    {
                        title: "Units / Models",
                        slug: "model"
                    }               
                ]
            },
            {
                title: "Factions",
                slug: "faction",
                controller: controller.FactionCollectionController
            },
            {
                title: "Armoury & Equipment",
                slug: "armoury"
            },
            {
                title: "Scenarios",
                slug: "scenario",
                controller: controller.ScenarioCollectionController,
                children: [
                    {
                        title: "Random Scenario",
                        slug: "randomscenario"
                    }
                ]
            },
            {
                title: "Campaigns 1.6.3",
                slug: "",
                superslug: "compendium/campaignrule",
                children: [
                    {
                        title: "Rules",
                        slug: "campaignrule",
                        controller: controller.CampaignRulesCollectionController
                    },
                    {
                        title: "Patrons",
                        slug: "patron",
                        controller: controller.PatronCollectionController
                    },
                    {
                        title: "Exploration",
                        slug: "explorationtable",
                        controller: controller.ExplorationTableCollectionController
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
            },
            {
                title: "Errata",
                slug: "errata",
                controller: controller.ErrataRulesCollectionController
            }
        ]
        return menu_structure;
    }


    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesMenuBody.tsx</div>}>
            <div className={'RulesMenuBody menu-body'}>
                <div className={'rules-menu-header'}>
                    {onBack &&
                        <div onClick={onBack} className={'home-link'}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </div>
                    }

                    {!onBack &&
                        <div onClick={() => NavigateHome()} className={'home-link'}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </div>
                    }

                    <div onClick={() => navigate('/compendium/')} className={'compendium-link'}>
                        {'Rules Compendium'}
                    </div>
                </div>

                {menu_struc.map((item => (
                    <RulesMenuItem key={item.title}
                                   data={[item]}
                    />
                )))}

            </div>
        </ErrorBoundary>

    );
}

export default RulesMenuBody

