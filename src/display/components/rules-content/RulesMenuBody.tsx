import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import RulesMenuItem from "./RulesMenuItem";
import RulesMenuSettings from "./RulesMenuSettings";
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';

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
    const [warband_struc, setwarbands] = useState([{
        title: "New Warband",
        slug: "new"
    }])
    const [keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function SetWarbands() {
            
            const SetOfWarbands : any[] = []

            const tools : ToolsController = ToolsController.getInstance();
            await tools.UserWarbandManager.GetItemsAll();

            for (let i = 0; i < tools.UserWarbandManager.WarbandItemList.length; i++) {
                SetOfWarbands.push(
                    {
                        title: tools.UserWarbandManager.WarbandItemList[i].Name,
                        slug: tools.UserWarbandManager.WarbandItemList[i].ID
                    }
                )
            }
            
            const WarbandSet : any[] = [
                {
                    title: "New Warband",
                    slug: "new"
                },
                {
                    title: "Your Warbands",
                    slug: "edit",
                    children: SetOfWarbands
                }
            ]

            setwarbands(WarbandSet);
            setkeyvar(keyvar + 1);
        }

        SetWarbands();
    }, []);

    function returnMenuStruc() {
        const menu_structure = [
            {
                title: "Playtest v1.6",
                slug: "",
                children: [
                    {
                        title: "Rules",
                        slug: "gamerule",
                        controller: prop.controller.GameRulesCollectionController
                    }      ,
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
                title: "Armoury & Equipment",
                slug: "armoury"
            },
            {
                title: "Units / Models",
                slug: "model"
            },
            {
                title: "Scenarios",
                slug: "scenario",
                controller: prop.controller.ScenarioCollectionController,
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
                        slug: "explorationtable",
                        controller: prop.controller.ExplorationTableCollectionController
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
                controller: prop.controller.ErrataRulesCollectionController
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

                <div className={'rules-menu-header'}>
                    <div onClick={() => NavigateHome()} className={'home-link'}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>

                    <div onClick={() => navigate('/warband/')} className={'compendium-link'}>
                        {'Warband Manager'}
                    </div>
                </div>

                <RulesMenuItem key={'warbands' + keyvar.toString()}
                data={warband_struc}
                parentPath={'warband'}
                />

                <RulesMenuSettings />
            </div>
        </ErrorBoundary>

    );
}

export default RulesMenuBody

