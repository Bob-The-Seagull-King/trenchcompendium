import { IChoice, StaticOption, StaticOptionContextObjectQuestion } from "../../classes/options/StaticOption";
import { EventRunner } from "../../classes/contextevent/contexteventhandler";
import { DynamicContextObject } from "../../classes/contextevent/dynamiccontextobject";
import { ContextObject } from "../../classes/contextevent/contextobject";
import { EquipmentLimit, EquipmentRestriction, EquipmentStats } from "../../classes/feature/equipment/Equipment";
import { ModelStatistics } from "../../classes/feature/model/ModelStats";
import { ModelUpgradeRelationship } from "../../classes/relationship/model/ModelUpgradeRelationship";
import { LocationRestriction } from "../../classes/feature/exploration/ExplorationLocation";
import { WarbandProperty } from "../../classes/saveitems/Warband/WarbandProperty";
import { FactionModelRelationship } from "../../classes/relationship/faction/FactionModelRelationship";
import { FactionEquipmentRelationship } from "../../classes/relationship/faction/FactionEquipmentRelationship"
import { Model } from "../../classes/feature/model/Model";
import { Ability } from "../../classes/feature/ability/Ability";
import { UserWarband } from "../../classes/saveitems/Warband/UserWarband";
import { MemberAndWarband, ModelHands, WarbandMember } from "../../classes/saveitems/Warband/Purchases/WarbandMember";

/**
 * Events that can be called by the runEvent method,
 * all options components of the interfaces that ineherit them.
 */
export interface CallEvents {
    event_priotity : number,
    genericEvent? : (this: EventRunner, eventSource : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<void>, // Generic all-purpose event, avoid using if possible
    genericReturnEvent? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<any>; // Generic all-purpose event if you want a value returned, avoid using if possible
    optionSearchEvent? : (this: EventRunner, eventSource : any, relayVar : ContextObject[], trackVal : StaticOptionContextObjectQuestion, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, ) => Promise<ContextObject[]>; // When being searched by an Option, use this to determine if an object should be added to their selections
    getfactionmodelswithcount? : (this: EventRunner, eventSource : any, relayVar : FactionModelRelationship[], trackVal : StaticOptionContextObjectQuestion, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, ) => Promise<FactionModelRelationship[]>; // When being searched by an Option, use this to determine if an object should be added to their selections
    getPresentationHandeddness? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => {[type : string]: string}; 
    getEquipmentRestrictionPresentable? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    getEquipmentRestriction? : (this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => EquipmentRestriction[]; 
    getAllFactionEquipmentRelationships? : (this: EventRunner, eventSource : any, relayVar : FactionEquipmentRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<FactionEquipmentRelationship[]>; 
    getEquipmentLimitPresentable? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentLimit[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    getEquipmentLimit? : (this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => EquipmentLimit[]; 
    countAsFactionForPatrons? : (this: EventRunner, eventSource : any, relayVar : string, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string>; 
    getModelStatOptions? : (this: EventRunner, eventSource : any, relayVar : ModelStatistics[][], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => ModelStatistics[][]; 
    getContextuallyAddedUpgrades? : (this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelUpgradeRelationship[]>; 
    getWarbandMemberUpgrades? : (this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelUpgradeRelationship[]>; 
    getContextuallyAddedAbilities? : (this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<Ability[]>; 
    getWarbandMemberAbilities? : (this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<Ability[]>; 
    getContextuallyRelevantKeywordsByID? : (this: EventRunner, eventSource : any, relayVar : string[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    modifyEquipmentStats? : (this: EventRunner, eventSource : any, relayVar : EquipmentStats, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<EquipmentStats>; 
    getWarbandLevelFactionRules? : (this: EventRunner, eventSource : any, relayVar : WarbandProperty[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<WarbandProperty[]>; 
    getModelStats? : (this: EventRunner, eventSource : any, relayVar : ModelStatistics, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => ModelStatistics; 
    getModelLimitPresentation? : (this: EventRunner, eventSource : any, relayVar : string[], trackVal : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    getModelLimitTrue? : (this: EventRunner, eventSource : any, relayVar : number,  trackVal : UserWarband,context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<number>; 
    getUpgradeCategoryLimit? : (this: EventRunner, eventSource : any, relayVar : number,  trackVal : string ,context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<number>; 
    getUpgradeLimitTrue? : (this: EventRunner, eventSource : any, relayVar : number,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<number>; 
    getModelHandsAvailable? : (this: EventRunner, eventSource : any, relayVar : ModelHands,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelHands>; 
    getRestrictedUpgradesBool? : (this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<boolean>; 
    getRequiredUpgradesBool? : (this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<boolean>; 
    canModelGetUpgrade? : (this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<boolean>; 
    canModelAddItem? : (this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[]) => Promise<boolean>; 
    equipmentHandsCost? : (this: EventRunner, eventSource : any, relayVar : ModelHands,  trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelHands>; 
    getUpgradeLimitPresentation? : (this: EventRunner, eventSource : any, relayVar : string[], trackVal : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    getUpgradeRestrictionsPresentation? : (this: EventRunner, eventSource : any, relayVar : string[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
    getFactionRuleUpgrades? : (this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelUpgradeRelationship[]>; 
    parseOptionsIntoRelevantType? : (this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : number,  context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<IChoice[]>;
    parseOptionFilterDown? : (this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<IChoice[]>; 
    updateModelStats? : (this: EventRunner, eventSource : any, relayVar : ModelStatistics,   context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<ModelStatistics>; 
    returnOptionDisplay? : (this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => JSX.Element;
    returnWbbOptionDisplay? : (this: EventRunner, eventSource : any, trackVal : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<JSX.Element>;
    getLocationRestrictions? : (this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => LocationRestriction[]; 
    getLocationRestrictionsPresentable? : (this: EventRunner, eventSource : any, relayVar : any, trackVal : LocationRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) => Promise<string[]>; 
}

/**
 * Events used by Option objects to generate selections
 */
export interface OptionEvents {
    genericReturn : (self_item: StaticOption, context_func : ContextEventEntry, input : string) => string // Basic return, just sends the string
    genericResultReturn : (self_item: StaticOption, context_func : ContextEventEntry, input : any) => string // Basic search result return
}

export interface CallEventTable {[tokenid: string]: CallEvents}
export interface OptionEventTable {[tokenid: string]: OptionEvents}

export type ContextEventVals = {[type : string]: ContextEventEntry};
export type ContextEventEntry = {[type : string]: any};