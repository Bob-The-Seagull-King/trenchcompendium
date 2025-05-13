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
                        <div>
                            {"Game Rule Default Page - THIS IS A TEST TO BE REPLACED"}
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
    errata: {
        searchId: 'errata',
        width: 9 ,
        titlename : 'Errata Rules',
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
                    <td>
                        {item.Name}
                    </td>
                    <td>
                        <KeywordDisplay data={item} />
                    </td>
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
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <div>
                            {"Faction Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
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
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <div>
                            {"Scenarios Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
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
                        <div>
                            {"Campaign Rule Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
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
                        <div>
                            {"Exploration Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
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
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <div>
                            {"Patrons Default Page - THIS IS A TEST TO BE REPLACED"}
                        </div>
                </ErrorBoundary>
            )
        },
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <h1>
                        {item.Name}
                    </h1>

                    <PatronDisplay data={item} />
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                </ErrorBoundary>
            )
        }
    }
}