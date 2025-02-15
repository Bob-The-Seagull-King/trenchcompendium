import { DynamicContextObject } from "../../classes/contextevent/dynamiccontextobject";
import { CallEventTable, ContextEventEntry } from "./contexteventtypes";
import { EventRunner } from "../../classes/contextevent/contexteventhandler";
import { ContextObject } from "../../classes/contextevent/contextobject";
import { QuestionBase, StaticOptionContextObjectQuestion } from "../../classes/options/StaticOption";
import { containsTag } from "../../utility/functions";
import { getTagValue } from "../../utility/functions";
import { EquipmentLimit, EquipmentRestriction } from "../../classes/feature/equipment/Equipment";

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
        getEquipmentRestrictionPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentRestriction[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) 
        {
            return relayVar;
        },
        getEquipmentRestriction(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) { 
            relayVar.push(context_func as EquipmentRestriction)
            return relayVar;
        }
    },
    model_equipment_limit : {
        event_priotity: 1,
        getEquipmentLimitPresentable(this: EventRunner, eventSource : any, relayVar : any, trackVal : EquipmentLimit[], context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            return relayVar;
        },
        getEquipmentLimit(this: EventRunner, eventSource : any, relayVar : any, context_func : ContextEventEntry, context_static : ContextObject, context_main : DynamicContextObject | null) {
            relayVar.push(context_func as EquipmentLimit)
            return relayVar;
        }
    }
}