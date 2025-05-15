import { FilterManager } from "../../classes/viewmodel/collections/filters/FilterManager"
import { ErrorBoundary } from "react-error-boundary";
import {FilterTextItem, FilterMiscItem, FilterRangeItem, FilterTagSet, FilterMiscSet} from "../components/subcomponents/filters/FilterItems"
import GenericDisplay from "../components/generics/GenericDisplay"
import GlossaryDisplay from "../components/features/glossary/GlossaryDisplay"
import KeywordDisplay from "../components/features/glossary/KeywordDisplay";
import ModelCollectionDisplay from "../components/features/model/ModelCollectionDisplay";
import FactionCollectionDisplay from "../components/features/faction/FactionCollectionDisplay";
import ScenarioDisplay from "../components/features/scenario/ScenarioDisplay";
import BookRuleDisplay from "../components/features/glossary/BookRuleDisplay";
import PatronDisplay from "../components/features/skill/PatronDisplay";
import GenericCollapsableBlockDisplay from "../components/generics/GenericCollapsableBlockDisplay";
import RulesInjuriesTable from "../components/rules-content/RulesInjuriesTable";
import RulesExplotationTable from "../components/rules-content/RulesExplotationTable";
import RulesSkillTable from "../components/rules-content/RulesSkillTable";
import RulesEquipmentEntry from "../components/rules-content/RulesEquipmentEntry";
import { CollectionsListPage } from "../../classes/viewmodel/pages/CollectionListPage";
import RulesKeywordsTable from "../components/rules-content/RulesKeywordsTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import RulesBannerImage from "../components/rules-content/RulesBannerImage";
import RulesBannerText from "../components/rules-content/RulesBannerText";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import { Link } from 'react-router-dom'
import {ControllerController} from "../../classes/_high_level_controllers/ControllerController";
import WbbFactionSelectItem from "../components/warband-builder/WbbFactionSelectItem";
import RulesBannerFaction from "../components/rules-content/RulesBannerFaction";

export interface DisplayCollectionType {
    searchId      : string,
    titlename     : string,
    laconic       : string,
    width         : number,
    menushowitems : boolean,
    hidefilter?   : boolean,
    defaultpage?  : (ViewPageController: CollectionsListPage) => JSX.Element,
    categoryparam?: string,
    returnDisplay: (item: any) => JSX.Element
    returnFilterSelect: (manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) => JSX.Element
}

export interface DisplayCollectionDataTable {[moveid: Lowercase<string>]: DisplayCollectionType}

type NoneToNoneFunction = () => void;

