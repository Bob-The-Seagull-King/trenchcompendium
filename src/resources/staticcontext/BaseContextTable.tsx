import { DynamicContextObject } from "../../classes/contextevent/dynamiccontextobject";
import { CallEventTable, ContextEventEntry } from "./contexteventtypes";
import { EventRunner } from "../../classes/contextevent/contexteventhandler";
import { ContextObject } from "../../classes/contextevent/contextobject";
import { IChoice, QuestionBase, StaticOptionContextObjectList, StaticOptionContextObjectQuestion } from "../../classes/options/StaticOption";
import { containsTag, getCostType, GetWarbandOrNull, makestringpresentable } from "../../utility/functions";
import { getTagValue } from "../../utility/functions";
import { Equipment, EquipmentLimit, EquipmentRestriction, EquipmentStats, RestrictionSingle } from "../../classes/feature/equipment/Equipment";
import { Keyword } from "../../classes/feature/glossary/Keyword";
import { KeywordFactory } from "../../factories/features/KeywordFactory";
import { ModelStatistics } from "../../classes/feature/model/ModelStats";
import { IModelUpgradeRelationship, ModelUpgradeRelationship } from "../../classes/relationship/model/ModelUpgradeRelationship";
import { Requester } from "../../factories/Requester";
import { UpgradeFactory } from "../../factories/features/UpgradeFactory";
import { ErrorBoundary } from "react-error-boundary";
import GenericDisplay from "../../display/components/generics/GenericDisplay"
import ExplorationLocationDisplay from "../../display/components/features/exploration/ExplorationLocationDisplay";
import { ExplorationLocation, LocationRestriction } from "../../classes/feature/exploration/ExplorationLocation";
import { Faction } from "../../classes/feature/faction/Faction";
import SkillDisplay from "../../display/components/features/skill/SkillDisplay";
import { WarbandProperty } from "../../classes/saveitems/Warband/WarbandProperty";
import { FactionModelRelationship } from "../../classes/relationship/faction/FactionModelRelationship";
import RulesModelDisplayAbility from "../../display/components/rules-content/RulesModelDisplayAbility";
import { Model } from "../../classes/feature/model/Model";
import { Ability, IAbility } from "../../classes/feature/ability/Ability";
import RuleDisplay from "../../display/components/features/faction/RuleDisplay";
import { Skill } from "../../classes/feature/ability/Skill";
import { UserWarband } from "../../classes/saveitems/Warband/UserWarband";
import { FactionEquipmentRelationship } from "../../classes/relationship/faction/FactionEquipmentRelationship";
import { MemberAndItem, MemberAndWarband, ModelHands, WarbandMember } from "../../classes/saveitems/Warband/Purchases/WarbandMember";
import { returnDescription } from "../../utility/util";
import { Patron } from "../../classes/feature/skillgroup/Patron";
import { Injury } from "../../classes/feature/ability/Injury";
import { Fireteam } from "../../classes/feature/ability/Fireteam";
import { WarbandConsumable } from "../../classes/saveitems/Warband/WarbandConsumable";
import { DynamicOptionContextObject } from "../../classes/options/DynamicOptionContextObject";
import { IUpgrade, Upgrade } from "../../classes/feature/ability/Upgrade";
import { WarbandEquipment } from "../../classes/saveitems/Warband/Purchases/WarbandEquipment";
import { RealWarbandPurchaseModel, WarbandPurchase } from "../../classes/saveitems/Warband/Purchases/WarbandPurchase";
import { ModelEquipmentRelationship } from "../../classes/relationship/model/ModelEquipmentRelationship";

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
                    if (questionCurrent.antipropertyq) {
                        const entrykeys = Object.keys(questionCurrent.antipropertyq);

                        for (let j = 0; j < entrykeys.length; j++) {
                            const val = questionCurrent.antipropertyq[entrykeys[j]]
                            if (entrykeys[j] in context_static) {
                                if (context_static[entrykeys[j] as keyof (typeof context_static)] != val) {
                                    undefined;
                                } else {
                                    truthValCurrent = false;
                                }
                            } else {
                                truthValCurrent = true;
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
    set_arms: {
        event_priotity: 0,
        async getModelHandsAvailable(this: EventRunner, eventSource : any, relayVar : ModelHands,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["ranged"] != undefined) {
                relayVar.ranged = context_func["ranged"]
            }          
            if (context_func["melee"] != undefined) {
                relayVar.melee = context_func["melee"]
            }         
            if (context_func["special"]) {
                relayVar.special = context_func["special"]
            }            
            return relayVar;
        }
    },
    add_arms: {
        event_priotity: 0,
        async getModelHandsAvailable(this: EventRunner, eventSource : any, relayVar : ModelHands,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {  
            if (context_func["ranged"]) {
                relayVar.ranged += context_func["ranged"]
            }          
            if (context_func["melee"]) {
                relayVar.melee += context_func["melee"]
            }         
            if (context_func["special"]) {
                relayVar.melee += context_func["special"]
            }         
            return relayVar;
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
    add_armoury_item: {
        event_priotity: 0,
        async onWarbandBuild(this: EventRunner, eventSource : any, trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const faceqmodule = await import("../../factories/features/EquipmentFactory")
            
            if (context_func["free_purchases"]) {
                for (let i = 0; i < context_func["free_purchases"].length; i++) {
                    const NewItem = await faceqmodule.EquipmentFactory.CreateNewFactionEquipment(context_func["free_purchases"][i], null, false);
                    if (NewItem != null) {
                        await trackVal.AddStash(NewItem);
                    }
                }
            }
        }
    },
    validate_final_unit: {
        event_priotity: 0,        
        async validateModelForWarband(this: EventRunner, eventSource : any, relayVar: string[], trackVal : WarbandPurchase, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband) {
            
            if (context_func["exception"]) {
                for (let i = 0; i < context_func["exception"].length; i++) {
                    const CurExp = context_func["exception"][i]

                    if (CurExp['type'] == 'id') {
                        if ((trackVal.HeldObject as WarbandMember).CurModel.ID == CurExp['value']) {
                            return relayVar;
                        }
                    }
                }
            }
            if (context_func["requirements"]) {
                for (let i = 0; i < context_func["requirements"].length; i++) {
                    const CurExp = context_func["requirements"][i]

                    if (CurExp['type'] == 'ducats') {
                        const ducatVal = trackVal.GetTotalDucats(true);
                        const needVal = CurExp['value']
                        if (CurExp['subvalue'] == 'minimum') {
                            if (needVal > ducatVal) {
                                relayVar.push(
                                    "The model " + (trackVal.HeldObject as WarbandMember).GetTrueName() + " must be worth at least " + needVal + " ducats."
                                )
                            }
                        }

                    }
                }
            }
            
            return relayVar;
        }
    },
    validate_final_unit_equipment: {
        event_priotity: 0,        
        async validateModelForWarband(this: EventRunner, eventSource : any, relayVar: string[], trackVal : WarbandPurchase, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband) {
            
            if (context_func["requirements"]) {
                for (let i = 0; i < context_func["requirements"].length; i++) {
                    const CurExp = context_func["requirements"][i]

                    if (CurExp['tag']) {
                        const equipment = await (trackVal.HeldObject as WarbandMember).GetAllEquipForShow()
                        let isfound = false;
                        for (let j = 0; j < equipment.length; j ++) {
                            if (equipment[j].equipment.IsTagPresent(CurExp['tag'])) {
                                isfound = true
                                break;
                            }
                        }
                        if (CurExp['value'] == !isfound) {
                            relayVar.push(
                                "The model " + (trackVal.HeldObject as WarbandMember).GetTrueName() + " must " + (CurExp["value"] == true ? "be" : "not be") + " equipped with " + makestringpresentable( CurExp["tag"])
                            )
                        }

                    }
                }
            }
            
            return relayVar;
        }
    },
    override_equipment_limit: {
        event_priotity: 0,
        
        async getEquipmentLimitRaw(this: EventRunner, eventSource : any, relayVar: number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return context_func["count"]
        }
    },
    no_shield_combo: {
        event_priotity: 0,
        async countShieldCombo(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return false;
        }
    },
    model_equipment_restriction : {
        event_priotity: 0,        
        async getEquipmentRestrictionPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            const ModelModule = await import("../../factories/features/ModelFactory");
            const EquipmentModule = await import("../../factories/features/EquipmentFactory");

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
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value.toString(), null)
                            NewStringParts.push("must be "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "tag") {
                            NewStringParts.push("must have tag "+makestringpresentable(Requirement.value.toString()))
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = await EquipmentModule.EquipmentFactory.CreateNewEquipment(Requirement.value.toString(), null)
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
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value.toString(), null)
                            NewStringParts.push("with keyword "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }                        

                        if (Requirement.res_type == "ducat") {
                            let LimitVal = "";
                            if (Requirement.param == "maximum" ) {
                                LimitVal = "above"
                            } else {
                                LimitVal = "below"
                            }
                            NewStringParts.push("with Ducat cost " + LimitVal + " " + Requirement.value)
                        }  

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("cannot be equipped")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = await EquipmentModule.EquipmentFactory.CreateNewEquipment(Requirement.value.toString(), null)
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
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value.toString(), null)
                            NewStringParts.push("must be "+makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }

                        if (Requirement.res_type == "all") {
                            NewStringParts.push("can be equipped")
                        }

                        if (Requirement.res_type == "id") {
                            const EquipmentItem = await EquipmentModule.EquipmentFactory.CreateNewEquipment(Requirement.value.toString(), null)
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
        },
        async canModelAddItem(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndItem, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[]) {            
            
            let CanAdd = relayVar;

            // Removed, required, banned
            if (CanAdd) {
                for (let i = 0; i < restrictions.length; i++) {
                    const CurRestriction : EquipmentRestriction = restrictions[i];

                    if (CurRestriction.removed) {
                        for (let j = 0; j < CurRestriction.removed.length; j++) {
                            const Requirement = CurRestriction.removed[j]
                            if (Requirement.category) {
                                if (trackVal.item.EquipmentItem.Category != Requirement.category) {
                                    continue;
                                }
                            }

                            if (Requirement.tag) {
                                if (!containsTag(trackVal.item.EquipmentItem.Tags, Requirement.tag) && !containsTag(trackVal.item.Tags, Requirement.tag)) {
                                    continue;
                                }
                            }                      
    
                            if (Requirement.res_type == "ducat") {
                                if (trackVal.item.CostType == 0) {
                                    if (Requirement.param == "maximum" ) {
                                        if (trackVal.item.Cost > Number(Requirement.value)) {
                                            CanAdd = false;
                                        }
                                    } else {
                                        if (trackVal.item.Cost < Number(Requirement.value)) {
                                            CanAdd = false;
                                        }
                                    }
                                }
                            }  
    
                            if (Requirement.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < trackVal.item.EquipmentItem.GetKeyWords().length; k++) {
                                    if (trackVal.item.EquipmentItem.GetKeyWords()[k].ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    CanAdd = false;
                                }
                            } 
    
                            if (Requirement.res_type == "all") {
                                CanAdd = false;
                            }
    
                            if (Requirement.res_type == "id") {
                                if (trackVal.item.EquipmentItem.ID == Requirement.value) {
                                    CanAdd = false;
                                }
                            }   
    
                            if (Requirement.res_type == "restricted") {
                                if (trackVal.item.RestrictedEquipment) {
                                    if (trackVal.item.RestrictedEquipment.length > 0) {
                                        CanAdd = false;
                                    }
                                }
                            }      
                        }
                    }

                    if (CurRestriction.required) {
                        let isRelevantAtAll = false;
                        let HasMet = false;
                        for (let j = 0; j < CurRestriction.required.length; j++) {
                            const Requirement = CurRestriction.required[j]
                            if (Requirement.category) {
                                if (trackVal.item.EquipmentItem.Category != Requirement.category) {
                                    continue;
                                }
                            }

                            if (Requirement.tag) {
                                if (!containsTag(trackVal.item.EquipmentItem.Tags, Requirement.tag) && !containsTag(trackVal.item.Tags, Requirement.tag)) {
                                    continue;
                                }
                            }
                            
                            isRelevantAtAll = true;
    
                            if (Requirement.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < trackVal.item.EquipmentItem.GetKeyWords().length; k++) {
                                    if (trackVal.item.EquipmentItem.GetKeyWords()[k].ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    HasMet = true;
                                }
                            } 

                            if (Requirement.res_type == "tag") {
                                if (containsTag(trackVal.item.EquipmentItem.Tags, Requirement.value.toString()) || containsTag(trackVal.item.Tags, Requirement.value.toString())) {
                                    HasMet = true;
                                }
                            }
    
                            if (Requirement.res_type == "id") {
                                if (trackVal.item.EquipmentItem.ID == Requirement.value) {
                                    HasMet = true;
                                }
                            }       
                        }
                        if (HasMet == false && isRelevantAtAll == true) {
                            CanAdd = false
                        }
                    }
                }
            }

            // Added
            if (!CanAdd) {
                for (let i = 0; i < restrictions.length; i++) {
                    const CurRestriction : EquipmentRestriction = restrictions[i];


                    if (CurRestriction.added) {
                        for (let j = 0; j < CurRestriction.added.length; j++) {
                            const Requirement = CurRestriction.added[j]

                            if (Requirement.category) {
                                if (trackVal.item.EquipmentItem.Category != Requirement.category) {
                                    continue;
                                }
                            }

                            if (Requirement.tag) {
                                if (!containsTag(trackVal.item.EquipmentItem.Tags, Requirement.tag) && !containsTag(trackVal.item.Tags, Requirement.tag)) {
                                    continue;
                                }
                            }

                            if (Requirement.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < trackVal.item.EquipmentItem.GetKeyWords().length; k++) {
                                    if (trackVal.item.EquipmentItem.GetKeyWords()[k].ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    CanAdd = true;
                                }
                            }
    
                            if (Requirement.res_type == "all") {
                                CanAdd = true;
                            }
    
                            if (Requirement.res_type == "id") {
                                if (trackVal.item.EquipmentItem.ID == Requirement.value) {
                                    CanAdd = true;
                                }
                            }
                        }
                    }
                }
            }
            if (CanAdd) {
                for (let i = 0; i < restrictions.length; i++) {
                    const CurRestriction : EquipmentRestriction = restrictions[i];

                    if (CurRestriction.banned) {
                        for (let j = 0; j < CurRestriction.banned.length; j++) {
                            const Requirement = CurRestriction.banned[j]
                            
                            if (await trackVal.model.HasEquipmentFollowingRestriction(Requirement)) {
                                CanAdd = false;
                            }
    
                            if (Requirement.res_type == "id") {
                                if (trackVal.item.EquipmentItem.ID == Requirement.value) {
                                    CanAdd = false;
                                }
                            }
                        }
                    }
                }
                
            }
            return CanAdd;
        }
    },
    restriction_override: {
        event_priotity: 1,
        modEquipmentRestriction(this: EventRunner, eventSource : any, relayVar : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) { 
            const totalList : EquipmentRestriction[] = relayVar as EquipmentRestriction[]
            if (context_func["overrides"]) {
                for (let i = 0 ; i < totalList.length; i++) {
                    const Restriction : EquipmentRestriction = totalList[i];
                    if (Restriction.removed) {
                        for (let j = 0; j < Restriction.removed.length; j++) {                        
                            const CurRes : RestrictionSingle = Restriction.removed[j];
                            for (let k = 0; k < context_func["overrides"].length; k++) {
                                if (CurRes.res_type == context_func["overrides"][k].type && CurRes.value == context_func["overrides"][k].model) {
                                    CurRes.value = (trackVal).CurModel.ID;
                                }
                            }
                        }
                    }

                    if (Restriction.required) {
                        for (let j = 0; j < Restriction.required.length; j++) {                        
                            const CurRes : RestrictionSingle = Restriction.required[j];
                            for (let k = 0; k < context_func["overrides"].length; k++) {
                                if (CurRes.res_type == context_func["overrides"][k].type && CurRes.value == context_func["overrides"][k].model) {
                                    CurRes.value = (trackVal).CurModel.ID;
                                }
                            }
                        }
                    }

                    if (Restriction.added) {
                        for (let j = 0; j < Restriction.added.length; j++) {                        
                            const CurRes : RestrictionSingle = Restriction.added[j];
                            for (let k = 0; k < context_func["overrides"].length; k++) {
                                if (CurRes.res_type == context_func["overrides"][k].type && CurRes.value == context_func["overrides"][k].model) {
                                    CurRes.value = (trackVal).CurModel.ID;
                                }
                            }
                        }
                    }

                    if (Restriction.permitted) {
                        for (let j = 0; j < Restriction.permitted.length; j++) {                        
                            const CurRes : RestrictionSingle = Restriction.permitted[j];
                            for (let k = 0; k < context_func["overrides"].length; k++) {
                                if (CurRes.res_type == context_func["overrides"][k].type && CurRes.value == context_func["overrides"][k].model) {
                                    CurRes.value = (trackVal).CurModel.ID;
                                }
                            }
                        }
                    }

                    if (Restriction.banned) {
                        for (let j = 0; j < Restriction.banned.length; j++) {                        
                            const CurRes : RestrictionSingle = Restriction.banned[j];
                            for (let k = 0; k < context_func["overrides"].length; k++) {
                                if (CurRes.res_type == context_func["overrides"][k].type && CurRes.value == context_func["overrides"][k].model) {
                                    CurRes.value = (trackVal).CurModel.ID;
                                }
                            }
                        }
                    }
                }
            }
            return totalList;
        }

    },
    eq_limit: {
        event_priotity: 1,
        async canModelAddItem(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndItem, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[]) {            
            let CanAdd = relayVar;

            if (trackVal.item != context_func['id']) {
                return CanAdd;
            }

            if (CanAdd) {
                
                let varcount = 0;

                for (let j = 0; j < (trackVal.model).GetEquipment().length; j++) {
                    const Equip = (trackVal.model).GetEquipment()[j].equipment
                    const EquipObj = (Equip.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment)
                    if (EquipObj.ID == context_func["id"]) {
                        varcount += 1;
                    }


                }

                if (varcount >= context_func["count"]) {
                    CanAdd = false;
                }
            }

            return CanAdd;
        }
    },
    model_equipment_limit : {
        event_priotity: 2,
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
                            const EquipmentItem = await EquipmentFactory.CreateNewEquipment(Requirement.value, null)
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
                            const EquipmentItem = await EquipmentFactory.CreateNewEquipment(Requirement.value, null)
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
        async canModelAddItem(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndItem, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[]) {            
            let CanAdd = relayVar;
            
            if (CanAdd) {
                const Limits : EquipmentLimit = context_func as EquipmentLimit;

                if (Limits.maximum) {
                    for (let i = 0; i < Limits.maximum.length; i++) {
                        const LimitMax = Limits.maximum[i]
                        
                        if (LimitMax.category) {
                            if (trackVal.item.EquipmentItem.Category != LimitMax.category) {
                                continue;
                            }
                        }

                        if (LimitMax.id) {
                            if (trackVal.item.EquipmentItem.ID != LimitMax.id) {
                                continue;
                            }
                        }

                        if (LimitMax.tag) {
                            if (!containsTag(trackVal.item.EquipmentItem.Tags, LimitMax.tag) && !containsTag(trackVal.item.Tags, LimitMax.tag)) {
                                continue;
                            }
                        }

                        if (LimitMax.res_type == "stat") {
                            if (LimitMax.value == "hands_melee") {
                                if (trackVal.item.EquipmentItem.Stats[LimitMax.value] != LimitMax.subvalue) {
                                    continue;
                                }
                            }
                        }
                        
                        if (LimitMax.res_type == "keyword") {
                            let Found = false;
                            for (let k = 0; k < trackVal.item.EquipmentItem.KeyWord.length; k++) {
                                if (trackVal.item.EquipmentItem.KeyWord[k].ID == LimitMax.value) {
                                    Found = true;
                                }
                            }
                            if (Found == false) {
                                continue
                            }
                        }  
    
                        if (LimitMax.res_type == "id") {
                            if (trackVal.item.EquipmentItem.ID != LimitMax.value) {
                                continue
                            }
                        }  

                        let varcount = 0;

                        for (let j = 0; j < (trackVal.model).GetEquipment().length; j++) {
                            const Equip = (trackVal.model).GetEquipment()[j].equipment
                            const EquipObj = (Equip.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment)
    
                            if (LimitMax.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < EquipObj.KeyWord.length; k++) {
                                    if (EquipObj.KeyWord[k].ID == LimitMax.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    varcount += 1;
                                }
                            }       

                            if (LimitMax.res_type == "tag") {
                                if (containsTag(EquipObj.Tags, LimitMax.value.toString()) || containsTag(Equip.Tags, LimitMax.value.toString())) {
                                    varcount += 1;
                                }
                            }
    
                            if (LimitMax.res_type == "id") {
                                if (EquipObj.ID == LimitMax.value) {
                                    varcount += 1;
                                }
                            } 
    
                            if (LimitMax.res_type == "self") {
                                if (EquipObj.ID == trackVal.item.EquipmentItem.ID) {
                                    varcount += 1;
                                }
                            } 
    
                            if (LimitMax.res_type == "category") {
                                if (EquipObj.Category == LimitMax.category) {
                                    varcount += 1;
                                }
                            } 
    
                            if (LimitMax.res_type == "stat") {
                                if (LimitMax.value == "hands_melee") {
                                    if (EquipObj.Stats[LimitMax.value] == LimitMax.subvalue) {
                                        varcount += 1;
                                    }
                                }
                            }  


                        }
                        if (varcount >= LimitMax.limit) {
                            CanAdd = false;
                        }
                    }
                }
                if (Limits.minimum) {
                    for (let i = 0; i < Limits.minimum.length; i++) {
                        const LimitMax = Limits.minimum[i]
                        
                        if (LimitMax.category) {
                            if (trackVal.item.EquipmentItem.Category != LimitMax.category) {
                                continue;
                            }
                        }

                        if (LimitMax.id) {
                            if (trackVal.item.EquipmentItem.ID != LimitMax.id) {
                                continue;
                            }
                        }

                        if (LimitMax.tag) {
                            if (!containsTag(trackVal.item.EquipmentItem.Tags, LimitMax.tag) && !containsTag(trackVal.item.Tags, LimitMax.tag)) {
                                continue;
                            }
                        }
                        
                        if (LimitMax.res_type == "id") {
                            if (trackVal.item.EquipmentItem.ID != LimitMax.value) {
                                continue
                            }
                        }  

                        let varcount = 0;

                        for (let j = 0; j < (trackVal.model).GetEquipment().length; j++) {
                            const Equip = (trackVal.model).GetEquipment()[j].equipment
                            const EquipObj = (Equip.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment)
    
                            if (LimitMax.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < EquipObj.KeyWord.length; k++) {
                                    if (EquipObj.KeyWord[k].ID == LimitMax.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    varcount += 1;
                                }
                            }       

                            if (LimitMax.res_type == "tag") {
                                if (containsTag(EquipObj.Tags, LimitMax.value.toString()) || containsTag(Equip.Tags, LimitMax.value.toString())) {
                                    varcount += 1;
                                }
                            }
    
                            if (LimitMax.res_type == "id") {
                                if (EquipObj.ID != LimitMax.value) {
                                    varcount += 1;
                                }
                            }  
    
                            if (LimitMax.res_type == "category") {
                                if (EquipObj.Category == LimitMax.category) {
                                    varcount += 1;
                                }
                            }  
    
                            if (LimitMax.res_type == "stat") {
                                if (LimitMax.value == "hands_melee") {
                                    if (EquipObj.Stats[LimitMax.value] == LimitMax.subvalue) {
                                        varcount += 1;
                                    }
                                }
                            }  


                        }

                        if (varcount <= LimitMax.limit) {
                            CanAdd = false;
                        }
                    }
                }
            }

            return CanAdd;
        }
        
    },
    equipment_add_keyword: {
        event_priotity: 0,
        async findFinalKeywordsForEquipment(this: EventRunner, eventSource : any, relayVar: Keyword[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, coreitem : WarbandEquipment) {
            const keywordmodule = await import("../../factories/features/KeywordFactory")
            const IDLIST : string[] = []
            const newList : Keyword[] = []
            if (context_func["equip_check"]) {
                let DoApply = false;

                for (let i = 0; i < context_func["equip_check"].length; i++) {
                    if(context_func["equip_check"][i]["check_type"] == "id") {
                        if (coreitem.GetEquipmentItem().ID == context_func["equip_check"][i]["value"]) {
                            DoApply = true;
                        }
                    }
                    if(context_func["equip_check"][i]["check_type"] == "category") {
                        if (coreitem.GetEquipmentItem().Category == context_func["equip_check"][i]["value"]) {
                            DoApply = true;
                        }
                    }
                }

                if (DoApply) {
                    
                    if (context_func["removals"]) {
                        const NewKeys = relayVar.filter((item) => (!context_func["removals"].includes(item.GetID())))
                        relayVar = NewKeys;
                    }
                    if (context_func["additions"]) {
                        for (let i = 0; i < context_func["additions"].length; i++) {
                            if (relayVar.filter((item) => (context_func["additions"][i] == (item.GetID()))).length == 0) {
                                const NewKeyword = await keywordmodule.KeywordFactory.CreateNewKeyword(context_func["additions"][i], null)

                                if (NewKeyword != null) {
                                    if (!IDLIST.includes(NewKeyword.ID)) {
                                        IDLIST.push(NewKeyword.ID)
                                        newList.push(NewKeyword)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < newList.length; i++) {
                relayVar.push(newList[i])
            }
            
            return relayVar;
        }
    },
    warband_equipment_limit : {
        event_priotity: 1,
        getEquipmentLimit(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            relayVar.push(context_func as EquipmentLimit)
            return relayVar;
        },
        async canWarbandAddItem(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[], item: FactionEquipmentRelationship) {            
            let CanAdd = relayVar;
            
            if (CanAdd) {

                if (context_func["ignore"]) {
                    for (let i = 0; i < context_func["ignore"].length; i++) {
                        if (context_func["ignore"][i]["type"] == "id") {
                            if (item.EquipmentItem.ID == context_func["ignore"][i]["value"]) {
                                return true;
                            }
                        }
                    }
                }

                const Limits : EquipmentLimit = context_func as EquipmentLimit;

                if (Limits.maximum) {
                    for (let i = 0; i < Limits.maximum.length; i++) {
                        const LimitMax = Limits.maximum[i]
                        
                        if (context_func["ignore"]) {
                            for (let i = 0; i < context_func["ignore"].length; i++) {
                                if (context_func["ignore"][i]["type"] == "id") {
                                    if (item.EquipmentItem.ID == context_func["ignore"][i]["value"]) {
                                        return true;
                                    }
                                }
                            }
                        }
                        
                        if (LimitMax.category) {
                            if (item.EquipmentItem.Category != LimitMax.category) {
                                continue;
                            }
                        }

                        if (LimitMax.tag) {
                            if (!containsTag(item.EquipmentItem.Tags, LimitMax.tag) && !containsTag(item.Tags, LimitMax.tag)) {
                                continue;
                            }
                        }

                        
                        if (LimitMax.res_type == "keyword") {
                            if (item.EquipmentItem.GetKeyWords().filter((item) => item.ID == LimitMax.value).length == 0) {
                                continue;
                            }
                        }

                        let varcount = 0;

                        const Allequip = (eventSource as UserWarband).GetAllEquipment()

                        for (let j = 0; j < Allequip.length; j++) {
                            const Equip = Allequip[j].equipment
                            const EquipObj = (Equip.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment)
    
                        
                            if (context_func["ignore"]) {
                                let DoSkip = false;
                                for (let j = 0; j < context_func["ignore"].length; j++) {
                                    if (context_func["ignore"][j]["type"] == "id") {
                                        if (EquipObj.ID == context_func["ignore"][j]["value"]) {
                                            DoSkip = true;
                                            break;
                                        }
                                    }
                                }
                                if (DoSkip) {
                                    continue;
                                }
                            }

                            if (LimitMax.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < EquipObj.KeyWord.length; k++) {
                                    if (EquipObj.KeyWord[k].ID == LimitMax.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    varcount += 1;
                                }
                            }       

                            if (LimitMax.res_type == "tag") {
                                if (containsTag(EquipObj.Tags, LimitMax.value.toString()) || containsTag(Equip.Tags, LimitMax.value.toString())) {
                                    varcount += 1;
                                }
                            }
    
                            if (LimitMax.res_type == "id") {
                                if (EquipObj.ID != LimitMax.value) {
                                    varcount += 1;
                                }
                            }  


                        }

                        if (varcount >= LimitMax.limit) {
                            CanAdd = false;
                        }
                    }
                }
                if (Limits.minimum) {
                    for (let i = 0; i < Limits.minimum.length; i++) {
                        const LimitMax = Limits.minimum[i]
                        
                        if (LimitMax.category) {
                            if (item.EquipmentItem.Category != LimitMax.category) {
                                continue;
                            }
                        }

                        if (LimitMax.tag) {
                            if (!containsTag(item.EquipmentItem.Tags, LimitMax.tag) && !containsTag(item.Tags, LimitMax.tag)) {
                                continue;
                            }
                        }

                        let varcount = 0;
                        const Allequip = (eventSource as UserWarband).GetAllEquipment()

                        for (let j = 0; j < Allequip.length; j++) {
                            const Equip = Allequip[j].equipment
                            const EquipObj = (Equip.MyEquipment.SelfDynamicProperty.OptionChoice as Equipment)
                        
                            if (context_func["ignore"]) {
                                let DoSkip = false;
                                for (let j = 0; j < context_func["ignore"].length; j++) {
                                    if (context_func["ignore"][j]["type"] == "id") {
                                        if (EquipObj.ID == context_func["ignore"][j]["value"]) {
                                            DoSkip = true;
                                            break;
                                        }
                                    }
                                }
                                if (DoSkip) {
                                    continue;
                                }
                            }
    
                            if (LimitMax.res_type == "keyword") {
                                let Found = false;
                                for (let k = 0; k < EquipObj.KeyWord.length; k++) {
                                    if (EquipObj.KeyWord[k].ID == LimitMax.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    varcount += 1;
                                }
                            }       

                            if (LimitMax.res_type == "tag") {
                                if (containsTag(EquipObj.Tags, LimitMax.value.toString()) || containsTag(Equip.Tags, LimitMax.value.toString())) {
                                    varcount += 1;
                                }
                            }
    
                            if (LimitMax.res_type == "id") {
                                if (EquipObj.ID != LimitMax.value) {
                                    varcount += 1;
                                }
                            }  


                        }

                        if (varcount <= LimitMax.limit) {
                            CanAdd = false;
                        }
                    }
                }
            }
            return CanAdd;
        }
        
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
        },
        async getMemberModelStatOptions(this: EventRunner, eventSource : any, relayVar : ModelStatistics[][], trackVal: WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null)  
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
    add_stat_option: {
        event_priotity: 1,
        async getMemberModelStatOptions(this: EventRunner, eventSource : any, relayVar : ModelStatistics[][], trackVal: WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null)  
        {
            const StatOptionList: ModelStatistics[][] = []
            const CurStats = await trackVal.CurModel.Stats;

            if (context_func["options"]) {
                for (let i = 0; i < context_func["options"].length; i++) {
                    const NewStats : ModelStatistics[] = context_func["options"][i]
                    if (context_func["type"] == "base") { 
                        NewStats.push({
                            base: CurStats.base
                        })
                    }
                    StatOptionList.push(NewStats)
                }
            }

            return relayVar.concat(StatOptionList);
        }
    },
    special_category_upgrades: {
        event_priotity: 0,
        async getUpgradeCategoryLimit(this: EventRunner, eventSource : any, relayVar : number,  trackVal : string ,context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["upgrades"]) {
                for (let i = 0; i < context_func["upgrades"].length; i++) {
                    if (context_func["upgrades"][i].category == trackVal) {
                        relayVar += context_func["upgrades"][i].count;
                    }
                }
            }
            
            return relayVar;
        }
            
    },
    faction_model_count_group: {
        event_priotity: 0,
        async getGroupLimitTrue(this: EventRunner, eventSource : FactionModelRelationship, relayVar : number, trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            if (context_func["number"]) {
                return context_func["number"]
            }
            if (context_func["match"]) {
                for (let i = 0 ; i < context_func["match"].length; i++) {
                    if (context_func["match"][i]["type"] == "model") {
                        const MatchVal = trackVal.GetCountOfModel(context_func["match"][i]["value"])
                        return MatchVal
                    }
                }
            }
            if (context_func["exceed"]) {
                for (let i = 0 ; i < context_func["exceed"].length; i++) {
                    if (context_func["exceed"][i]["type"] == "keyword") {
                        const MatchVal = await trackVal.GetCountOfKeyword(context_func["exceed"][i]["value"])
                        return MatchVal
                    }
                    if (context_func["exceed"][i]["type"] == "tag") {
                        const MatchVal = await trackVal.GetCountOfTag(context_func["exceed"][i]["value"], context_func["exceed"][i]["subvalue"])
                        return MatchVal
                    }
                }
            }
            if (context_func["warband_limit"]) {
                const CurThresh = await trackVal.GetCampaignTresholdValue()
                let CurSize = relayVar;
                for (let i = 0; i < context_func["warband_limit"].length; i++) {
                    if (context_func["warband_limit"][i]["size"] <= CurThresh) {
                        CurSize = context_func["warband_limit"][i]["value"]
                    }
                    
                }
                return CurSize
            }
            
            return relayVar;
        },
        async getCountOfGroup(this: EventRunner, eventSource : any, relayVar : number,  trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            if (context_func["filter"]) {
                for (let i = 0 ; i < context_func["filter"].length; i++) {
                    const CurVal = context_func["filter"][i];
                    if (CurVal["tag"]) {
                        const MatchVal = await trackVal.GetCountOfTag(CurVal["tag"], true)
                        
                        return MatchVal
                    }
                    if (CurVal["id"]) {
                        let curcount = 0;
                        for (let j = 0; j < CurVal["id"].length; j++) {
                            const MatchVal = await trackVal.GetCountOfModel(CurVal["id"][j])
                            curcount += MatchVal;
                        }
                        
                        return curcount
                    }
                }
            }
            
            return relayVar;
        }
    },
    model_limit_increase: {
        event_priotity: 1,
        async getModelLimitTrue(this: EventRunner, eventSource : any, relayVar : number, trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, refmodel : FactionModelRelationship) {
            const DynamicModule = await import("../../classes/options/DynamicOptionContextObject");
            if (context_main instanceof DynamicModule.DynamicOptionContextObject) {
                for (let i = 0; i < context_main.Selections.length; i++) {
                    const selection = context_main.Selections[i];
                    if (selection.SelectedChoice != null) {
                        if (selection.SelectedChoice.value.ID == refmodel.ID) {
                            return relayVar + context_func["count"];
                        }
                    }
                }
            }
            return relayVar
        }
    },
    faction_model_count_special: {
        event_priotity: 0,
        async getModelLimitTrue(this: EventRunner, eventSource : any, relayVar : number, trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {

            if (context_func["match"]) {
                if (context_func["match"][0]["type"] == "model") {
                    const MatchVal = trackVal.GetCountOfModel(context_func["match"][0]["value"])
                    return MatchVal;
                }
            }
            if (context_func["exceed"]) {
                if (context_func["exceed"][0]["type"] == "keyword") {
                    const MatchVal = await trackVal.GetCountOfKeyword(context_func["exceed"][0]["value"])
                    return MatchVal
                }
            }
            if (context_func["warband_limit"]) {
                const CurThresh = await trackVal.GetCampaignTresholdValue()
                let CurSize = relayVar;
                for (let i = 0; i < context_func["warband_limit"].length; i++) {
                    if (context_func["warband_limit"][i]["size"] <= CurThresh) {
                        CurSize = context_func["warband_limit"][i]["value"]
                    }
                    
                }
                return CurSize;
            }
            
            return relayVar;
        },
        async getModelLimitPresentation(this: EventRunner, eventSource : any, relayVar : string[], trackVal : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { ModelFactory } = await import("../../factories/features/ModelFactory");
            const { KeywordFactory } = await import("../../factories/features/KeywordFactory");
            if (trackVal == true) {
                if (context_func["match"]) {
                    if (context_func["match"][0]["type"] == "model") {
                        const ModelItem = await ModelFactory.CreateNewModel(context_func["match"][0]["value"], null)
                        return ["Number of " + ModelItem.Name]
                    }
                }
                if (context_func["exceed"]) {
                    if (context_func["exceed"][0]["type"] == "keyword") {
                        const KeywordItem = await KeywordFactory.CreateNewKeyword(context_func["exceed"][0]["value"], null)
                        return ["Must be outnumbered by models with the keyword " + KeywordItem.Name]
                    }
                }
                if (context_func["warband_limit"]) {
                    for (let i = 0; i < context_func["warband_limit"].length; i++) {
                        relayVar.push("( " + context_func["warband_limit"][i]["value"] + " in a warband worth over " + context_func["warband_limit"][i]["size"] + " ducats)")
                    }
                }
            }
            
            return relayVar;
        }
    },
    faction_upgrade_count_special: {
        event_priotity: 0,
        async getUpgradeLimitPresentation(this: EventRunner, eventSource : any, relayVar : string[], trackVal : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
                        
            const { ModelFactory } = await import("../../factories/features/ModelFactory");
            if (trackVal == true) {
                if (context_func["match"]) {
                    for (let i  = 0; i < context_func["match"].length; i++) {
                        if (context_func["match"][i]["type"] == "model") {
                            const ModelItem = await ModelFactory.CreateNewModel(context_func["match"][i]["value"], null)
                            let prelude = ""

                            if (context_func["match"][i]["modifier"]) {
                                if (context_func["match"][i]["modifier"] == 'half') {
                                    prelude = "Half your "
                                }
                            } else {
                                prelude = "Number of "
                            }

                            return [prelude + ModelItem.Name]
                        }
                    }
                }
                if (context_func["warband_limit"]) {
                    for (let i = 0; i < context_func["warband_limit"].length; i++) {
                        relayVar.push("( " + context_func["warband_limit"][i]["value"] + " in a warband worth over " + context_func["warband_limit"][i]["size"] + " ducats)")
                    }
                }
            }

            return relayVar;
        },
        async getUpgradeLimitTrue(this: EventRunner, eventSource : any, relayVar : number,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["match"]) {
                
                for (let i  = 0; i < context_func["match"].length; i++) {
                    if (context_func["match"][i]["type"] == "model") {
                        const count = await trackVal.warband.GetCountOfModel(context_func["match"][0]["value"]);
                        if (context_func["match"][i]["modifier"] == "half") {
                            return Math.floor(count * 0.5);
                        }
                    }
                }
            }
            if (context_func["warband_limit"]) {
                for (let i = 0; i < context_func["warband_limit"].length; i++) {
                    
                    const CurThresh = await trackVal.warband.GetCampaignTresholdValue()
                    let CurSize = relayVar;
                    for (let i = 0; i < context_func["warband_limit"].length; i++) {
                        if (context_func["warband_limit"][i]["size"] <= CurThresh) {
                            CurSize = context_func["warband_limit"][i]["value"]
                        }
                        
                    }
                    return CurSize;
                }
            }
            
            return relayVar;
        }
            
    },
    add_patron: {
        event_priotity: 0,
            
        async addExtraPatronOptions(this: EventRunner, eventSource : any, relayVar : Patron[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const { SkillFactory } = await import("../../factories/features/SkillFactory");

            if (context_func["list"] != undefined) {
                for (let i = 0; i < context_func["list"].length; i++) {
                    const id : string = context_func["list"][i]
                    const NewPatron : Patron = await SkillFactory.CreateNewPatron(id, null)
                    relayVar.push(NewPatron);
                }
            }
            return relayVar;
        }
    },
    unique : {
        event_priotity: 0,
        async cantSwapItemFromModel(this: EventRunner, eventSource : any, relayVar: boolean, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return true;
        }
    },
    unremovable: {
        event_priotity: 0,
        async canRemoveItemFromModel(this: EventRunner, eventSource : any, relayVar: boolean, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return false;
        }
    },
    add_scars: {
        event_priotity: 0,
        async getMaximumScars(this: EventRunner, eventSource : any, relayVar: number, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            if (context_func["value"]) {
                relayVar += context_func["value"]
            }
            return relayVar;
        }
    },
    get_exploration_skills: {
        event_priotity: 0,
        async getExplorationSkills(this: EventRunner, eventSource : any, relayVar : WarbandProperty[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { SkillFactory } = await import("../../factories/features/SkillFactory");
            const WarbandPropModule = await import('../../classes/saveitems/Warband/WarbandProperty');
            if (context_func["add_skill"]) {
                for (let i = 0; i < context_func["add_skill"].length; i++) {
                    const SkillNew : Skill = await SkillFactory.CreateNewSkill(context_func["add_skill"][i], eventSource);                    
                    const NewRuleProperty = new WarbandPropModule.WarbandProperty(SkillNew, eventSource, null, null);
                    await NewRuleProperty.HandleDynamicProps(SkillNew, eventSource, null, null);
                    await NewRuleProperty.BuildConsumables([]);
                    relayVar.push(NewRuleProperty);
                }
            }
            
            return relayVar;
        }
    },
    override_required_upgrade: {
        event_priotity: 1,
        async getUpgradeRestrictionsPresentation(this: EventRunner, eventSource : any, relayVar : string[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
           
            const { ModelFactory } = await import("../../factories/features/ModelFactory");

            if (context_func["filters"]) {          
                for (let i = 0; i < context_func["filters"].length; i++) {
                    const curFilter = context_func["filters"][i];

                    if (curFilter["type"] == "id") {
                        const ModelItem = await ModelFactory.CreateNewModel(curFilter["value"], null)
                        relayVar.push("Unless the model is a " + ModelItem.Name);
                    }
                }
            }
            return relayVar;
        },
        async getRequiredUpgradesBool(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {

            if (context_func["filters"]) {

                for (let i = 0; i < context_func["filters"].length; i++) {
                    const filter_type = context_func["filters"][i]["type"]
                    const filter_value = context_func["filters"][i]["value"]

                    if (filter_type == "id") {
                        relayVar = !(trackVal.model.CurModel.GetID() == filter_value);
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

            for (let k = 0; k < context_func['list'].length; k++) {
                const curUpgrade = context_func['list'][k]
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
                                        value: curUpgrade["model_key"],
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
                    UpgradeList[i].model_id_set = curUpgrade["models_id"]
                    relayVar.push(await UpgradeFactory.CreateModelUpgrade(UpgradeList[i], null))
                }
            }
            return relayVar;
        },
        async getContextuallyAddedUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { UpgradeFactory } = await import("../../factories/features/UpgradeFactory");

            for (let k = 0; k < context_func['list'].length; k++) {
                const curUpgrade = context_func['list'][k]
                let ValidUpgrade = false;

                if (curUpgrade['filters'] ) {
                    for (let i = 0; i < curUpgrade['filters'].length; i++) {
                        const curFilter = curUpgrade['filters'][i]
                        if (curFilter["type"] == "keyword") {            
                            if (curFilter['truth'] == true) {
                                if (trackVal.getKeywordIDs().includes(curFilter["value"])) {
                                    ValidUpgrade = true;
                                } else {
                                    ValidUpgrade = false;
                                    break;
                                }
                            } else {
                                if (trackVal.getKeywordIDs().includes(curFilter["value"])) {
                                    ValidUpgrade = false;
                                    break;
                                } else {
                                    ValidUpgrade = true;
                                }
                            }
                        }
                    }
                }
                
                if (curUpgrade['models_id'] ) {
                    for (let i = 0; i < curUpgrade['models_id'].length; i++) {
                        if (trackVal.ID == curUpgrade['models_id'][i]) {
                            ValidUpgrade = true;
                            break;
                        }
                    }
                }


                if (ValidUpgrade) {
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
                                            value: curUpgrade["model_key"].toString(),
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
                        UpgradeList[i].model_id_set = curUpgrade["models_id"]
                        relayVar.push(await UpgradeFactory.CreateModelUpgrade(UpgradeList[i], null))
                    }
                    
                }
            }

            return relayVar;
        },
        async getWarbandMemberUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { UpgradeFactory } = await import("../../factories/features/UpgradeFactory");
            
            for (let k = 0; k < context_func['list'].length; k++) {
                const ExistingIDs : string[] = [];

                const curUpgrade = context_func['list'][k]
                let ValidUpgrade = false;

                if (curUpgrade['filters'] ) {
                    for (let i = 0; i < curUpgrade['filters'].length; i++) {
                        const curFilter = curUpgrade['filters'][i]
                        if (curFilter["type"] == "keyword") {            
                            if (curFilter['truth'] == true) {
                                if ((await trackVal.GetKeywordID()).includes(curFilter["value"])) {
                                    ValidUpgrade = true;
                                } else {
                                    ValidUpgrade = false;
                                    break;
                                }
                            } else {
                                if ((await trackVal.GetKeywordID()).includes(curFilter["value"])) {
                                    ValidUpgrade = false;
                                    break;
                                } else {
                                    ValidUpgrade = true;
                                }
                            }
                        }
                    }
                }
                
                if (curUpgrade['models_id'] ) {
                    for (let i = 0; i < curUpgrade['models_id'].length; i++) {
                        if (trackVal.CurModel.ID == curUpgrade['models_id'][i]) {
                            ValidUpgrade = true;
                            break;
                        }
                    }
                }                

                for (let i = 0; i < relayVar.length; i++) {
                    ExistingIDs.push(relayVar[i].GetID())
                }

                if (ValidUpgrade) {
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
                                            value: curUpgrade["model_key"].toString(),
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
                        if (!ExistingIDs.includes(UpgradeList[i].upgrade_id)) {
                            UpgradeList[i].model_id_set = curUpgrade["models_id"]
                            relayVar.push(await UpgradeFactory.CreateModelUpgrade(UpgradeList[i], null))
                        }
                    }
                    
                }
            }

            return relayVar;
        }
    },
    faction_remove_upgrades : {
        event_priotity: 1,
        async getContextuallyAddedUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return relayVar.filter(item => !(context_func["upgrades"].includes(item.ID)))
        },
        async getWarbandMemberUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return relayVar.filter(item => !(context_func["upgrades"].includes(item.ID)))
        }
    },
    gain_ducats: {
        event_priotity: 0,
        
        async onGainSkill(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            if (context_func["value"]) {
                warband.Ducats += context_func["value"]
            }
        }
    },
    add_to_model: {
        event_priotity: 0,
        async getContextuallyAddedAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { AbilityFactory } = await import("../../factories/features/AbilityFactory");

            let ValidUpgrade = true;

            if (context_func['removed'] ) {
                for (let i = 0; i < context_func['removed'].length; i++) {
                    const curFilter = context_func['removed'][i]
                    if (curFilter["category"] == "id") {            
                        if (curFilter["value"].includes(trackVal.ID)) {
                            ValidUpgrade = false;
                        }
                    }
                }
            }

            if (context_func['required'] ) {
                for (let i = 0; i < context_func['required'].length; i++) {
                    const curFilter = context_func['required'][i]
                    if (curFilter["category"] == "id") {            
                        if (curFilter["value"].includes(trackVal.ID)) {
                            ValidUpgrade = true;
                        } else {
                            ValidUpgrade = false;
                        }
                    }
                }
            }

            if (ValidUpgrade) {
                const AbilityList = Requester.MakeRequest(
                    {searchtype: "id", searchparam: {type: "factionrule", id: context_func["id"]}}
                ) as IAbility
                relayVar.push(await AbilityFactory.CreateAbility(AbilityList, null))
            }
            return relayVar;
        },
        async getWarbandMemberAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { AbilityFactory } = await import("../../factories/features/AbilityFactory");

            let ValidUpgrade = true;

            if (context_func['removed'] ) {
                for (let i = 0; i < context_func['removed'].length; i++) {
                    const curFilter = context_func['removed'][i]
                    if (curFilter["category"] == "id") {            
                        if (curFilter["value"].includes(trackVal.CurModel.ID)) {
                            ValidUpgrade = false;
                        }
                    }
                }
            }

            if (context_func['required'] ) {
                for (let i = 0; i < context_func['required'].length; i++) {
                    const curFilter = context_func['required'][i]
                    if (curFilter["category"] == "id") {            
                        if (curFilter["value"].includes(trackVal.CurModel.ID)) {
                            ValidUpgrade = true;
                        } else {
                            ValidUpgrade = false;
                        }
                    }
                }
            }

            if (ValidUpgrade) {
                const AbilityList = Requester.MakeRequest(
                    {searchtype: "id", searchparam: {type: "factionrule", id: context_func["id"]}}
                ) as IAbility
                relayVar.push(await AbilityFactory.CreateAbility(AbilityList, null))
            }
            return relayVar;
        }

    },
    stash_equipment: {
        event_priotity: 0,
        async onGainUpgrade(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            const equipment = trackVal.GetEquipment();

            for (let i = 0; i < equipment.length; i++) {
                const curequip = equipment[i];
                await trackVal.DeleteStash(curequip);
                await warband.DirectAddStash(curequip)
            }
        }
    },
    reset_scar: {
        event_priotity: 0,
        async onGainUpgrade(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            const injuries = trackVal.GetInjuriesList();

            for (let i = 0; i < injuries.length; i++) {
                await trackVal.DeleteInjury(injuries[i])
            }
            trackVal.ScarReserve = 0;
        }
    },
    reset_skill: {
        event_priotity: 0,
        async onGainUpgrade(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            const skills = trackVal.GetSkillsList();

            for (let i = 0; i < skills.length; i++) {
                await trackVal.DeleteSkill(skills[i])
            }
            trackVal.Experience = 0;
        }
    },
    equipment_remove_ability: {
        event_priotity: 1,
        async getWarbandMemberAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            let List : Ability[] = []
            if (context_func['action_id'] ) {
                List = relayVar.filter((item) => (context_func['action_id'].includes(item.ID) == false))
            }
            return List;
        }
    },
    override_upgrade_restriction: {
        event_priotity: 0,
        async getRestrictedUpgradesBool(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, refUpg : ModelUpgradeRelationship) {
            
            for (let i = 0; i < context_func["id"].length; i++) {
                if (refUpg.ID == context_func["id"][i]) {
                    return false;
                }
            }
            return relayVar;
        }
    },
    true_add_to_model: {
        event_priotity: 0,
        async getContextuallyAddedAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { AbilityFactory } = await import("../../factories/features/AbilityFactory");

            for (let k = 0; k < context_func['list'].length; k++) {
                const curUpgrade = context_func['list'][k]
                let ValidUpgrade = true;

                if (curUpgrade['removed'] ) {
                    for (let i = 0; i < curUpgrade['removed'].length; i++) {
                        const curFilter = curUpgrade['removed'][i]
                        if (curFilter["category"] == "id") {            
                            if (curFilter["value"].includes(trackVal.ID)) {
                                ValidUpgrade = false;
                            }
                        }
                    }
                }

                if (curUpgrade['required'] ) {
                    for (let i = 0; i < curUpgrade['required'].length; i++) {
                        const curFilter = curUpgrade['required'][i]
                        if (curFilter["category"] == "id") {            
                            if (curFilter["value"].includes(trackVal.ID)) {
                                ValidUpgrade = true;
                            } else {
                                ValidUpgrade = false;
                            }
                        }
                    }
                }

                if (ValidUpgrade) {
                    const AbilityList = Requester.MakeRequest(
                        {searchtype: "id", searchparam: {type: "ability", id: curUpgrade["id"]}}
                    ) as IAbility
                    relayVar.push(await AbilityFactory.CreateAbility(AbilityList, null))
                }
            }
            return relayVar;
        },
        async getWarbandMemberAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { AbilityFactory } = await import("../../factories/features/AbilityFactory");

            for (let k = 0; k < context_func['list'].length; k++) {
                const curUpgrade = context_func['list'][k]
                let ValidUpgrade = true;

                if (curUpgrade['removed'] ) {
                    for (let i = 0; i < curUpgrade['removed'].length; i++) {
                        const curFilter = curUpgrade['removed'][i]
                        if (curFilter["category"] == "id") {            
                            if (curFilter["value"].includes(trackVal.CurModel.ID)) {
                                ValidUpgrade = false;
                            }
                        }
                    }
                }

                if (curUpgrade['required'] ) {
                    for (let i = 0; i < curUpgrade['required'].length; i++) {
                        const curFilter = curUpgrade['required'][i]
                        if (curFilter["category"] == "id") {            
                            if (curFilter["value"].includes(trackVal.CurModel.ID)) {
                                ValidUpgrade = true;
                            } else {
                                ValidUpgrade = false;
                            }
                        }
                    }
                }

                if (ValidUpgrade) {
                    const AbilityList = Requester.MakeRequest(
                        {searchtype: "id", searchparam: {type: "ability", id: curUpgrade["id"]}}
                    ) as IAbility
                    relayVar.push(await AbilityFactory.CreateAbility(AbilityList, null))
                }
            }
            return relayVar;
        }

    },
    remove_from_model: {
        event_priotity: 0,
        async getContextuallyAddedAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["id"].includes(trackVal.ID)) {
                return relayVar.filter(item => !(context_func["abilities"].includes(item.ID)))
            } else {
                return relayVar;
            }
        },
        async getWarbandMemberAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["id"].includes(trackVal.CurModel.ID)) {
                return relayVar.filter(item => !(context_func["abilities"].includes(item.ID)))
            } else {
                return relayVar;
            }
        }

    },
    faction_eq_restriction: {
        event_priotity: 0,        
        async getEquipmentRestrictionPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            
            const ModelModule = await import("../../factories/features/ModelFactory");
            const EquipmentModule = await import("../../factories/features/EquipmentFactory");
            const UpgradeModule = await import("../../factories/features/UpgradeFactory");

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
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value.toString(), null)
                            NewStringParts.push(makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }  

                        if (Requirement.res_type == "id") {
                            const ModelItem = await ModelModule.ModelFactory.CreateNewModel(Requirement.value.toString(), null)
                            NewStringParts.push(""+(ModelItem.Name))
                        }   

                        if (Requirement.res_type == "equipment") {
                            const EquipItem = await EquipmentModule.EquipmentFactory.CreateNewEquipment(Requirement.value.toString(), null)
                            NewStringParts.push(""+(EquipItem.Name))
                        }                  

                        if (Requirement.res_type == "upgrade") {
                            const UpgradeItem = await UpgradeModule.UpgradeFactory.CreateNewUpgrade(Requirement.value.toString(), null)
                            NewStringParts.push(""+(UpgradeItem.Name))
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
                            const ValKey : Keyword = KeywordFactory.CreateNewKeyword(Requirement.value.toString(), null)
                            NewStringParts.push("Not " + makestringpresentable(ValKey.Name? ValKey.Name : ""))
                        }  

                        if (Requirement.res_type == "id") {
                            const ModelItem = await ModelModule.ModelFactory.CreateNewModel(Requirement.value.toString(), null)
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
        },
        async canModelAddItem(this: EventRunner, eventSource : any, relayVar : boolean,  trackVal : MemberAndItem, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, restrictions : EquipmentRestriction[]) {            
            
            let CanAdd = relayVar;

            // Permitted
            if (CanAdd) {
                for (let i = 0; i < restrictions.length; i++) {
                    const CurRestriction : EquipmentRestriction = restrictions[i];

                    if (CurRestriction.permitted) {
                        let PassedOne = false;
                        for (let j = 0; j < CurRestriction.permitted.length; j++) {
                            const Requirement = CurRestriction.permitted[j]

                            if (Requirement.category) {
                                if ((eventSource as FactionEquipmentRelationship).EquipmentItem.Category != Requirement.category) {
                                    continue;
                                }
                            }

                            if (Requirement.tag) {
                                if (!containsTag((eventSource as FactionEquipmentRelationship).EquipmentItem.Tags, Requirement.tag) && !containsTag((eventSource as FactionEquipmentRelationship).Tags, Requirement.tag)) {
                                    continue;
                                }
                            }

                            if (Requirement.res_type == "keyword") {
                                let Found = false;
                                const modelkeywords = await trackVal.model.GetKeywordsFull()
                                for (let k = 0; k < modelkeywords.length; k++) {
                                    if (modelkeywords[k].ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    PassedOne = true;
                                }
                            }  

                            if (Requirement.res_type == "id") {
                                if (trackVal.model.CurModel.ID == Requirement.value) {
                                    PassedOne = true;
                                }
                            }  
    
                            if (Requirement.res_type == "equipment") {
                                let Found = false;
                                for (let k = 0; k < trackVal.model.GetEquipment().length; k++) {
                                    if (trackVal.model.GetEquipment()[k].equipment.MyEquipment.SelfDynamicProperty.OptionChoice.ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    PassedOne = true;
                                }
                            }                  
    
                            if (Requirement.res_type == "upgrade") {
                                let Found = false;
                                for (let k = 0; k < trackVal.model.Upgrades.length; k++) {
                                    if ((trackVal.model.Upgrades[k].HeldObject as WarbandProperty).SelfDynamicProperty.OptionChoice.ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    PassedOne = true;
                                }
                            }                  
    
                        }
                        if (CanAdd == true) {
                            CanAdd = PassedOne;
                        }
                    }
                    
                    if (CurRestriction.banned) {
                        for (let j = 0; j < CurRestriction.banned.length; j++) {
                            const Requirement = CurRestriction.banned[j]

                            if (Requirement.category) {
                                if ((eventSource as FactionEquipmentRelationship).EquipmentItem.Category != Requirement.category) {
                                    continue;
                                }
                            }

                            if (Requirement.tag) {
                                if (!containsTag((eventSource as FactionEquipmentRelationship).EquipmentItem.Tags, Requirement.tag) && !containsTag((eventSource as FactionEquipmentRelationship).Tags, Requirement.tag)) {
                                    continue;
                                }
                            }

                            if (Requirement.res_type == "keyword") {
                                let Found = false;
                                const modelkeywords = await trackVal.model.GetKeywordsFull()
                                for (let k = 0; k < modelkeywords.length; k++) {
                                    if (modelkeywords[k].ID == Requirement.value) {
                                        Found = true;
                                    }
                                }
                                if (Found == true) {
                                    CanAdd = false;
                                }
                            }  

                            if (Requirement.res_type == "id") {
                                if (trackVal.model.CurModel.ID == Requirement.value) {
                                    CanAdd = false;
                                }
                            }                  
                        }
                    }
                }
            }

            return CanAdd;
        }
    },
    faction_choose_equipment: {
        event_priotity: 0,
        async getAllFactionEquipmentRelationships(this: EventRunner, eventSource : any, relayVar : FactionEquipmentRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const EquipRelModule = await import("../../classes/relationship/faction/FactionEquipmentRelationship");
            const DynamicModule = await import("../../classes/options/DynamicOptionContextObject");
            try {
                if (context_main != null) {
                    if (context_main instanceof DynamicModule.DynamicOptionContextObject) {
                        const optionobj = context_main;
                        for (let i = 0; i < optionobj.Selections.length; i++) {
                            const selection = optionobj.Selections[i];
                            if (selection.SelectedChoice != null) {
                                if (selection.SelectedChoice.value instanceof EquipRelModule.FactionEquipmentRelationship) {
                                    let ispresent = false;
                                    for (let j = 0; j < relayVar.length; j++) {
                                        if (relayVar[j].ID == selection.SelectedChoice.value.ID) {
                                            ispresent = true;
                                        }
                                    }
                                    if (ispresent == false) {
                                        relayVar.push(selection.SelectedChoice.value)
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
            return relayVar;
        },
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");
            const { FactionEquipmentRelationship } = await import("../../classes/relationship/faction/FactionEquipmentRelationship");

            for (let i = 0; i < relayVar.length; i++) {
                
                const ModelItem = ((relayVar[i].value instanceof FactionEquipmentRelationship)? relayVar[i].value :
                    await EquipmentFactory.CreateFactionEquipment(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
            }

            return relayVar
        },
        async parseOptionFilterDown(this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const EquipmentFactoryModule = await import("../../factories/features/EquipmentFactory");
            const FactionEquipmentRelationshipModule = await import("../../classes/relationship/faction/FactionEquipmentRelationship");
            
            const NewChoices : IChoice[] = []
            const SubItem = context_func["additions"][trackVal]
            for (let i = 0; i < relayVar.length; i++) {

                const ModelItem = ((relayVar[i].value instanceof FactionEquipmentRelationshipModule.FactionEquipmentRelationship)? relayVar[i].value :
                    await EquipmentFactoryModule.EquipmentFactory.CreateFactionEquipment(relayVar[i].value, null)
                )
                if (ModelItem.EquipmentItem == undefined) {
                    continue;
                }
                for (let j = 0; j < SubItem["restriction"].length; j++) {
                    if (SubItem["restriction"][j].category) {
                        if ( (ModelItem.EquipmentItem.Category == SubItem["restriction"][j].category)) {
                            NewChoices.push(relayVar[i])

                            const EventProc: EventRunner = new EventRunner();

                            const result = await EventProc.runEvent(
                                "getEquipmentRestriction",
                                ModelItem,
                                [],
                                [],
                                null
                            );
                            ModelItem.RestrictedEquipment = result;

                            const result_presentation = await EventProc.runEvent(
                                "getEquipmentRestrictionPresentable",
                                ModelItem,
                                [],
                                [],
                                ModelItem.RestrictedEquipment
                            );

                            relayVar[i].display_str = ModelItem.Name + (" (" + ModelItem.Cost.toString() + " " + getCostType(ModelItem.CostType) + ") ") + (ModelItem.Limit != 0? " (Limit " + ModelItem.Limit + ")" : "") + (result_presentation.length > 0? " (" + result_presentation.join(', ') + " only)" : "")

                            break;
                        }
                    }
                }
            }

            NewChoices.sort(function(a, b) {
                return a.display_str.localeCompare(b.display_str);
              });

            return NewChoices
        }
    },
    new_upgrade: {
        event_priotity: 0,
        async parseOptionFilterDown(this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const UpgradeFactoryModule = await import("../../factories/features/UpgradeFactory");
            const UpgradeModule = await import("../../classes/feature/ability/Upgrade");
            
            const NewChoices : IChoice[] = []
            for (let i = 0; i < relayVar.length; i++) {

                const ModelItem = ((relayVar[i].value instanceof UpgradeModule.Upgrade)? relayVar[i].value :
                    await UpgradeFactoryModule.UpgradeFactory.CreateUpgrade(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.GetTrueName();
                NewChoices.push(relayVar[i])
            }

            NewChoices.sort(function(a, b) {
                return a.display_str.localeCompare(b.display_str);
              });

            return NewChoices
        }
    },
    model_add_equipment: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");
            const { FactionEquipmentRelationship } = await import("../../classes/relationship/faction/FactionEquipmentRelationship");

            for (let i = 0; i < relayVar.length; i++) {
                
                const ModelItem = ((relayVar[i].value instanceof FactionEquipmentRelationship)? relayVar[i].value :
                    await EquipmentFactory.CreateFactionEquipment(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
            }

            return relayVar
        },
        async parseOptionFilterDown(this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { EquipmentFactory } = await import("../../factories/features/EquipmentFactory");
            const { FactionEquipmentRelationship } = await import("../../classes/relationship/faction/FactionEquipmentRelationship");
            
            const NewChoices : IChoice[] = []
            const SubItem = context_func["additions"][trackVal]

            for (let i = 0; i < relayVar.length; i++) {

                const ModelItem = ((relayVar[i].value instanceof FactionEquipmentRelationship)? relayVar[i].value :
                    await EquipmentFactory.CreateFactionEquipment(relayVar[i].value, null)
                )
                if (ModelItem.EquipmentItem == undefined) {
                    continue;
                }
                
                for (let j = 0; j < SubItem["restriction"].length; j++) {
                    if (SubItem["restriction"][j].category) {
                        if ((!ModelItem.Tags["exploration_only"]) && (ModelItem.EquipmentItem.Category == SubItem["restriction"][j].category)) {
                            NewChoices.push(relayVar[i])
                            const EventProc: EventRunner = new EventRunner();

                            const result = await EventProc.runEvent(
                                "getEquipmentRestriction",
                                ModelItem,
                                [],
                                [],
                                null
                            );
                            ModelItem.RestrictedEquipment = result;

                            const result_presentation = await EventProc.runEvent(
                                "getEquipmentRestrictionPresentable",
                                ModelItem,
                                [],
                                [],
                                ModelItem.RestrictedEquipment
                            );

                            relayVar[i].display_str = ModelItem.Name + (" " + ModelItem.Cost.toString() + " " + getCostType(ModelItem.CostType) + " " ) + (ModelItem.Limit != 0? " (Limit " + ModelItem.Limit + ")" : "") + (result_presentation.length > 0? " (" + result_presentation.join(', ') + " only)" : "")

                            break;
                        }
                    }
                }
                
                
            }

            NewChoices.sort(function(a, b) {
                return a.display_str.localeCompare(b.display_str);
              });

            return NewChoices
        },
        async getAddedModelEquipmentOptions(this: EventRunner, eventSource : any, relayVar : FactionEquipmentRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const prop = context_main as DynamicOptionContextObject;
            for (let i = 0; i < prop.Selections.length; i++) {
                if (prop.Selections[i].SelectedChoice != null) {
                    relayVar.push(prop.Selections[i].SelectedChoice?.value)
                }
            }
            return relayVar
        }
    },
    faction_rule_option: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { RuleFactory } = await import("../../factories/features/RuleFactory");
            const { Rule } = await import("../../classes/feature/faction/Rule");

            for (let i = 0; i < relayVar.length; i++) {
                const ModelItem = ((relayVar[i].value instanceof Rule)? relayVar[i].value :
                    await RuleFactory.CreateRule(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.Name? ModelItem.Name : "";
            }

            return relayVar
        },
        returnOptionDisplay(this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            

            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    {(relayVar != null && relayVar != undefined) &&
                        <RuleDisplay data={relayVar.value} />
                    }
                </ErrorBoundary>
            )
        }
    },
    location_rule_option: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { ExplorationFactory } = await import("../../factories/features/ExplorationFactory");
            const { ExplorationLocation } = await import("../../classes/feature/exploration/ExplorationLocation");

            for (let i = 0; i < relayVar.length; i++) {
                const ModelItem = ((relayVar[i].value instanceof ExplorationLocation)? relayVar[i].value :
                    await ExplorationFactory.CreateExplorationLocation(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.Name? ModelItem.Name : "";
            }

            return relayVar
        },
        returnOptionDisplay(this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            

            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <ExplorationLocationDisplay data={relayVar.value} />
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
                                const ValKey : Faction = await FactionFactory.CreateNewFaction(Requirement.value[k], null)
                                NewStringParts.push(makestringpresentable(ValKey.Name? ValKey.Name : ""))
                            }
                        }              

                        AddedCollection.push(NewStringParts.join(' '));
                    }
                }
            }

            const StringCollection : string[] = AddedCollection;

            return relayVar.concat(StringCollection);
        },
        async canChooseOptionLocation(this: EventRunner, eventSource : any, relayVar : boolean, trackVal: UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const Permissions = context_func as LocationRestriction
            if (Permissions.allowed) {
                for (let j = 0; j < Permissions.allowed.length; j++) {
                    const Requirement = Permissions.allowed[j]
                    if (Requirement.type == "faction") {
                        let Found = false;
                        for (let k = 0; k < Requirement.value.length; k++) {
                            const BaseFac = await trackVal.GetFactionBase();
                            if (BaseFac) {
                                if (BaseFac.ID == Requirement.value[k]) {
                                    Found = true;
                                }
                            }
                            if (trackVal.GetFaction()?.ID == Requirement.value[k]){
                                    Found = true;
                                }
                        }

                        if (Found == false) {
                            return false;
                        }
                    }
                }
            }

            return relayVar;
        }
    },
    skill_option: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { SkillFactory } = await import("../../factories/features/SkillFactory");
            const { Skill } = await import("../../classes/feature/ability/Skill");
            
            for (let i = 0; i < relayVar.length; i++) {
                const ModelItem = ((relayVar[i].value instanceof Skill)? relayVar[i].value :
                    await SkillFactory.CreateSkill(relayVar[i].value, null, true)
                )
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.Name? ModelItem.Name : "";
            }

            return relayVar
        },
        returnOptionDisplay(this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className={'BaseContextTable-skill'}>
                        <div className={'BaseContextTable-skill-head'}>
                            {(relayVar.value as Skill).GetTrueName() }
                        </div>

                        <div className={'BaseContextTable-skill-body'}>
                            <SkillDisplay data={relayVar.value}/>
                        </div>
                    </div>
                </ErrorBoundary>
        )
        }
    },
    modify_equipment_block: {
        event_priotity: 0,
        async overrideMercenarySkip(this: EventRunner, eventSource : any, relayVar : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return true;
        }
    },
    mercenary_add_equipment: {
        event_priotity: 0,
        async overrideMercenarySkip(this: EventRunner, eventSource : any, relayVar : boolean, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return false;
        }
    },
    override_stats : {
        event_priotity: 1,        
        async modifyEquipmentStats(this: EventRunner, eventSource : any, relayVar : EquipmentStats, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            if (context_func["stats"]) {                

                if (context_func["stats"].hands_melee != undefined) {relayVar.hands_melee = context_func["stats"].hands_melee}
                if (context_func["stats"].hands_ranged != undefined) {relayVar.hands_ranged = context_func["stats"].hands_ranged}
                if (context_func["stats"].melee != undefined) {relayVar.melee = context_func["stats"].melee}
                if (context_func["stats"].ranged != undefined) {relayVar.ranged = context_func["stats"].ranged}
            }
            
            return relayVar;
        }
    },
    get_warband_ducats: {
        event_priotity: 0,
        async getStartingDucats(this: EventRunner, eventSource : any, relayVar : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            if (context_func["mod"]) {
                return relayVar + context_func["mod"]
            }
            
            return relayVar;
        }
    },
    is_fireteam: {
        event_priotity: 0,
        async getFireteamOptionsFromWarband(this: EventRunner, eventSource : any, relayVar : WarbandMember[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband, staticself : StaticOptionContextObjectList) {

            const Models = sourceband.GetFighters();
            
            for (let i = 0; i < Models.length; i++) {
                let isValid = true;

                if (context_static.ContextKeys["added_context"]) {
                    const cntxt = context_static.ContextKeys["added_context"]
                    if (cntxt["exclusive"]) {
                        if (cntxt["exclusive"] == true) {
                            const Found = await sourceband.IsModelInOtherFireteam(Models[i].model)
                            if (Found) {
                                isValid = false;
                            }
                        }
                    }
                }

                if (staticself.MyStaticObject) {
                    const Found = sourceband.IsModelInThisFireteam(staticself.MyStaticObject, Models[i].model)
                    if (Found) {
                        isValid = false;
                    } else {
                        const NewFound = await sourceband.IsModelInExclusiveFireteam(Models[i].model)
                        if (NewFound) {
                            isValid = false;
                        }
                    }
                }

                if (isValid) {
                    relayVar.push(Models[i].model)
                }
            }

            return relayVar;
        }
    },
    is_model_fireteam: {
        event_priotity: 0,
        async getFireteamOptionsFromWarbandModel(this: EventRunner, eventSource : any, relayVar : WarbandMember[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : WarbandMember, staticself : StaticOptionContextObjectList) {

            const warband = sourceband.MyContext as UserWarband;
            if (warband == null) {
                return relayVar;
            }
            const Models = warband.GetFighters();
            
            for (let i = 0; i < Models.length; i++) {
                let isValid = true;

                if (Models[i].model == sourceband) {
                    isValid = false;
                }

                if (context_static.ContextKeys["added_context"]) {
                    const cntxt = context_static.ContextKeys["added_context"]
                    if (cntxt["exclusive"]) {
                        if (cntxt["exclusive"] == true) {
                            const Found = await warband.IsModelInOtherFireteam(Models[i].model)
                            if (Found) {
                                isValid = false;
                            }
                        }
                    }
                    if (cntxt["restriction"]) {
                        for (let j = 0; j < cntxt["restriction"].length; j++) {
                            if (cntxt["restriction"][j]["rest_type"] == "elite") {
                                if (cntxt["restriction"][j]["value"] != Models[i].model.IsElite()) {
                                    isValid = false;
                                }
                            }
                        }
                    }
                }
             
                if (isValid) {
                    if (staticself.MyStaticObject) {
                        const Found = warband.IsModelInThisFireteam(staticself.MyStaticObject, Models[i].model)
                        if (Found) {
                            isValid = false;
                        } else {
                            const NewFound = await warband.IsModelInExclusiveFireteam(Models[i].model)
                            if (NewFound) {
                                isValid = false;
                            }
                        }
                    }
                }

                if (isValid) {
                    relayVar.push(Models[i].model)
                }
            }

            return relayVar;
        },
        async getSingleFireteamMember(this: EventRunner, eventSource : any, relayVar : WarbandMember[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : WarbandMember, staticself : StaticOptionContextObjectList) {
            return [sourceband];
        }
    },
    change_model_equipment: {
        event_priotity: 0,
        async onGainUpgrade(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            await trackVal.BuildModelEquipProperties();
            await trackVal.BuildModelEquipment(true);
        },
        async onRemoveUpgrade(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            await trackVal.BuildModelEquipProperties();
            await trackVal.BuildModelEquipment(true);
        },
        async getModelEquipmentInfo(this: EventRunner, eventSource : any, relayVar : ModelEquipmentRelationship[], trackVal: WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (!trackVal.UpgradeAsIDs().includes(context_static.ID)) {
                return relayVar;
            }
            
            const modelequipfactorymodule = await import("../../factories/features/EquipmentFactory");
            const list : ModelEquipmentRelationship[] = []
            if (context_func["removed"]) {
                for (let i = 0; i < relayVar.length; i++) {
                    if (!context_func["removed"].includes(relayVar[i].ID)) {
                        list.push(relayVar[i])
                    }
                }
            }
            if(context_func["added"]) {
                for (let i = 0; i < context_func["added"].length; i++) {
                    if (!relayVar.includes(context_func["added"][i])) {
                        const newequip = await modelequipfactorymodule.EquipmentFactory.CreateNewModelEquipment(context_func["added"][i], trackVal, true);
                        list.push(newequip)
                    }
                }
            }
            return list;
        }
    },
    model_attatch: {
        event_priotity: 0,
        async getMemberOptionsFromWarbandModel(this: EventRunner, eventSource : any, relayVar : WarbandMember[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : WarbandMember, staticself : StaticOptionContextObjectList) {
            
            const warband = sourceband.MyContext as UserWarband;
            if (warband == null) {
                return relayVar;
            }
            const Models = warband.GetFighters();
            
            for (let i = 0; i < Models.length; i++) {
                let isValid = true;

                if (Models[i].model == sourceband) {
                    isValid = false;
                }
                
                if (context_func) {
                    const cntxt = context_func
                    if (cntxt["restriction"]) {
                        for (let j = 0; j < cntxt["restriction"].length; j++) {
                            if (cntxt["restriction"][j]["rest_type"] == "elite") {
                                if (cntxt["restriction"][j]["value"] != Models[i].model.IsElite()) {
                                    isValid = false;
                                }
                            }
                            if (cntxt["restriction"][j]["rest_type"] == "id") {
                                if (cntxt["restriction"][j]["value"] != (Models[i].model.ID == cntxt["restriction"][j]["subvalue"])) {
                                    isValid = false;
                                }
                            }
                            if (cntxt["restriction"][j]["rest_type"] == "stat") {
                                const stats = await Models[i].model.GetStats();
                                if (cntxt["restriction"][j]["value"] == "base" && stats.base) {
                                    if (cntxt["restriction"][j]["direction"] != (Math.max(...cntxt["restriction"][j]["subvalue"]) < (Math.max(...stats.base)))) {
                                        isValid = false; 
                                    }
                                }
                            }
                        }
                    }
                }

                if (isValid) {
                    relayVar.push(Models[i].model)
                }
            }

            return relayVar;
        },
        async getSingleFireteamMember(this: EventRunner, eventSource : any, relayVar : WarbandMember[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : WarbandMember, staticself : StaticOptionContextObjectList) {
            return [sourceband];
        }
    },
    add_fireteam_warband: {
        event_priotity: 0,        
        async getAllFireteamOptions(this: EventRunner, eventSource : any, relayVar : Fireteam[], trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const FireteamModule = await import("../../factories/features/FireteamFactory")

            if (context_func["type"] && context_func["count"]) {
                for (let i = 0; i < context_func["count"]; i++) {
                    const NewFireteam = await FireteamModule.FireteamFactory.CreateNewFireteam(context_func["type"], eventSource, context_func["type"] + "_" + context_static.GetID() + "_" + i, {"added_context" : context_func});
                    relayVar.push(NewFireteam);
                }
            }

            return relayVar;
        }
    },
    add_fireteam_model: {
        event_priotity: 0,        
        async getAllFireteamOptions(this: EventRunner, eventSource : any, relayVar : Fireteam[], trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const FireteamModule = await import("../../factories/features/FireteamFactory")

            if (context_func["type"] && context_func["count"]) {
                for (let i = 0; i < context_func["count"]; i++) {
                    const NewFireteam = await FireteamModule.FireteamFactory.CreateNewFireteam(context_func["type"], eventSource, context_func["type"] + "_" + context_static.GetID() + "_" + eventSource.GetID() + "_" + i, {"added_context" : context_func});
                    relayVar.push(NewFireteam);
                }
            }

            return relayVar;
        }
    },
    get_warband_glory: {
        event_priotity: 0,
        async getStartingGlory(this: EventRunner, eventSource : any, relayVar : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["mod"]) {
                return relayVar + context_func["mod"]
            }

            return relayVar;
        }
    },
    single_exploration_glory_item: {
        event_priotity: 0,
        async runConsumableSelect(this: EventRunner, eventSource : any, trackVal : WarbandConsumable, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : WarbandConsumable) {
            const ContWarband = await GetWarbandOrNull(sourceband);
            if (ContWarband == null) { return }

            await ContWarband.AddStash(trackVal.SelectItem as any);
        },
        async getConsumableOptionsList(this: EventRunner, eventSource : any, relayVar : IChoice[], trackVal : WarbandConsumable, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband) {

            if (sourceband) {
            const OptionList = await (sourceband).GetFactionEquipmentOptions(true);
                for (let i = 0; i < OptionList.length; i++) {
                    if (OptionList[i].CostType == 1 && OptionList[i].Cost < context_func["cost"]) {
                        relayVar.push(
                            {
                                display_str: OptionList[i].EquipmentItem.GetTrueName() + " " + OptionList[i].Cost + " Glory",
                                id: OptionList[i].ID,
                                value: OptionList[i]
                            }
                        )
                    }
                }
            }
            return relayVar;
        }
    },
    consumable: {
        event_priotity: 0,
        async onGainLocation(this: EventRunner, eventSource : any, trackVal : WarbandProperty, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            
            
            const {WarbandConsumable} = await import("../../classes/saveitems/Warband/WarbandConsumable");

            if (context_func["single_exploration_glory_item"]) {
                const Tags = context_static.Tags;
                Tags["consumable_type_equipment"] = true
                const NewData = {
                    id: context_static.GetID() + Date.now().toString(), 
                    name: context_static.GetTrueName(),
                    source: context_static.Source? context_static.Source : "",
                    tags: Tags,
                    contextdata: {"single_exploration_glory_item" : context_func["single_exploration_glory_item"]},
                    associate_id : context_static.GetID(),
                    object_id:  null,
                    object_type :  "faction_equipment"
                }
                const CreateNewConsumable = new WarbandConsumable(NewData, warband);
                await CreateNewConsumable.GrabOptions();
                trackVal.Consumables.push(CreateNewConsumable);
            }
        }
    },
    gain_new_model_from_list: {
        event_priotity: 0,
        async onGainLocation(this: EventRunner, eventSource : any, trackVal : WarbandProperty, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            
            
            const { ModelFactory } = await import("../../factories/features/ModelFactory");
            if (context_func["count"] && context_func["id"]) {
                for (let i = 0; i < context_func["count"]; i++) {
                    for (let j = 0; j < context_func["id"].length; j++) {
                        const NewModel = await ModelFactory.CreateNewFactionModel(context_func["id"][j], null);
                        await warband.AddFighter([NewModel]);
                    }
                }
            }
        }
    },
    exploration_option: {
        event_priotity: 0,
        async returnWbbOptionDisplay(this: EventRunner, eventSource : any, trackVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
    
            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                    <p className={''}>
                        {returnDescription(trackVar.value, trackVar.value.Description)}
                    </p>
                </ErrorBoundary>
            )
        },
    },
    ability_option: {
        event_priotity: 0,
        async parseOptionsIntoRelevantType(this: EventRunner, eventSource : any, relayVar : IChoice[],  trackVal : number, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            const { AbilityFactory } = await import("../../factories/features/AbilityFactory");
            
            const { Ability } = await import("../../classes/feature/ability/Ability");

            for (let i = 0; i < relayVar.length; i++) {
                
                const ModelItem = ((relayVar[i].value instanceof Ability)? relayVar[i].value :
                    await AbilityFactory.CreateAbility(relayVar[i].value, null)
                )
                relayVar[i].value = ModelItem;
                relayVar[i].display_str = ModelItem.Name? ModelItem.Name : "";
            }

            return relayVar
        },
        returnOptionDisplay(this: EventRunner, eventSource : any, relayVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            
            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    <div className="ability-selected-option">
                        <div className="">
                            <RulesModelDisplayAbility data={relayVar.value} ID={relayVar.id} />
                        </div>
                    </div>
                </ErrorBoundary>
            )
        },
        async returnWbbOptionDisplay(this: EventRunner, eventSource : any, trackVar : IChoice, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null){
            const AbilityModule = await import("../../classes/feature/ability/Ability")
           
            if (!(trackVar instanceof AbilityModule.Ability)) {
                return (<></>);
            }   
            return ( 
            
                <ErrorBoundary fallback={<div>Something went wrong with DisplayPageStatic.tsx</div>}>
                    
                    <p className={''}>
                        {returnDescription(trackVar.value, trackVar.value.Description)}
                    </p>
                </ErrorBoundary>
            )
        },
        async getWarbandMemberAbilities(this: EventRunner, eventSource : any, relayVar : Ability[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            const AbilityModule = await import("../../classes/feature/ability/Ability");
            const DynamicModule = await import("../../classes/options/DynamicOptionContextObject");
            try {
                if (context_main != null) {
                    if (context_main instanceof DynamicModule.DynamicOptionContextObject) {
                        const optionobj = context_main;
                        for (let i = 0; i < optionobj.Selections.length; i++) {
                            const selection = optionobj.Selections[i];
                            if (selection.SelectedChoice != null) {
                                if (selection.SelectedChoice.value instanceof AbilityModule.Ability) {
                                    let ispresent = false;
                                    for (let j = 0; j < relayVar.length; j++) {
                                        if (relayVar[j].ID == selection.SelectedChoice.value.ID) {
                                            ispresent = true;
                                        }
                                    }
                                    if (ispresent == false) {
                                        relayVar.push(selection.SelectedChoice.value)
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
            return relayVar;
        }
    },
    VariantFactionBase: {
        event_priotity: 0,
        async countAsFactionForPatrons(this: EventRunner, eventSource : any, relayVar : string, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func['faction_base_id']) {
                return context_func['faction_base_id']
            }
            return relayVar;
        }
    
    },
    add_to_warband: {
        event_priotity: 0,
        async getWarbandLevelFactionRules(this: EventRunner, eventSource : any, relayVar : WarbandProperty[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            const { WarbandProperty } = await import("../../classes/saveitems/Warband/WarbandProperty");

            if (context_main instanceof WarbandProperty) {
                relayVar.push(context_main as WarbandProperty)
            }
            return relayVar;
        }
    },
    purchase_modifier_equipment: {
        event_priotity: 0,        
        async onRemoveSkill(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband, id : string) {
            const alllist = warband.GetEntireWarbandEquipment()
            const appliedMods = new Map<WarbandEquipment, Set<number>>();

            for (let o = 0; o < alllist.length; o++) {
                const CurEq = alllist[o].purchase
                const CurEqItem = CurEq.HeldObject as WarbandEquipment

                if (CurEq.Sellable == false) {
                    continue;
                }

                if (context_func["mod"]) {
                    for (let k = 0; k < context_func["mod"].length; k++) {
                        let CanAdd = false
                        let AllCriteria = true

                        if (context_func["mod"][k]["requirements"]) {
                            for (let i = 0; i < context_func["mod"][k]["requirements"].length; i++) {
                                const Cur = context_func["mod"][k]["requirements"][i]

                                if (Cur["category"]) {
                                    if (Cur["category"] != CurEqItem.GetEquipmentItem().Category) {
                                        AllCriteria = false;
                                    }
                                }
                                if (Cur["cost"]) {
                                    if (Cur['req_mod'] == ">=") {
                                        if ( Number(CurEq.ItemCost - context_func["mod"][k]["cost"]) < Number(Cur["cost"]) || Number(Cur["costtype"]) != Number(CurEq.CostType)) {
                                            AllCriteria = false;
                                        }
                                    }
                                }
                            }

                        }
                        if (AllCriteria) {
                            CanAdd = true;
                        }
                        if (CanAdd) {
                            if (!appliedMods.has(CurEqItem)) {
                                appliedMods.set(CurEqItem, new Set());
                            }
                            const modsForItem = appliedMods.get(CurEqItem)!;
                            if (!modsForItem.has(k)) {
                                CurEq.ItemCost -= context_func["mod"][k]["cost"];
                                modsForItem.add(k);
                            }
                        }
                    }
                }
            }
        },
        async onGainSkill(this: EventRunner, eventSource : any, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband) {
            const alllist = warband.GetEntireWarbandEquipment()
            const appliedMods = new Map<WarbandEquipment, Set<number>>();

            for (let o = 0; o < alllist.length; o++) {
                const CurEq = alllist[o].purchase
                const CurEqItem = CurEq.HeldObject as WarbandEquipment

                if (CurEq.Sellable == false) {
                    continue;
                }

                if (context_func["mod"]) {
                    for (let k = 0; k < context_func["mod"].length; k++) {
                        let CanAdd = false
                        let AllCriteria = true

                        if (context_func["mod"][k]["requirements"]) {
                            for (let i = 0; i < context_func["mod"][k]["requirements"].length; i++) {
                                const Cur = context_func["mod"][k]["requirements"][i]

                                if (Cur["category"]) {
                                    if (Cur["category"] != CurEqItem.GetEquipmentItem().Category) {
                                        AllCriteria = false;
                                    }
                                }
                                if (Cur["cost"]) {
                                    if (Cur['req_mod'] == ">=") {
                                        if ( Number(CurEq.ItemCost - context_func["mod"][k]["cost"]) < Number(Cur["cost"]) || Number(Cur["costtype"]) != Number(CurEq.CostType)) {
                                            AllCriteria = false;
                                        }
                                    }
                                }
                            }

                        }
                        if (AllCriteria) {
                            CanAdd = true;
                        }
                        if (CanAdd) {
                            if (!appliedMods.has(CurEqItem)) {
                                appliedMods.set(CurEqItem, new Set());
                            }
                            const modsForItem = appliedMods.get(CurEqItem)!;
                            if (!modsForItem.has(k)) {
                                CurEq.ItemCost += context_func["mod"][k]["cost"];
                                modsForItem.add(k);
                            }
                        }
                    }
                }
            }
        },
        async getCostOfEquipment(this: EventRunner, eventSource : any, relayVar: number, trackVal: UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, coreitem : FactionEquipmentRelationship) {
            
            let HoldVar = relayVar;
            if (context_func["mod"]) {
                for (let k = 0; k < context_func["mod"].length; k++) {
                    let CanAdd = false
                    let AllCriteria = true

                    if (context_func["mod"][k]["requirements"]) {
                        for (let i = 0; i < context_func["mod"][k]["requirements"].length; i++) {
                            const Cur = context_func["mod"][k]["requirements"][i]

                            if (Cur["category"]) {
                                if (Cur["category"] != coreitem.EquipmentItem.Category) {
                                    AllCriteria = false;
                                }
                            }
                            if (Cur["cost"]) {
                                if (Cur['req_mod'] == ">=") {
                                    if ( Number(coreitem.Cost) < Number(Cur["cost"]) || Number(Cur["costtype"]) != Number(coreitem.CostType)) {
                                        AllCriteria = false;
                                    }
                                }
                            }
                        }

                    }
                    if (AllCriteria) {
                        CanAdd = true;
                    }
                    if (CanAdd) {
                        HoldVar += context_func["mod"][k]["cost"]
                    }
                }
            }
            return HoldVar;
        }
    },
    add_extra_equipment: {
        event_priotity: 0,
        async getEquipmentLimitTrue(this: EventRunner, eventSource : any, relayVar: number, trackVal : UserWarband, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, ref_equip : FactionEquipmentRelationship) {
            const ContextObj = (context_main as DynamicOptionContextObject)

            for (let i = 0; i < ContextObj.Selections.length; i++) {
                if (ContextObj.Selections[i].SelectedChoice != null) {
                    if (ContextObj.Selections[i].SelectedChoice?.id == ref_equip.ID) {
                        relayVar += context_func["count"]
                    }
                }
            }
            return relayVar;
        }
    },
    add_extra_model: {
        event_priotity: 0,
        async onGainEquipment(this: EventRunner, eventSource : any, trackVal : WarbandPurchase, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, warband : UserWarband, equipmentHolder : any) {
            const FacModModule = await import("../../factories/features/ModelFactory")
            if (context_func["model_purchases"]) {
                for (let i = 0; i < context_func["model_purchases"].length; i++) {
                    const ModelName = context_func["model_purchases"][i]
                    const ModelFaction = await FacModModule.ModelFactory.CreateNewFactionModel(ModelName, null)
                    await warband.AddFighter([ModelFaction]);
                }
                trackVal.CountCap = false;
            }
        }
    },
    add_upgrade: {
        event_priotity: 0,
        async getWarbandMemberUpgrades(this: EventRunner, eventSource : any, relayVar : ModelUpgradeRelationship[], trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {

            const UpgradeFactoryModule = await import("../../factories/features/UpgradeFactory")
            
            const ContextObj = (context_main as DynamicOptionContextObject)

            for (let i = 0; i < ContextObj.Selections.length; i++) {
                const contextual_use = ContextObj.Selections[i].SelectedChoice
                if (contextual_use != null) {
                    
                    const UpgradeList = Requester.MakeRequest(
                        {
                            searchtype: "complex", 
                            searchparam: {
                                type: "modelupgraderelationship",
                                request: {
                                    operator: 'and',
                                    terms: [
                                        {
                                            item: "upgrade_id",
                                            value: contextual_use.id,
                                            equals: true,
                                            strict: true
                                        }
                                    ],
                                    subparams: []
                                }
                            }
                        }
                    ) as IModelUpgradeRelationship[]

                    if (UpgradeList.length > 0) {
                        const UpgradeModel = await UpgradeFactoryModule.UpgradeFactory.CreateModelUpgrade(UpgradeList[0], null)
                        relayVar.push(UpgradeModel)
                    } else {
                        const MUR = {
                            id: "rel_md_up"+contextual_use.id+"_contextualadd_"+Date.now().toString(),
                            source: "core",
                            tags: {},
                            name: "",
                            contextdata: {},
                            options: [],
                            model_id_set: [],
                            upgrade_id: contextual_use.id,
                            cost: 15,
                            cost_type: 0,
                            restricted_upgrades: [
                            ],
                            warband_limit: 0,
                            required_upgrades:[]
                        }
                        const UpgradeModel = await UpgradeFactoryModule.UpgradeFactory.CreateModelUpgrade(MUR, null)
                        relayVar.push(UpgradeModel)
                    }
                }
            }

            return relayVar;
        }
    },
    warband_general_hook: {
        event_priotity: 0,       
        async getEquipmentRelationshipsForWarband(this: EventRunner, eventSource : any, relayVar : FactionEquipmentRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband, staticself : StaticOptionContextObjectList) {
            const FacCheck = sourceband.Faction.MyFaction;
            let BaseRels : FactionEquipmentRelationship[] = []
            
            if (FacCheck != undefined) {
                BaseRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).EquipmentItems
            }

            const eventmon : EventRunner = new EventRunner();
            BaseRels = await eventmon.runEvent(
                "getAllFactionEquipmentRelationships",
                sourceband,
                [],
                BaseRels,
                null
            )
            return BaseRels.filter((item) => item.Limit != 0);
            
        },       
        async getAllUpgradesOfType(this: EventRunner, eventSource : any, relayVar : Upgrade[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband, staticself : StaticOptionContextObjectList) {
            const UpgradeFactoryModule = await import("../../factories/features/UpgradeFactory")
            
            for (let i = 0; i < staticself.OptionContext.requirements.length; i++) {
                const UpgradeList = Requester.MakeRequest(
                    {
                        searchtype: "complex", 
                        searchparam: {
                            type: "upgrade",
                            request: {
                                operator: 'and',
                                terms: [
                                    {
                                        item: "tags",
                                        value: staticself.OptionContext.requirements[i].value,
                                        equals: true,
                                        strict: true,
                                        istag : true,
                                        tagvalue: staticself.OptionContext.requirements[i].subvalue
                                    }
                                ],
                                subparams: []
                            }
                        }
                    }
                ) as IUpgrade[]
                for (let j = 0; j < UpgradeList.length; j++) {
                    const Upgrade = await UpgradeFactoryModule.UpgradeFactory.CreateUpgrade(UpgradeList[j], null)
                    relayVar.push(Upgrade)
                }
            }
            return relayVar
            
        },
        async getModelRelationshipsForWarband(this: EventRunner, eventSource : any, relayVar : FactionModelRelationship[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, sourceband : UserWarband, staticself : StaticOptionContextObjectList) {
            const FacCheck = sourceband.Faction.MyFaction;
            let BaseRels : FactionModelRelationship[] = []
            const FinRels : FactionModelRelationship[] = []
            
            if (FacCheck != undefined) {
                BaseRels = ((FacCheck.SelfDynamicProperty).OptionChoice as Faction).Models
            }
            
            const eventmon : EventRunner = new EventRunner();
            BaseRels = await eventmon.runEvent(
                "getAllFactionModelRelationships",
                sourceband,
                [],
                BaseRels,
                null
            )
            BaseRels = BaseRels.filter((item) => item.Mercenary == false && item.Maximum != 0);
            const Cur = staticself.OptionContext["filter"]

            for (let i = 0; i < BaseRels.length; i++) {
                let IsValid = true;
                for (let j = 0; j < Cur["restriction"].length; j++) {
                    const fil = Cur["restriction"][j]

                    if (fil["res_type"] == "keyword") {
                        IsValid = (fil["subvalue"] == (BaseRels[i].Model.getKeywordIDs().includes(fil["val"])))
                    }

                }
                if (IsValid) {
                    FinRels.push(BaseRels[i])
                }
            }

            return FinRels
        }
    },
    upgrade_stat: {
        event_priotity: 1,
        async updateModelStats(this: EventRunner, eventSource : any, relayVar : ModelStatistics,   context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            for (let i = 0; i < context_func["upgrades"].length; i++) {
                const contextitem = context_func["upgrades"][i];

                if (contextitem["stat"] == 'armour') {
                    if (relayVar.armour) {
                        relayVar.armour += contextitem["value"]
                    } else {
                        relayVar.armour = contextitem["value"]
                    }
                }

                if (contextitem["stat"] == 'movement') {
                    if (relayVar.movement) {
                        relayVar.movement += contextitem["value"]
                    } else {
                        relayVar.movement = contextitem["value"]
                    }
                }

                if (contextitem["stat"] == 'melee') {
                    if (relayVar.melee) {
                        relayVar.melee += contextitem["value"]
                    } else {
                        relayVar.melee = contextitem["value"]
                    }
                }

                if (contextitem["stat"] == 'ranged') {
                    if (relayVar.ranged) {
                        relayVar.ranged += contextitem["value"]
                    } else {
                        relayVar.ranged = contextitem["value"]
                    }
                }
            }            
            return relayVar;
        }
    },
    keyword_add: {
        event_priotity: 0,
        async getContextuallyRelevantKeywordsByID(this: EventRunner, eventSource : any, relayVar : string[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func['value']) {
                for (let i = 0; i < context_func['value'].length; i++) {
                    if (!relayVar.includes(context_func['value'][i])) {
                        relayVar.push(context_func['value'][i])
                    }
                }
            }            
            return relayVar;
        }
    },
    
    keyword_mod: {
        event_priotity: 1,
        async getContextuallyRelevantKeywordsByID(this: EventRunner, eventSource : any, relayVar : string[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func['mods']) {
                for (let i = 0; i < context_func['mods'].length; i++) {
                    const rel_mod = context_func['mods'][i]

                    if (rel_mod['type'] == 'add') {
                        if (!relayVar.includes(rel_mod['value'])) {
                            relayVar.push(rel_mod['value'])
                        }
                    }
                    if (rel_mod['type'] == 'remove') {
                        relayVar = relayVar.filter(item => (item != rel_mod['value']))
                    }
                    
                }
            }            
            return relayVar;
        }
    },
    equipment_modifier: {
        event_priotity: 0,
        
        async getnewrange(this: EventRunner, eventSource : any, relayVar: number,  context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, coreitem : WarbandEquipment) {

            let DoCare = false;
            if (context_func["equipment_type"]) {
                for (let i = 0; i < context_func["equipment_type"].length; i++) {
                    const Cur = context_func["equipment_type"][i]

                    if (Cur["res_type"] == "tag") {
                        if (containsTag(coreitem.MyEquipment.SelfDynamicProperty.OptionChoice.Tags, Cur["value"])) {
                            DoCare = true;
                        }
                    }
                }
            }

            if (DoCare) {
                if (context_func["modifier_type"]) {
                    for (let i = 0; i < context_func["modifier_type"].length; i++) {
                        const Cur = context_func["modifier_type"][i]

                        if (Cur["type"] == "range") {
                            relayVar += Cur["value"]
                        }
                    }
                }

            }
            
            return relayVar;
        }
    },
    get_elite_count_cap: {
        event_priotity: 0,
        async getNumberOfElite(this: EventRunner, eventSource : any, relayVar: number, trackVal: UserWarband,  context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func["modify_value"]) {
                return relayVar + context_func["modify_value"]
            }
            return relayVar;
        }
    },
    add_onto_warband: {
        event_priotity: 0,
        async showSkillOnWarband(this: EventRunner, eventSource : any, relayVar : boolean, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            return true;
        },
        async showEquipmentOnWarband(this: EventRunner, eventSource : any, relayVar : boolean, trackVal : WarbandMember, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            return true;
        }
    },
    keyword_mod_remove: {
        event_priotity: 2,
        async getContextuallyRelevantKeywordsByID(this: EventRunner, eventSource : any, relayVar : string[], trackVal : Model, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            if (context_func['mods']) {
                for (let i = 0; i < context_func['mods'].length; i++) {
                    const rel_mod = context_func['mods'][i]
                    
                    if (rel_mod['type'] == 'remove') {
                        relayVar = relayVar.filter(item => !(item != rel_mod['value']))
                    }
                    
                }
            }            
            return relayVar;
        }
    },
    set_stat: {
        event_priotity: 1,
        async updateModelStats(this: EventRunner, eventSource : any, relayVar : ModelStatistics,   context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            
            for (let i = 0; i < context_func["upgrades"].length; i++) {
                const contextitem = context_func["upgrades"][i];

                if (contextitem["stat"] == 'armour') {                    
                    relayVar.armour = contextitem["value"]
                }

                if (contextitem["stat"] == 'movement') {                    
                    relayVar.movement = contextitem["value"]
                }

                if (contextitem["stat"] == 'melee') {                    
                    relayVar.melee = contextitem["value"]
                }

                if (contextitem["stat"] == 'ranged') {                    
                    relayVar.ranged = contextitem["value"]
                }

                if (contextitem["stat"] == 'base') {  
                    if (relayVar.base) {
                        if (Math.max(...relayVar.base) < Math.max(contextitem["value"])) { 
                            relayVar.base = contextitem["value"]
                        }
                    } else {
                        relayVar.base = contextitem["value"]
                    }
                }

                if (contextitem["stat"] == 'movetype') {                    
                    relayVar.movetype = contextitem["value"]
                }

                if (contextitem["stat"] == 'potential') {                    
                    relayVar.potential = contextitem["value"]
                }

                if (contextitem["stat"] == 'mercenary') {                    
                    relayVar.mercenary = contextitem["value"]
                }
            }         
            return relayVar;
        }
    },
    demote: {
        event_priotity: 0,
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            member.Elite = false;
        }
    },
    kill_character: {
        event_priotity: 0,
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            
            const MaxScars = await member.GetMaxScars()
            member.SetScars(MaxScars)
        }
    },
    capture_character: {
        event_priotity: 0,
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            member.State = 'lost'
        }
    },
    strip_equipment: {
        event_priotity: 0,
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            await member.EmptyStash();
        }
    },
    ignore_scar: {
        event_priotity: 0,
        
        async careAboutInjury(this: EventRunner, eventSource : any, relayVar: boolean, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            if (context_func["requirements"]) {
                for (let i = 0; i < context_func["requirements"].length; i++) {
                    const CurReq = context_func["requirements"][i];

                    if (CurReq["type"] == "id") {
                        if (member.CurModel.ID == CurReq["value"]) {
                            return false;
                        }
                    }
                }
            }
            return relayVar;
        },
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            if (context_func["requirements"]) {
                let IgnoreScar = false
                for (let i = 0; i < context_func["requirements"].length; i++) {
                    const CurReq = context_func["requirements"][i];

                    if (CurReq["type"] == "id") {
                        if (member.CurModel.ID == CurReq["value"]) {
                            IgnoreScar = true;
                        }
                    }
                }

                if (IgnoreScar) {                    
                    member.ScarReserve -= 1
                }
            } else {     
                member.ScarReserve -= 1
            }
        }
    },
    auto_retire: {
        event_priotity: 1,
        async onGainInjury(this: EventRunner, eventSource : any, trackVal : Injury, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null, member : WarbandMember) {
            
            if (member.GetInjuriesList().filter((item) => item.ID == context_func["id"]).length >= context_func["count"]) {
                
                const eventmon : EventRunner = new EventRunner();
                const Value = await eventmon.runEvent(
                    "careAboutInjury",
                    eventSource,
                    [member],
                    true,
                    trackVal
                )

                if (Value) {
                    member.State = 'lost'
                }
            }
        }
    }
}