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
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';

interface RulesMenuBodyProps {
    controller: any;
    onBack?: () => void;
    onNavigate?: () => void;
}

const RulesMenuBody: React.FC<RulesMenuBodyProps> = ({ controller, onBack, onNavigate }) => {

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
                slug: "game",
                children: [
                    {
                        title: "Rules",
                        slug: "rules",
                        controller: controller.GameRulesCollectionController
                    },
                    {
                        title: "Keywords",
                        slug: "keyword"
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
                slug: "campaign",
                children: [
                    {
                        title: "Rules",
                        slug: "campaign_rules",
                        controller: controller.CampaignRulesCollectionController
                    },
                    {
                        title: "Patrons",
                        slug: "patron",
                        controller: controller.PatronCollectionController
                    },
                    {
                        title: "Exploration Locations",
                        slug: "explorationtable",
                        controller: controller.ExplorationTableCollectionController
                    },
                    {
                        title: "Skills",
                        slug: "skills"
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

                    {/* Main Area view */}
                    {!onBack &&
                        <CustomNavLink link={`/compendium/`}
                            runfunc={() => {NavigateHome()}}
                            classes={'home-link'}
                        >
                    <FontAwesomeIcon icon={faChevronLeft}/>
                        </CustomNavLink>
                    }

                    <CustomNavLink link={`/compendium/`}
                                   runfunc={() => {
                                       navigate('/compendium/')
                                       if (onNavigate) onNavigate();
                                   }}
                                   classes={'compendium-link'}
                    >
                        {'Rules Compendium'}
                    </CustomNavLink>
                </div>

                {menu_struc.map((item => (
                    <RulesMenuItem
                        key={item.title}
                        data={[item]}
                        onNavigate={onNavigate}
                    />
                )))}

            </div>
        </ErrorBoundary>

    );
}

export default RulesMenuBody