export const DisplayCollectionDataDex : DisplayCollectionDataTable = {
    gamerule: {
        searchId: 'gamerule',
        width: 9 ,
        titlename : 'Game Rules',
        laconic: "How to play a game of Trench Crusade",
        menushowitems: true,
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {'Playtest Rules v1.6'}
                    </h1>

                    <p>
                        {'All the rules for Trench Crusade in one place. Below are the official Playtest Rules version 1.6 for the tabletop game Trench Crusade. These are the official rules taken from the rules PDF and always kept up to date. Our goal is to provide a comprehensive resource for all rules in the game.'}
                    </p>

                    <div className={'row'}>

                        <div className={'col-12 col-md-6'}>
                            <RulesBannerText
                                link="/compendium/gamerule/gr_introduction"
                                title={'How to play Trench Crusade'}
                            >
                                <>
                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_gameturnsandactivations"
                                        title={'Game Turns & Activations'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_plusdiceandminusdice"
                                        title={'+DICE and -DICE'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_movement"
                                        title={'Movement'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_injurychart"
                                        title={'Injury Chart'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_rangedcombat"
                                        title={'Ranged Combat'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_meleecombat"
                                        title={'Melee Combat'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_startingawarband"
                                        title={'Starting a Warband'}
                                    >
                                    </RulesBannerText>

                                    <RulesBannerText
                                        link="/compendium/gamerule/gr_scenarios"
                                        title={'Scenarios'}
                                    >
                                    </RulesBannerText>
                                </>
                            </RulesBannerText>
                        </div>

                        <div className={'col-12 col-md-6'}>
                            <RulesBannerText
                                link="/compendium/keyword"
                                title={'Keywords'}
                            >
                                <>
                                </>
                            </RulesBannerText>


                            <RulesBannerText
                                link="/compendium/glossary"
                                title={'Glossary'}
                            >
                                <>
                                </>
                            </RulesBannerText>


                            <RulesBannerText
                                link="/compendium/model"
                                title={'Models'}
                            >
                                <>
                                </>
                            </RulesBannerText>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1 className="">
                        {item.Name}
                    </h1>

                    <BookRuleDisplay data={item}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager: FilterManager, update: NoneToNoneFunction, close: NoneToNoneFunction) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                </ErrorBoundary>
            )
        }
    },
    errata: {
        searchId: 'errata',
        width: 9,
        titlename: 'Errata Rules',
        laconic: "Errata & Unfinished/Beta Rules",
        menushowitems: true,
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <div>
                            {"Errata Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
                </ErrorBoundary>
            )
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1 className="">
                        {item.Name}
                    </h1>
                    <BookRuleDisplay data={item} />
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                </ErrorBoundary>
            )
        }
    },
    glossary: {
        searchId: 'glossary',
        width: 7,
        titlename : 'Glossary',
        laconic: "Commonly used terms & mechanics",
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                    <div className="borderthin bordergrey">
                    <GenericCollapsableBlockDisplay
                        d_name={item.Name}
                        d_colour={"grey"}
                        d_state={false}
                        bordertype={0}
                        d_border={false}
                        d_margin={"sml"}
                        d_method={() => <>
                            <div className="borderthin backgroundBgCard bordergrey">
                            <GlossaryDisplay data={item} />
                            </div>
                        </>} />
                    </div>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div>
                        <div>
                            <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }
    },
    keyword: {
        searchId: 'keyword',
        width: 7,
        titlename : 'Keywords',
        laconic: "Shared definitions that describe game rules.",
        menushowitems: false,
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <br/>
                    <RulesKeywordsTable data={item}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div>
                        <div>
                            {manager.ReturnTextFilters().filter((item) => (item.Group != 'name')).map((item) =>
                                <div key={item.Group}>
                                    <FilterTextItem data={item}/>
                                </div>)}
                        </div>
                        <div>
                            <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }
    },
    model: {
        searchId: 'model',
        width: 9,
        titlename : 'Models',
        laconic: "Who and what partake in battles",
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                    <div className="borderthin bordergrey">
                        <GenericCollapsableBlockDisplay 
                            d_name={item.Name} 
                            d_colour={"grey"} 
                            d_state={true}  
                            bordertype={0}
                            d_col={"default"}
                            d_border={false}
                            d_margin={"sml"}
                            d_method={() => <>
                                <div className="backgroundBgCard">
                                    <ModelCollectionDisplay data={item} />
                                </div>
                            </>} />
                    </div>

                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Variant"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'variant_name'))}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Team"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'team'))}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Keywords"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'keywords'))}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                </ErrorBoundary>
            )
        }
    },
    armoury: {
        searchId: 'armoury',
        width: 8,
        titlename : 'Weapons & Equipment',
        laconic: "Items you can find in the armoury",
        categoryparam: "category",
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <RulesEquipmentEntry
                            equipment={item}
                        />
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                        <div>
                            <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Category"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'category'))}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Keywords"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'keywords'))}/>
                        </div>
                        <div>
                            <div className=""/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                        <div>
                            {manager.ReturnRangeFilters().filter((item) => (item.Group == 'distance')).map((item) =>
                                    <div key={item.Group}>
                                        <div className=""/>
                                        <FilterRangeItem name={"Range"} data={item}/>
                                    </div>)}
                        </div>
                </ErrorBoundary>
            )
        }
    },
    faction: {
        searchId: 'faction',
        width: 9,
        titlename : 'Factions',
        laconic: "Assorted groups and nations participating in the war",
        menushowitems: true,
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    {item != undefined &&
                    <FactionCollectionDisplay data={item} />
                    }
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {

            const factionlist = [
                {
                    title: 'Court of the Seven-Headed Serpent',
                    slug: 'fc_courtofthesevenheadedserpent'
                },
                {
                    title: 'Cult of the Black Grail',
                    slug: 'fc_cultoftheblackgrail',
                    children: [
                        {
                            title: 'Dirge of the Great Hegemon',
                            slug: 'fc_cultoftheblackgrail_fv_dirgeofthegreathegemon',
                        },
                    ]
                },
                {
                    title: 'Heretic Legion',
                    slug: 'fc_hereticlegion',
                    children: [
                        {
                            title: 'Heretic Naval Raiding Party',
                            slug: 'fc_hereticlegion_fv_hereticnavalraidingparty',
                        },
                        {
                            title: 'Trench Ghosts',
                            slug: 'fc_hereticlegion_fv_trenchghosts',
                        },
                        {
                            title: 'Knights of Avarice',
                            slug: 'fc_hereticlegion_fv_knightsofavarice',
                        },
                    ]
                },
                {
                    title: 'Iron Sultanate',
                    slug: 'fc_ironsultanate',
                    children: [
                        {
                            title: 'Fidai of Alamut - The Cabal of Assassins',
                            slug: 'fc_ironsultanate_fv_fidaiofalamut',
                        },
                        {
                            title: 'House of Wisdom',
                            slug: 'fc_ironsultanate_fv_houseofwisdom',
                        },
                        {
                            title: 'Defender\'s of the Iron Wall',
                            slug: 'fc_ironsultanate_fv_defendersoftheironwall',
                        },
                    ]
                },
                {
                    title: 'The Prinicpality of New Antioch',
                    slug: 'fc_newantioch',
                    children: [
                        {
                            title: 'Papal States Intervention Force',
                            slug: 'fc_newantioch_fv_papalstatesinterventionforce',
                        },
                        {
                            title: 'Eire Rangers',
                            slug: 'fc_newantioch_fc_eirerangers',
                        },
                        {
                            title: 'Stoßtruppen of the Free State of Prussia',
                            slug: 'fc_newantioch_fc_stortruppenofthefreestateofprussia',
                        },
                        {
                            title: 'Kingdom of Alba Assault Detatchment',
                            slug: 'fc_newantioch_fv_kingdomofalbaassaultdetatchment',
                        },
                        {
                            title: 'Expeditionary Forces of Abyssinia',
                            slug: 'fc_newantioch_fv_expeditionaryforcedofabyssinia',
                        },
                    ]
                },
                {
                    title: 'Trench Pilgrims',
                    slug: 'fc_trenchpilgrim',
                    children: [
                        {
                            title: 'Procession of the Sacred Affliction',
                            slug: 'fc_trenchpilgrim_fv_processionofthesacredaffliction',
                        },
                        {
                            title: 'Cavalcade of the Tenth Plague',
                            slug: 'fc_trenchpilgrim_fv_cavalcadeofthetenthplague',
                        },
                        {
                            title: 'War Pilgrimage of Saint Methodius',
                            slug: 'fc_trenchpilgrim_fv_warpilgimageofsaintmethodius',
                        },
                    ]
                }
            ];

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1 className="">
                        {'Factions'}
                    </h1>

                    <p>
                        {'Each warband in Trench Crusade belongs to a faction fighting in the Great War. Use the faction lists that follow to recruit and equip your warband. These lists provide information about the troop types available, their weapons, armour and equipment options, as well as special rules specific to that faction.'}
                    </p>


                    <div className={'spacer-20'}></div>

                    <div className={'rules-faction-masonry'}>
                        {factionlist.map(item => {
                            const hasChildren = Array.isArray(item.children) && item.children.length > 0

                            return (
                                <RulesBannerFaction
                                    key={item.slug}
                                    slug={item.slug}
                                    title={item.title}
                                >
                                    {hasChildren && (
                                        <>
                                            {item.children!.map(sub_item => (
                                                <RulesBannerFaction
                                                    key={sub_item.slug}
                                                    slug={sub_item.slug}
                                                    title={sub_item.title}
                                                />
                                            ))}
                                        </>
                                    )}
                                </RulesBannerFaction>
                            )
                        })}
                    </div>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager: FilterManager, update: NoneToNoneFunction, close: NoneToNoneFunction) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                </ErrorBoundary>
            )
        }
    },
    scenario: {
        searchId: 'scenario',
        width: 9,
        titlename : 'Scenarios',
        laconic: "Unfortunate situations a warband can find itself in",
        menushowitems: true,
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {item.Name}
                    </h1>
                    <ScenarioDisplay data={item}/>
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {

            // @TODO: get ressources from data
            const scenarios = [
                {
                    name: 'Armoured Train',
                    link: 'sc_armouredtrain',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Claim No Man\'s Land',
                    link: 'sc_claimnomansland',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Dragon Hunt',
                    link: 'sc_dragonhunt',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Great War',
                    link: 'sc_greatwar',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Hunt for Heroes',
                    link: 'sc_huntforheroes',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Relic Hunt',
                    link: 'sc_relichunt',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Storming the Shores',
                    link: 'sc_stormingtheshores',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Supply Raid',
                    link: 'sc_supplyraid',
                    source: 'Playtest Rules'
                },
                {
                    name: 'Trench Warfare',
                    link: 'sc_trenchwarfar',
                    source: 'Playtest Rules'
                }
            ];

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {"Scenarios"}
                    </h1>

                    <p>
                        These are the official Trench Crusade Scenarios. You can select one from the list below or use the random scenario generator.

                        <br/> <br/>
                        <a href={'/scenario/generator'}>
                            Scenario Generator
                            <FontAwesomeIcon icon={faChevronRight} className={'icon-inline-right'}/>
                        </a>
                    </p>

                    <div className={'spacer-20'}></div>

                    <h2>
                        {'Scenarios Table'}
                    </h2>

                    <table className={'table_headed table_headed-highlight'}>
                        <thead>
                            <tr>
                                <th>Scenario</th>
                                <th>Source</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* @TODO: use navigate*/}
                            {scenarios.map((scenario, index) => (
                                <tr key={index}>
                                    <td className={'font-normal'}>
                                        <a href={'/compendium/scenario/' + scenario.link}>
                                            {scenario.name}
                                        </a>
                                    </td>
                                    <td>
                                        {scenario.source}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                </ErrorBoundary>
            )
        }
    },
    campaignrule: {
        searchId: 'campaignrule',
        width: 9 ,
        titlename : 'Campaign Rules',
        laconic: "Rules for playing an extended campaign",
        menushowitems: true,
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {item.Name}
                    </h1>
                    <BookRuleDisplay data={item}/>
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <>
                        <h1>
                            {'Campaigns v1.6.3'}
                        </h1>
                        <p className={''}>
                            {'Here you can find the campaign rules. When in doubt consult the official campaign rules pdf.'}

                            <br/>
                            <br/>

                            <a href={'https://www.trenchcrusade.com/s/Trench-Crusade-Campaign-Rules-v163.pdf'}
                               rel={"noreferrer noopener nofollow"} target={'_blank'}
                            >
                                Official Campaign Rules PDF
                                <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>

                            </a>
                        </p>

                        <div className={'spacer-20'}></div>

                        <div className={'row '}>
                            <div className={'col-12 col-md-6'}>
                                {/* @TODO: Change to static page */}
                                <RulesBannerImage
                                    imageId={210}
                                    linkUrl={'/compendium/campaignrule/br_introduction'}
                                    linkText={'Campaign Rules'}
                                />
                            </div>

                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={212}
                                    linkUrl={'/compendium/patron'}
                                    linkText={'Patrons'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={216}
                                    linkUrl={'/compendium/explorationtable'}
                                    linkText={'Exploration'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={228}
                                    linkUrl={'/compendium/skillgroup'}
                                    linkText={'Skills'}
                                />
                            </div>
                            <div className={'col-12 col-md-6'}>
                                <RulesBannerImage
                                    imageId={225}
                                    linkUrl={'/compendium/injury'}
                                    linkText={'Injuries'}
                                />
                            </div>
                        </div>
                    </>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager: FilterManager, update: NoneToNoneFunction, close: NoneToNoneFunction) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                </ErrorBoundary>
            )
        }
    },
    explorationtable: {
        searchId: 'explorationtable',
        width: 9 ,
        titlename : 'Exploration',
        laconic: "Locations you can find during a campaign",
        menushowitems: true,
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <RulesExplotationTable data={item} />
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {'Exploration Locations'}
                    </h1>

                    <p>
                        {'After you have modified the Exploration roll result, consult the appropriate Exploration Table to see if you have found something of special Interest. You have to match the number on the table exactly with your dice – rolling too high or too low means you did not find the Note that each player can find any of the locations only once during the campaign, though it is completely legal for two different players to discover the same location during the same campaign. We encourage players to maintain a War Journal that tracks the locations they find during the campaign. To find out which Exploration Table you should use, consult the following chart:'}
                        <br />
                        <br />
                        {'Consult the page below to check the rules for explorations during campaign play.'}
                    </p>

                    <div className={'row'}>
                        <div className={'col-12 col-md-6'}>
                            <RulesBannerText
                                title={'Exploration Rules'}
                                link={'/compendium/campaignrule/br_exploration'}
                            />
                        </div>
                    </div>


                    <div className={'spacer-20'}></div>

                    <h2>
                        {'Exploration Locations Table'}
                    </h2>
                    <table className={'table_headed table_headed-highlight'}>
                        <tr className={'table_headrow'}>
                            <th>
                                {'Number of Balles Fought'}
                            </th>
                            <th>
                                {'Possible Locations'}
                            </th>
                        </tr>

                        <tr>
                            <td>
                                {'1-2'}
                            </td>
                            <td>
                                <Link to={'/compendium/explorationtable/et_commonlocations'} className="">
                                    {'Common Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'3-5'}
                            </td>
                            <td>
                                <Link to={'/compendium/explorationtable/et_commonlocations'} className="">
                                    {'Common or Rare Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'6-9'}
                            </td>
                            <td>
                                <Link to={'/compendium/explorationtable/et_commonlocations'} className="">
                                    {'Rare Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'10+'}
                            </td>
                            <td>
                                <Link to={'/compendium/explorationtable/et_commonlocations'} className="">
                                    {'Rare or Legendary Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                    </table>

                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                </ErrorBoundary>
            )
        }
    },
    injury: {
        searchId: 'injury',
        width: 10 ,
        titlename : 'Injuries',
        laconic: "Wounds suffered after a battle",
        menushowitems: false,
        hidefilter: true,
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                    {/* @TODO: item need to contain all injuries instead of one singular injury */}
                    <RulesInjuriesTable data={item} />
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                </ErrorBoundary>
            )
        }
    },
    skillgroup: {
        searchId: 'skillgroup',
        width: 9,
        titlename : 'Skills',
        laconic: "Unique abilities and talents a model can gain",
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <RulesSkillTable data={item} />

                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                    <div>
                        <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                    </div>
                    <div>
                        <div className=""/>
                        <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                    </div>
                </ErrorBoundary>
            )
        }
    },
    patron: {
        searchId: 'patron',
        width: 9,
        titlename : 'Patrons',
        laconic: "Forces a warband must appease in campaigns",
        menushowitems: true,
        defaultpage(ViewPageController: CollectionsListPage) {

            // @TODO: get ressources from data
            const patrons = [
                {
                    name: 'Anti-Pope of Avignon',
                    link: 'pt_antipopeofavignon',
                    factions: 'Cult of the Black Grail, Dirge of the Great Hegemon'
                },
                {
                    name: 'Infernal Noble',
                    link: 'pt_infernalnoble',
                    factions: 'Infernal Noble'
                },
                {
                    name: 'Learned Saint',
                    link: 'pt_learnedsaint',
                    factions: 'Cavalcade of the Tenth Plague, Eire Rangers, Expeditionary Forces of Abyssinia, Kingdom of Alba Assault Detatchment, Papal States Intervention Force, Procession of the Sacred Affliction, Stoßtruppen of the Free State of Prussia, The Prinicpality of New Antioch, Trench Pilgrims, War Pilgrimage of Saint Methodius'
                },
                {
                    name: 'Mammon',
                    link: 'pt_mammon',
                    factions: 'Heretic Legion, Heretic Naval Raiding Party, Knights of Avarice, Trench Ghosts'
                },
                {
                    name: 'Sublime Gate',
                    link: 'pt_sublimegate',
                    factions: 'Defender\'s of the Iron Wall, Fidai of Alamut - The Cabal of Assassins, House of Wisdom, Iron Sultanate'
                },
                {
                    name: 'Temporal Lord',
                    link: 'pt_temporallord',
                    factions: 'Expeditionary Forces of Abyssinia, Kingdom of Alba Assault Detatchment, Papal States Intervention Force, Stoßtruppen of the Free State of Prussia, The Prinicpality of New Antioch'
                },
                {
                    name: 'The Order of the Fly',
                    link: 'pt_orderofthefly',
                    factions: 'Cult of the Black Grail, Dirge of the Great Hegemon'
                },
                {
                    name: 'Warrior Saint',
                    link: 'pt_warriorsaint',
                    factions: 'Cavalcade of the Tenth Plague, Expeditionary Forces of Abyssinia, Kingdom of Alba Assault Detatchment, Papal States Intervention Force, Procession of the Sacred Affliction, Stoßtruppen of the Free State of Prussia, The Prinicpality of New Antioch, Trench Pilgrims'
                }
            ];

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {"Patrons"}
                    </h1>

                    <p>
                        {'These are the official Trench Crusade Patron. You can select one from the list below or use the official PDF.'}

                        <br/> <br/>
                        <a href={'https://www.trenchcrusade.com/s/Trench-Crusade-Campaign-Rules-v163.pdf'}
                           rel={"noreferrer noopener nofollow"} target={'_blank'}
                        >
                            Official Campaign Rules PDF
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right"/>

                        </a>
                    </p>

                    <div className={'spacer-20'}></div>

                    <h2>Patrons Table</h2>

                    <table className={'table_headed table_headed-highlight'}>
                        <thead>
                            <tr>
                                <th>Patron</th>
                                <th>Available to</th>
                            </tr>
                        </thead>

                        <tbody>
                        {/* @TODO: use navigate*/}
                        {patrons.map((patron, index) => (
                            <tr key={index}>
                                <td className={'font-normal'}>
                                    <a href={'/compendium/patron/' + patron.link}>
                                        {patron.name}
                                    </a>
                                </td>
                                <td>
                                    {patron.factions}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </ErrorBoundary>
            )
        },
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {item.Name}
                    </h1>

                    <PatronDisplay data={item}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager: FilterManager, update: NoneToNoneFunction, close: NoneToNoneFunction) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                </ErrorBoundary>
            )
        }
    }
}