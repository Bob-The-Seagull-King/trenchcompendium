import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGlobalState } from '../../../../utility/globalstate'
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import { ControllerController } from '../../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from '../../../headers/components/CompendiumMenuItem';
import GenericLinkedCollapsableBlockDisplay from '../../generics/GenericLinkedCollapsableBlockDisplay';
import RulesMenuItem from "./RulesMenuItem";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc? : any;
    showState? : any;
    responseshow? : string;
}

const RulesMenuBody: React.FC<IControllerProp> = (prop) => {

    // Navigation
    const navigate = useNavigate();

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateOut() {
        navigate('/', {state: Date.now().toString()});
    }

    // @TODO: @Lane: Can we get this structure going and pass it like this throught the recursive menu items?
    const menu_structure = [
        {
            title: "Playtest Rules v1.6",
            slug: "playtest-rules-v1-6",
            children: [
                {
                    title: "Core Rules",
                    slug:  "core-rules",
                    children: [
                        {
                            title: "Introduction",
                            slug:  "introduction",
                        },
                        {
                            title: "What You Need To Play",
                            slug:  "what-you-need-to-play",
                        },
                        {
                            title: "Game Turn & Activations",
                            slug:  "game-turn-activations",
                        },
                        {
                            title: "+Dice and -Dice",
                            slug:  "dice",
                        },
                        {
                            title: "Blood Markers",
                            slug:  "blood-markers",
                        },
                        {
                            title: "Blessing Markers",
                            slug:  "blessing-markers",
                        },
                        {
                            title: "Movement",
                            slug:  "movement",
                        },
                        {
                            title: "Combat",
                            slug:  "combat",
                        },
                        {
                            title: "End of Activation",
                            slug:  "end-of-activation",
                        },
                        {
                            title: "Morale",
                            slug:  "morale",
                        },
                        {
                            title: "End of Turn",
                            slug:  "end-of-turn",
                        },
                    ]
                },
                {
                    title: "Keywords",
                    slug: "keywords",
                },
                {
                    title: "Starting a Warband",
                    slug: "starting-a-warband",
                    children: [
                        {
                            title: "Choose Your Faction",
                            slug: "choose-your-faction",
                        },
                        {
                            title: "Recruit Your Warband",
                            slug: "recruit-your-warband",
                        },
                        {
                            title: "Keywords",
                            slug: "keywords",
                        },
                        {
                            title: "Equipment",
                            slug: "equipment",
                        },
                        {
                            title: "Allies & Mercenaries",
                            slug: "allies-mercenaries",
                        },
                        {
                            title: "Purchasable Abilities",
                            slug: "purchasable-abilities",
                        },
                        {
                            title: "Roster",
                            slug: "Roster",
                        },
                        {
                            title: "Characteristics Profile",
                            slug: "characteristics-profile",
                        }
                    ]
                }
            ]
        },
        {
            title: "Factions",
            slug: "factions",
            children: [
                {
                    title: "Trench Pilgrims",
                    slug: "trench-pilgrims",
                    children: [
                        {
                            title: "Procession of the Sacred Affliction",
                            slug: "procession-of-the-sacred-affliction",
                        },
                        {
                            title: "Cavalcade of the Tenth Plague",
                            slug: "cavalcade-of-the-tenth-plague",
                        },
                        {
                            title: "War Pilgrimage of Saint Methodius",
                            slug: "war-pilgrimage-of-saint-methodius",
                        },
                    ]
                },
                {
                    title: "The Principality of New Antioch",
                    slug: "the-principality-of-new-antioch",
                    children: [
                        {
                            title: "Fida’i of Alamut – The Cabal of Assassins",
                            slug:  "fidai-of-alamut-the-cabal-of-assassins",
                        },
                        {
                            title: "The House of Wisdom",
                            slug:  "the-house-of-wisdom",
                        },
                    ]
                },
                {
                    title: "The Iron Sultanate",
                    slug: "the-iron-sultanate",
                    children: [
                        {
                            title: "Papal States Intervention Force",
                            slug:  "papal-states-intervention-force",
                        },
                        {
                            title: "Eire Rangers",
                            slug:  "eire-rangers",
                        },
                        {
                            title: "Stoßtruppen of the Free State of Prussia",
                            slug:  "stosstruppen-of-the-free-state-of-prussia",
                        },
                        {
                            title: "Kingdom of Alba Assault Detachment",
                            slug:  "kingdom-of-alba-assault-detachment",
                        },
                    ]
                },
                {
                    title: "Heretic Legion",
                    slug: "heretic-legion",
                    children: [
                        {
                            title: "Heretic Naval Raiding Party",
                            slug: "heretic-naval-raiding-party",
                        },
                        {
                            title: "Trench Ghosts",
                            slug:  "trench-ghosts",
                        },
                        {
                            title: "Knights of Avarice",
                            slug:  "knights-of-avarice",
                        },
                        {
                            title: "Kingdom of Alba Assault Detachment",
                            slug:  "kingdom-of-alba-assault-detachment",
                        },
                    ]
                },
                {
                    title: "Black Grail",
                    slug: "black-grail",
                    children: [
                        {
                            title: "Dirge of the Great Hegemon",
                            slug: "dirge-of-the-great-hegemon",
                        },
                    ]
                },
                {
                    title: "The Court of the seven headed serpent",
                    slug: "the-court-of-the-seven-headed-serpent",
                },
            ]
        },
        {
            title: "Weapons & Equipment",
            slug: "weapons-equipment",
            children: [
                {
                    title: "Ranged Weapons",
                    slug: "ranged-weapons",
                },
                {
                    title: "Melee Weapons",
                    slug: "melee-weapons",
                },
                {
                    title: "Equipment",
                    slug: "equipment",
                },
            ]
        },
        {
            title: "Campaign Rules",
            slug: "campaign-rules",
            children: [
                {
                    title: "Beginning the Campaign",
                    slug: "beginning-the-campaign",
                },
                {
                    title: "Patrons",
                    slug: "patrons",
                },
                {
                    title: "Playing a Campaign Game",
                    slug: "playing-a-campaign-game",
                },
                {
                    title: "Injuries and Battle Scars",
                    slug: "injuries-and-battle-scars",
                },
                {
                    title: "Experience & Advancement",
                    slug: "experience-advancement",
                },
                {
                    title: "Exploration",
                    slug: "exploration",
                    children: [
                        {
                            title: "Warband Exploration Skills",
                            slug: "warband-exploration-skills",
                        },
                        {
                            title: "Common Exploration Locations",
                            slug: "common-exploration-locations",
                        },
                        {
                            title: "Rare Exploration Locations",
                            slug: "rare-exploration-locations",
                        },
                        {
                            title: "Legendary Exploration Locations",
                            slug: "legendary-exploration-locations",
                        },
                    ]
                },
                {
                    title: "Glory Items",
                    slug: "equipment",
                },
            ]
        },
    ];

    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesMenuBody.tsx</div>}>
            <div className={'rules-menu-body'}>
                <div onClick={() => NavigateOut()} className={'home-link'}>
                    {"Home"}
                </div>

                <RulesMenuItem
                    data={menu_structure}
                />

                {/* @TODO: Add secondary elements here   */}
            </div>
        </ErrorBoundary>

    );
}

export default RulesMenuBody

