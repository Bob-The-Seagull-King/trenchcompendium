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
import { Patron } from "../../classes/feature/skillgroup/Patron";
import { Faction } from "../../classes/feature/faction/Faction";
import { FactionCollection } from "../../classes/feature/faction/FactionCollection";
import DefaultFactions from "../components/mainpages/DefaultFactions";
import DefaultScenario from "../components/mainpages/DefaultScenario";
import DefaultPatron from "../components/mainpages/DefaultPatron";
import { ModelCollection } from "../../classes/feature/model/ModelCollection";
import { Equipment } from "../../classes/feature/equipment/Equipment";
import { Helmet } from 'react-helmet';
import PageMetaInformation from "../components/generics/PageMetaInformation";
import { Scenario } from "../../classes/feature/scenario/Scenario";

export interface DisplayCollectionType {
    searchId      : string,
    titlename     : string,
    laconic       : string,
    width         : number,
    menushowitems : boolean,
    hidefilter?   : boolean,
    showtitle?    : boolean,
    defaultpage?  : (ViewPageController: CollectionsListPage) => JSX.Element,
    textboxOptions: (ViewPageController: CollectionsListPage) => string[],
    categoryparam?: string,
    returnDisplay: (item: any) => JSX.Element
    returnFilterSelect: (manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) => JSX.Element
}

export interface DisplayCollectionDataTable {[moveid: Lowercase<string>]: DisplayCollectionType}

type NoneToNoneFunction = () => void;

