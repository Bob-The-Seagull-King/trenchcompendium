import { DynamicContextObject } from "../../classes/contextevent/dynamiccontextobject";
import { CallEventTable, ContextEventEntry } from "./contexteventtypes";
import { EventRunner } from "../../classes/contextevent/contexteventhandler";
import { ContextObject } from "../../classes/contextevent/contextobject";
import { IChoice, QuestionBase, StaticOptionContextObjectQuestion } from "../../classes/options/StaticOption";
import { containsTag, makestringpresentable } from "../../utility/functions";
import { getTagValue } from "../../utility/functions";
import { Equipment, EquipmentLimit, EquipmentRestriction } from "../../classes/feature/equipment/Equipment";
import { Keyword } from "../../classes/feature/glossary/Keyword";
import { KeywordFactory } from "../../factories/features/KeywordFactory";
import { ModelStatistics } from "../../classes/feature/model/ModelStats";
import { IModelUpgradeRelationship, ModelUpgradeRelationship } from "../../classes/relationship/model/ModelUpgradeRelationship";
import { Requester } from "../../factories/Requester";
import { UpgradeFactory } from "../../factories/features/UpgradeFactory";
import { ErrorBoundary } from "react-error-boundary";
import GenericDisplay from "../../display/components/generics/GenericDisplay"
import ExplorationLocationDisplay from "../../display/components/features/exploration/ExplorationLocationDisplay";
import { LocationRestriction } from "../../classes/feature/exploration/ExplorationLocation";
import { Faction } from "../../classes/feature/faction/Faction";

