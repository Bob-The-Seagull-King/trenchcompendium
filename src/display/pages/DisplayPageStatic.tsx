import { FilterManager } from "../../classes/viewmodel/collections/filters/FilterManager"
import { ErrorBoundary } from "react-error-boundary";
import {FilterTagItem, FilterTextItem, FilterMiscItem, FilterRangeItem} from "../components/subcomponents/filters/FilterItems"
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

export interface DisplayCollectionType {
    searchId      : string,
    titlename     : string,
    laconic       : string,
    width         : number,
    menushowitems : boolean,
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
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <BookRuleDisplay data={item} />}/>
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
                    <GenericDisplay  d_colour={item.ID} d_state={false} d_name={item.Name} d_type={""} d_method={() => <GlossaryDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>
                        <div className="separator"><h3>TAGS</h3></div>
                        <div className='tagboxpad'></div>
                        <div className="row">
                            <div className="filterbox centerPosition">
                                {manager.ReturnTagFilters().map((item) => (
                                    <FilterTagItem key={"tag"+item.TagType.Name} data={item}/>
                                ))}
                            </div>
                        </div>
                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                            
                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
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
                    <GenericDisplay  d_colour={item.ID} d_name={item.Name} d_state={false} d_type={""} d_method={() => <KeywordDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>
                        <div className="separator"><h3>TAGS</h3></div>
                        <div className='tagboxpad'></div>
                        <div className="row">
                            <div className="filterbox centerPosition">
                                {manager.ReturnTagFilters().map((item) => (
                                    <FilterTagItem key={"tag"+item.TagType.Name} data={item}/>
                                ))}
                            </div>
                        </div>
                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                            
                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
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
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <ModelCollectionDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>


                        <div className="separator"><h3>VARIANT</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "variant_name")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>TEAM</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "team")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>KEYWORDS</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "keywords")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                            
                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
                        </div>
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
                    <GenericDisplay  d_colour={'default'} d_name={item.Name} d_type={""} d_method={() => <EquipmentDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="separator"><h3>CATEGORY</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "category")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="separator"><h3>KEYWORDS</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "keywords")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>


                        <div className="separator"><h3>DISTANCE (Inches)</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnRangeFilters().filter((value) => (value.Group == "distance")).map((item) => (
                                    <FilterRangeItem key={"miscsource"+item.Group} data={item} />
                                ))}
                            </div>
                        </div>
                            
                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
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
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <FactionCollectionDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>TEAM</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "team")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>
                            
                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }
    },
    scenario: {
        searchId: 'scenario',
        width: 9,
        titlename : 'Scenarios',
        laconic: "Unfortunate situations a warband can find itself in",
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <ScenarioDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>
                        
                        <div className="separator"><h3>TAGS</h3></div>
                        <div className='tagboxpad'></div>
                        <div className="row">
                            <div className="filterbox centerPosition">
                                {manager.ReturnTagFilters().map((item) => (
                                    <FilterTagItem key={"tag"+item.TagType.Name} data={item}/>
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
                        </div>
                    </div>
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
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <BookRuleDisplay data={item} />}/>
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
        menushowitems: false,
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
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                        <GenericTableItemDisplay d_value={item.HeldItem.TableVal} d_colour={'default'} d_valuetitle={"Result: "} d_name={item.HeldItem.Name} d_type={""} d_method={() => <InjuryDisplay data={item.HeldItem} />}/>
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
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <SkillGroupDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>
                        
                        <div className="separator"><h3>TAGS</h3></div>
                        <div className='tagboxpad'></div>
                        <div className="row">
                            <div className="filterbox centerPosition">
                                {manager.ReturnTagFilters().map((item) => (
                                    <FilterTagItem key={"tag"+item.TagType.Name} data={item}/>
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
                        </div>
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
        menushowitems: false,
        returnDisplay(item: any) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <GenericDisplay  d_colour={item.Team} d_name={item.Name} d_type={""} d_method={() => <PatronDisplay data={item} />}/>
                </ErrorBoundary>
            )
        },
        returnFilterSelect(manager : FilterManager, update : NoneToNoneFunction, close : NoneToNoneFunction) {
            return (
                
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="col-12">
                        <div className="separator"><h3>NAME</h3></div>
                        <div className="row">
                            {manager.ReturnTextFilters().map((item) => (
                                <FilterTextItem data={item} key="name"/>
                            ))}
                        </div>
                        
                        <div className="separator"><h3>TAGS</h3></div>
                        <div className='tagboxpad'></div>
                        <div className="row">
                            <div className="filterbox centerPosition">
                                {manager.ReturnTagFilters().map((item) => (
                                    <FilterTagItem key={"tag"+item.TagType.Name} data={item}/>
                                ))}
                            </div>
                        </div>

                        <div className="separator"><h3>SOURCES</h3></div>
                        <div className="row">
                            <div className='filterbox centerPosition'>
                                {manager.ReturnMiscFilters().filter((value) => (value.Group == "source")).map((item) => (
                                    <FilterMiscItem key={"miscsource"+item.Name} data={item} />
                                ))}
                            </div>
                        </div>

                        <div className='separator tagboxpad'></div>
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <div className='hovermouse filterbuttonitem basestructure bordergrey backgroundgrey' onClick={() => {close()}}>CONFIRM</div>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }
    }
}