export const DisplayCollectionDataDex : DisplayCollectionDataTable = {
    gamerule: {
        searchId: 'game/rules',
        width: 9 ,
        titlename : 'Game Rules',
        laconic: "How to play a game of Trench Crusade",
        menushowitems: true,
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={'Playtest Rules v1.6'}
                        description={'All the rules for Trench Crusade in one place. Below are the official Playtest Rules version 1.6 for the tabletop game Trench Crusade.'}
                    />

                    <h1>
                        {'Playtest Rules v1.6'}
                    </h1>

                    <p>
                        {'All the rules for Trench Crusade in one place. Below are the official Playtest Rules version 1.6 for the tabletop game Trench Crusade. These are the official rules taken from the rules PDF and always kept up to date. Our goal is to provide a comprehensive resource for all rules in the game.'}
                    </p>

                    <div className={'row'}>

                        <div className={'col-12'}>
                            <RulesBannerText
                                link="/compendium/game/rules/gr_introduction"
                                title={'How to play Trench Crusade'}
                            >
                                <>
                                {ViewPageController.Collection.itemcollection.filter((item) => (item.HeldItem.ID != 'gr_introduction')).map( (rule) => (

                                    <RulesBannerText
                                        key={rule.HeldItem.ID}
                                        link={"/compendium/game/rules/"+rule.HeldItem.ID}
                                        title={rule.HeldItem.Name}
                                    >
                                    </RulesBannerText>
                                ))

                                }
                                    

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
                    <PageMetaInformation
                        title={item.Name}
                        description={item.GetDescription()}
                    />

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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={'Rules Errata & FAQ'}
                        description={'Sometimes the rules for Trench Crusade change, get balanced or clarified. These changes can be found here.'}
                    />
                    <h1>
                        {'Rules Errata'}
                    </h1>

                    <p>
                        {'Sometimes the rules for Trench Crusade change, get balanced or clarified. These changes can be found here.'}
                    </p>

                    <div className={'row'}>

                        <div className={'col-12'}>
                        {ViewPageController.Collection.itemcollection.map( (rule) => (
                            <RulesBannerText
                                key={rule.HeldItem.ID}
                                link={"/compendium/errata/"+rule.HeldItem.ID}
                                title={rule.HeldItem.Name}
                            >
                            </RulesBannerText>
                            ))

                            }
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={'Keywords'}
                        description={'All Keywords for Trench Crusade in one Place. '}
                    />

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
        textboxOptions(ViewPageController: CollectionsListPage) {
            const listofname : string[] = []

            for (let i = 0; i < ViewPageController.Collection.itemcollection.length; i++) {
                for (let j = 0; j < (ViewPageController.Collection.itemcollection[i].HeldItem as ModelCollection).SubModelsList.length; j++) {
                    const item = (ViewPageController.Collection.itemcollection[i].HeldItem as ModelCollection).SubModelsList[j].model.Name;
                    listofname.push(item? item : "")
                }
            }
            return listofname;
        },
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                    <ModelCollectionDisplay data={item} />

                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            const listofname : string[] = []

            for (let i = 0; i < ViewPageController.Collection.itemcollection.length; i++) {
                const item = (ViewPageController.Collection.itemcollection[i].HeldItem as Equipment).Name;
                listofname.push(item? item : "")
            }
            return listofname;
        },
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
                    <div className={'returnFilterSelect'}>
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    {item != undefined &&
                        <>
                            <FactionCollectionDisplay data={item} />
                        </>
                    }
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {

            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <DefaultFactions item={ViewPageController}/>
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={item.Name}
                        description={item.GetDescription()}
                        ogImage={(item as Scenario).ImgLink}
                    />

                    <h1>
                        {item.Name}
                    </h1>
                    <ScenarioDisplay data={item}/>
                </ErrorBoundary>
            )
        },
        defaultpage(ViewPageController: CollectionsListPage) {


            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <DefaultScenario item={ViewPageController}/>
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
        searchId: 'campaign/campaign_rules',
        width: 9 ,
        titlename : 'Campaign Rules',
        laconic: "Rules for playing an extended campaign",
        menushowitems: true,
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={item.Name}
                        description={item.GetDescription()}
                    />

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
                    <div className={'rules-content-main'}>
                        <PageMetaInformation
                            title={'Campaign Rules - v1.6.3'}
                            description={'All the rules for Trench Crusade in one place. Below are the official Playtest Rules version 1.6 for the tabletop game Trench Crusade.'}
                        />

                        <h1>
                            {'Campaign Rules - v1.6.3'}
                        </h1>

                        <RulesBannerText
                            link="/compendium/campaign/campaign_rules/br_introduction"
                            title={'How to play Trench Crusade'}
                        >
                            <>
                            {ViewPageController.Collection.itemcollection.filter((item) => (item.HeldItem.ID != 'br_introduction')).map( (rule) => (

                                <RulesBannerText
                                    key={rule.HeldItem.ID}
                                    link={"/compendium/campaign/campaign_rules/"+rule.HeldItem.ID}
                                    title={rule.HeldItem.Name}
                                >
                                </RulesBannerText>
                            ))

                            }


                            </>
                        </RulesBannerText>
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
    explorationtable: {
        searchId: 'explorationtable',
        width: 9 ,
        titlename : 'Exploration',
        laconic: "Locations you can find during a campaign",
        menushowitems: true,
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
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
                    <PageMetaInformation
                        title={'Exploration Locations'}
                        description={'After you have modified the Exploration roll result, consult the appropriate Exploration Table to see if you have found something of special Interest. You have to match the number on the table exactly with your dice – rolling too high or too low means you did not find the Note that each player can find any of the locations only once during the campaign, though it is completely legal for two different players to discover the same location during the same campaign.'}
                    />

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
                                link={'/compendium/campaign/campaign_rules/br_exploration'}
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
                                {'Number of Battles Fought'}
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
                                <Link to={'/compendium/campaign/explorationtable/et_commonlocations'} className="">
                                    {'Common Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'3-5'}
                            </td>
                            <td>
                                <Link to={'/compendium/campaign/explorationtable/et_commonlocations'} className="">
                                    {'Common or Rare Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'6-9'}
                            </td>
                            <td>
                                <Link to={'/compendium/campaign/explorationtable/et_commonlocations'} className="">
                                    {'Rare Exploration Locations'}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {'10+'}
                            </td>
                            <td>
                                <Link to={'/compendium/campaign/explorationtable/et_commonlocations'} className="">
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

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
        showtitle    : true,
        titlename : 'Skills',
        hidefilter   : true,
        laconic: "Unique abilities and talents a model can gain",
        menushowitems: false,
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
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
        textboxOptions(ViewPageController: CollectionsListPage) {
            return []
        },
        defaultpage(ViewPageController: CollectionsListPage) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>

                    <DefaultPatron item={ViewPageController} />
                </ErrorBoundary>
            )
        },
        returnDisplay(item: any) {
            return (

                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <PageMetaInformation
                        title={item.Name}
                        description={item.GetMetaDescription()}
                    />

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