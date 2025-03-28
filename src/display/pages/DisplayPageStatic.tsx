import { FilterManager } from "../../classes/viewmodel/collections/filters/FilterManager"
import { ErrorBoundary } from "react-error-boundary";
import {FilterTextItem, FilterMiscItem, FilterRangeItem, FilterTagSet, FilterMiscSet} from "../components/subcomponents/filters/FilterItems"
import GenericDisplay from "../components/generics/GenericDisplay"
import GlossaryDisplay from "../components/features/glossary/GlossaryDisplay"
import KeywordDisplay from "../components/features/glossary/KeywordDisplay";
import ModelCollectionDisplay from "../components/features/model/ModelCollectionDisplay";
import EquipmentDisplay from "../components/features/equipment/EquipmentDisplay";
import FactionCollectionDisplay from "../components/features/faction/FactionCollectionDisplay";
import ScenarioDisplay from "../components/features/scenario/ScenarioDisplay";
import BookRuleDisplay from "../components/features/glossary/BookRuleDisplay";
import ExplorationTableDisplay from "../components/features/exploration/ExplorationTableDisplay";
import InjuryDisplay from "../components/features/ability/InjuryDisplay";
import GenericTableItemDisplay from "../components/generics/GenericTableItemDisplay";
import SkillGroupDisplay from "../components/features/skill/SkillGroupDisplay";
import PatronDisplay from "../components/features/skill/PatronDisplay";
import GenericCollapsableBlockDisplay from "../components/generics/GenericCollapsableBlockDisplay";

export interface DisplayCollectionType {
    searchId      : string,
    titlename     : string,
    laconic       : string,
    width         : number,
    menushowitems : boolean,
    hidefilter?   : boolean,
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
        returnDisplay(item: any) {
            return (
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="colorBasicText size-section font-seriftext">
                        {item.Name}
                    </div>
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
                            <div className="verticalspacersml"/>
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
                                <KeywordDisplay data={item} />
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
                            {manager.ReturnTextFilters().filter((item) => (item.Group != 'name')).map((item) =>
                                <div key={item.Group}>
                                    <FilterTextItem data={item}/>
                                </div>)}
                        </div>
                        <div>
                            <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
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
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Variant"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'variant_name'))}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Team"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'team'))}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Keywords"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'keywords'))}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                </ErrorBoundary>
            )
        }
    },
    equipment: {
        searchId: 'equipment',
        width: 8,
        titlename : 'Weapons & Equipment',
        laconic: "Items you can find in the armoury",
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
                            d_border={false}
                            d_margin={"sml"}
                            d_method={() => <>
                                <div className="">
                                    <EquipmentDisplay data={item} />
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
                            <FilterTagSet name={"Tags"} data={manager.ReturnTagFilters()}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Category"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'category'))}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Keywords"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'keywords'))}/>
                        </div>
                        <div>
                            <div className="verticalspacersml"/>
                            <FilterMiscSet name={"Source"} data={manager.ReturnMiscFilters().filter((item) => (item.Group == 'source'))}/>
                        </div>
                        <div>
                            {manager.ReturnRangeFilters().filter((item) => (item.Group == 'distance')).map((item) =>
                                    <div key={item.Group}>
                                        <div className="verticalspacersml"/>
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
                    <FactionCollectionDisplay data={item} />
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
                    <div className="colorBasicText size-section font-seriftext">
                        {item.Name}
                    </div>
                    <ScenarioDisplay data={item} />
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
                    <div className="colorBasicText size-section font-seriftext">
                        {item.Name}
                    </div>
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
    explorationtable: {
        searchId: 'explorationtable',
        width: 9 ,
        titlename : 'Exploration',
        laconic: "Locations you can find during a campaign",
        menushowitems: true,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <ExplorationTableDisplay data={item} />}/>
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
                        <GenericTableItemDisplay d_value={item.TableVal} d_colour={'default'} d_valuetitle={"Result: "} d_name={item.Name} d_type={""} d_method={() => <InjuryDisplay data={item} />}/>
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
                    <GenericDisplay d_state={false} d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <SkillGroupDisplay data={item} />}/>
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
                        <div className="verticalspacersml"/>
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
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <GenericDisplay d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <PatronDisplay data={item} />}/>
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