export const BaseContextCallTable : CallEventTable = {
    option_search_viable: {
        event_priotity: 0,
        async optionSearchEvent(this: EventRunner, eventSource : any, relayVar : ContextObject[], trackVal : StaticOptionContextObjectQuestion, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, ) {
            let is_valid_pass = false

            if (trackVal.classes.includes(context_static.constructor.name)) {

                for (let i = 0; i < trackVal.questions.length; i++) {

                    let truthValCurrent = true;
                    const questionCurrent : QuestionBase = trackVal.questions[i]

                    if (questionCurrent.tagq) {
                        const entrykeys = Object.keys(questionCurrent.tagq);

                        for (let j = 0; j < entrykeys.length; j++) {
                            const val = questionCurrent.tagq[entrykeys[j]]
                            if (containsTag(context_static.Tags, entrykeys[j])) {
                                if (getTagValue(context_static.Tags, entrykeys[j]) == val) {
                                    undefined;
                                } else {
                                    truthValCurrent = false;
                                }
                            } else {
                                truthValCurrent = false;
                            }
                        }
                    }
                    if (questionCurrent.baseq) {
                        const entrykeys = Object.keys(questionCurrent.baseq);

                        for (let j = 0; j < entrykeys.length; j++) {
                            const val = questionCurrent.baseq[entrykeys[j]]
                            if (context_func[entrykeys[j]]) {
                                if (context_func[entrykeys[j]] == val) {
                                    undefined;
                                } else {
                                    truthValCurrent = false;
                                }
                            } else {
                                truthValCurrent = false;
                            }
                            
                        }
                    }
                    if (questionCurrent.propertyq) {
                        const entrykeys = Object.keys(questionCurrent.propertyq);

                        for (let j = 0; j < entrykeys.length; j++) {
                            const val = questionCurrent.propertyq[entrykeys[j]]
                            if (entrykeys[j] in context_static) {
                                if (context_static[entrykeys[j] as keyof (typeof context_static)] == val) {
                                    undefined;
                                } else {
                                    truthValCurrent = false;
                                }
                            } else {
                                truthValCurrent = false;
                            }
                            
                        }
                    }

                    if (truthValCurrent == true) {
                        is_valid_pass = true;
                    }
                }
            }

            if (is_valid_pass) {
                relayVar.push(context_static);
            }
            return relayVar;
        }
    },
    test_run : {
        event_priotity: 1,
        genericReturnEvent(this: EventRunner, eventSource : any, relayVar : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            if (context_func["value"]) {
                return relayVar * context_func["value"]
            }
            
            return relayVar
        }
    
    },
    find_hands : {
        event_priotity: 0,
        getPresentationHandeddness(this: EventRunner, eventSource : any, relayVar : any, trackVal : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const MeleeVal = trackVal[0]
            let MeleePresentation = ""
            if (MeleeVal > 0) {MeleePresentation += MeleeVal.toString()}
            
            const RangeVal = trackVal[1]
            let RangePresentation = ""
            if (RangeVal > 0) {RangePresentation += RangeVal.toString()}
            
            return { "melee" : MeleePresentation, "range" : RangePresentation};
        }
    },
    model_equipment_restriction : {
        event_priotity: 0,        
        async getEquipmentRestrictionPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");

            const RemoveCollection : string[] = []
            const AddedCollection : string[] = []
            const RestrictCollection : string[] = []

            for (let i = 0; i < trackVal.length; i++) {
                const EquipList : EquipmentRestriction = trackVal[i]

                if (EquipList.required) {
                    for (let j = 0; j < EquipList.required.length; j++) {
                        const Requirement = EquipList.required[j]
                        const NewStringParts = []
                        NewStringParts.push("RESTRICTION: Items")

                        if (Requirement.category) {
                            NewStringParts.push("in category "+makestringpresentable(Requirement.category))
                        }
                        if (Requirement.tag) {
                            NewStringParts.push("with tag "+makestringpresentable(Requirement.tag))
                        }

                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("must be "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }  

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push("must be "+(EquipmentItem.Name))
                        }                  

                        RestrictCollection.push(NewStringParts.join(' '));
                    }
                }
                
                if (EquipList.removed) {
                    for (let j = 0; j < EquipList.removed.length; j++) {
                        const Requirement = EquipList.removed[j]
                        const NewStringParts = []
                        NewStringParts.push("REMOVED: Items")

                        if (Requirement.category) {
                            NewStringParts.push("in category "+makestringpresentable(Requirement.category))
                        }
                        if (Requirement.tag) {
                            NewStringParts.push("with tag "+makestringpresentable(Requirement.tag))
                        }

                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("must be "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("cannot be equipped")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push("cannot be "+(EquipmentItem.Name))
                        }        
                        

                        RemoveCollection.push(NewStringParts.join(' '));
                    }
                }

                if (EquipList.added) {
                    for (let j = 0; j < EquipList.added.length; j++) {
                        const Requirement = EquipList.added[j]
                        const NewStringParts = []
                        NewStringParts.push("ADDED: Items")

                        if (Requirement.category) {
                            NewStringParts.push("in category "+makestringpresentable(Requirement.category))
                        }
                        if (Requirement.tag) {
                            NewStringParts.push("with tag "+makestringpresentable(Requirement.tag))
                        }

                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("must be "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("can be equipped")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push("can be "+(EquipmentItem.Name))
                        }        
                        

                        AddedCollection.push(NewStringParts.join(' '));
                    }
                }
            }

            const StringCollection : string[] = RemoveCollection.concat(AddedCollection).concat(RestrictCollection)


            return relayVar.concat(StringCollection);
        },
        getEquipmentRestriction(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) { 
            relayVar.push(context_func as EquipmentRestriction)
            return relayVar;
        }
    },
    model_equipment_limit : {
        event_priotity: 1,
        async getEquipmentLimitPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentLimit[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");

            const MaximumCollection : string[] = []
            const MinimumCollection : string[] = []

            for (let i = 0; i < trackVal.length; i++) {
                const EquipList : EquipmentLimit = trackVal[i]

                if (EquipList.maximum) {
                    for (let j = 0; j < EquipList.maximum.length; j++) {
                        const Requirement = EquipList.maximum[j]
                        const NewStringParts = []
                        NewStringParts.push("MAXIMUM: Items")

                        if (Requirement.category) {
                            NewStringParts.push("in category "+makestringpresentable(Requirement.category))
                        }
                        if (Requirement.tag) {
                            NewStringParts.push("with tag "+makestringpresentable(Requirement.tag))
                        }
                        
                        if (Requirement.res_type == "tag") {
                            NewStringParts.push("that have tag "+makestringpresentable(Requirement.value.toString()))
                        }
                        
                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("with the keyword "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push("with the name "+(EquipmentItem.Name))
                        }     

                        NewStringParts.push("have a limit of "+makestringpresentable(Requirement.limit.toString()))
                        
                        MaximumCollection.push(NewStringParts.join(' '));
                    }
                }
                
                if (EquipList.minimum) {
                    for (let j = 0; j < EquipList.minimum.length; j++) {
                        const Requirement = EquipList.minimum[j]
                        const NewStringParts = []
                        NewStringParts.push("MINIMUM: Items")

                        if (Requirement.category) {
                            NewStringParts.push("in category "+makestringpresentable(Requirement.category))
                        }
                        if (Requirement.tag) {
                            NewStringParts.push("with tag "+makestringpresentable(Requirement.tag))
                        }
                        
                        if (Requirement.res_type == "tag") {
                            NewStringParts.push("that have tag "+makestringpresentable(Requirement.value.toString()))
                        }
                        
                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("with the keyword "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push("with the name "+(EquipmentItem.Name))
                        }     

                        NewStringParts.push("must have at least "+makestringpresentable(Requirement.limit.toString()))
                        
                        MinimumCollection.push(NewStringParts.join(' '));
                    }
                }
            }

            const StringCollection : string[] = MaximumCollection.concat(MinimumCollection)

            return relayVar.concat(StringCollection);
        },
        getEquipmentLimit(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            relayVar.push(context_func as EquipmentLimit)
            return relayVar;
        },
        
    },
    stat_options: {
        event_priotity: 1,
        getModelStatOptions(this: EventRunner, eventSource : any, relayVar : ModelStatistics[][], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            const StatOptionList: ModelStatistics[][] = []

            if (context_func["options"]) {
                for (let i = 0; i < context_func["options"].length; i++) {
                    StatOptionList.push(context_func["options"][i])
                }
            }
            return relayVar.concat(StatOptionList);
        }
    },
    faction_model_count_special: {
        event_priotity: 0,
        async getModelLimitPresentation(this: EventRunner, eventSource : any, relayVar : string[], trackVal : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { ModelFactory } = await import("../../factories/features/ModelFactory");
            if (trackVal == true) {
                if (context_func["match"]) {
                    if (context_func["match"][0]["type"] == "model") {
                        const ModelItem = ModelFactory.CreateNewModel(context_func["match"][0]["value"], null)
                        return ["Number of " + ModelItem.Name]
                    }
                }
            }
            
            return relayVar;
        }
    },
    faction_add_upgrades : {
        event_priotity: 0,
        async getFactionRuleUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { UpgradeFactory } = await import("../../factories/features/UpgradeFactory");

            const UpgradeList = Requester.MakeRequest(
                {
                    searchtype: "complex", 
                    searchparam: {
                        type: "modelupgraderelationship",
                        request: {
                            operator: 'and',
                            terms: [
                                {
                                    item: "model_id_set",
                                    value: context_func["model_key"],
                                    equals: true,
                                    strict: true
                                }
                            ],
                            subparams: []
                        }
                    }
                }
            ) as IModelUpgradeRelationship[]
            
            for (let i = 0; i < UpgradeList.length; i++) {
                UpgradeList[i].model_id_set = context_func["models_id"]
                relayVar.push(UpgradeFactory.CreateModelUpgrade(UpgradeList[i]))
            }

            return relayVar;
        }
    },
    faction_eq_restriction: {
        event_priotity: 0,        
        async getEquipmentRestrictionPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            
            const { ModelFactory } = await import("../../factories/features/ModelFactory");
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");

            const PermittedCollection : string[] = []
            const BannedCollection : string[] = []

            for (let i = 0; i < trackVal.length; i++) {
                const EquipList : EquipmentRestriction = trackVal[i]

                if (EquipList.permitted) {
                    for (let j = 0; j < EquipList.permitted.length; j++) {
                        const Requirement = EquipList.permitted[j]
                        const NewStringParts = []
                        NewStringParts.push("")

                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push(makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }  

                        if (Requirement.res_type == "id") {
                            const ModelItem = ModelFactory.CreateNewModel(Requirement.value, null)
                            NewStringParts.push(""+(ModelItem.Name))
                        }   

                        if (Requirement.res_type == "equipment") {
                            const EquipItem = EquipmentFactory.CreateNewEquipment(Requirement.value, null)
                            NewStringParts.push(""+(EquipItem.Name))
                        }                  

                        PermittedCollection.push(NewStringParts.join(' '));
                    }
                }
                if (EquipList.banned) {
                    for (let j = 0; j < EquipList.banned.length; j++) {
                        const Requirement = EquipList.banned[j]
                        const NewStringParts = []
                        NewStringParts.push("")

                        if (Requirement.res_type == "keyword") {
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value, null)
                            NewStringParts.push("Not " + makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }  

                        if (Requirement.res_type == "id") {
                            const ModelItem = ModelFactory.CreateNewModel(Requirement.value, null)
                            NewStringParts.push("Not "+(ModelItem.Name))
                        }                  

                        PermittedCollection.push(NewStringParts.join(' '));
                    }
                }
            }

            const StringCollection : string[] = PermittedCollection.concat(BannedCollection)


            return relayVar.concat(StringCollection);
        },
        getEquipmentRestriction(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) { 
            relayVar.push(context_func as EquipmentRestriction)
            return relayVar;
        }
    },
    faction_choose_equipment: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");

            for (let i = 0; i < relayVar.length; i++) {
                
                const ModelItem = EquipmentFactory.CreateNewEquipment(relayVar[i].value.equipment_id, null)
                relayVar[i].value = ModelItem;
            }

            return relayVar
        },
        async parseOptionFilterDown(this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");
            
            const NewChoices : IChoice[] = []
            const SubItem = context_func["additions"][trackVal]

            for (let i = 0; i < relayVar.length; i++) {
                
                const ModelItem = EquipmentFactory.CreateNewEquipment(relayVar[i].value.equipment_id, null)
                
                for (let j = 0; j < SubItem["restriction"].length; j++) {
                    if (SubItem["restriction"][j].category) {
                        if (ModelItem.Category == SubItem["restriction"][j].category) {
                            NewChoices.push(relayVar[i])
                            break;
                        }
                    }
                }
            }

            return NewChoices
        }
    },
    location_rule_option: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { ExplorationFactory } = await import("../../factories/features/ExplorationFactory");

            for (let i = 0; i < relayVar.length; i++) {
                const ModelItem = ExplorationFactory.CreateExplorationLocation(relayVar[i].value, null)
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.Name? ModelItem.Name : "";
            }

            return relayVar
        },
        returnOptionDisplay(this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="row">
                        <div className="verticalspacerbig" />
                        <div className="col">
                            <GenericDisplay  d_colour={'default'} d_name={relayVar.value.Name} d_type={"sub"} d_method={() => <ExplorationLocationDisplay data={relayVar.value} />}/>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }
    },
    validate_location : {
        event_priotity: 0,        
        getLocationRestrictions(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            relayVar.push(context_func as LocationRestriction)
            return relayVar;
        },
        async getLocationRestrictionsPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : LocationRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
                        
            const { FactionFactory } = await import("../../factories/features/FactionFactory");

            const AddedCollection : string[] = []

            for (let i = 0; i < trackVal.length; i++) {
                const LocationList : LocationRestriction = trackVal[i]

                if (LocationList.allowed) {
                    for (let j = 0; j < LocationList.allowed.length; j++) {
                        const Requirement = LocationList.allowed[j]
                        const NewStringParts = []
                        NewStringParts.push("Faction: ")

                        if (Requirement.type == "faction") {
                            for (let k = 0; k < Requirement.value.length; k++) {
                                const ValKey : Faction = FactionFactory.CreateNewFaction(Requirement.value[k], null)
                                NewStringParts.push(makestringpresentable(ValKey.Name? ValKey.Name : ""))
                            }
                        }              

                        AddedCollection.push(NewStringParts.join(' '));
                    }
                }
            }

            const StringCollection : string[] = AddedCollection;

            return relayVar.concat(StringCollection);
        }
    }
}