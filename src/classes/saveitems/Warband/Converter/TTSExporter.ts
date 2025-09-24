import { getModelStatArmour, getModelStatMelee, getModelStatMove, getModelStatRanged, ModelStatistics } from "../../../feature/model/ModelStats";
import { WarbandMember } from "../Purchases/WarbandMember";
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from "../Purchases/WarbandPurchase";
import { UserWarband } from "../UserWarband"
import { SumWarband } from "../WarbandManager"
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { WarbandProperty } from "../WarbandProperty";
import { Keyword } from "../../../feature/glossary/Keyword";
import { Equipment } from '../../../feature/equipment/Equipment'
import { PrintOutDesc } from "../../../AdvancedDescription";
import { Ability } from "../../../feature/ability/Ability";
import { Upgrade } from "../../../feature/ability/Upgrade";
import { Skill } from "../../../feature/ability/Skill";
import { Injury } from "../../../feature/ability/Injury";

export async function ConvertToTTSExport(wb_val : SumWarband) : Promise<TTSExport> {
    const Wb : UserWarband = wb_val.warband_data;
    const ID : number = wb_val.id;

    const ModelList : TTSModel[] = []

    const Fighters : RealWarbandPurchaseModel[] = Wb.GetUsableFighters();
    for (let i = 0; i < Fighters.length; i++) {
        const Mdl : TTSModel = await ConvertModelToTTS(Fighters[i])
        ModelList.push(Mdl);
    }

    return {
        "warband-id": ID,
        "warband-url" : "https://trench-companion.com/warband/detail/" + ID.toString(),
        "warband-name" : Wb.GetTrueName(),
        "ducat-bank" : Wb.Context.Ratings.spare_ducat,
        "glory-bank" : Wb.Context.Ratings.spare_glory,
        "ducat-rating" : Wb.Context.Ratings.rating_ducat,
        "glory-rating" : Wb.Context.Ratings.rating_glory,
        models : ModelList
    }
}

async function ConvertModelToTTS(wb_model : RealWarbandPurchaseModel) : Promise<TTSModel> {
    const M_Purch : WarbandPurchase = wb_model.purchase;
    const M_Model : WarbandMember = wb_model.model
    
    const Stats : ModelStatistics = await M_Model.GetStats()

    const EquipList : RealWarbandPurchaseEquipment[] = await M_Model.GetAllEquipForShow();
    const EquipTTSList : TTSEquipment[] = []
    for (let i = 0 ; i < EquipList.length; i++) {
        let typeval : 'melee weapon' | 'ranged weapon' | 'armour' | 'equipment' = "equipment"
        
        if (EquipList[i].equipment.GetEquipmentItem().Category == "melee") {typeval = "melee weapon"}
        if (EquipList[i].equipment.GetEquipmentItem().Category == "ranged") {typeval = "ranged weapon"}
        if (EquipList[i].equipment.GetEquipmentItem().Category == "armour") {typeval = "armour"}
        
        EquipTTSList.push(
            {
                "equipment-name" : EquipList[i].equipment.GetEquipmentItem().GetTrueName(),
                "equipment-id" : EquipList[i].equipment.GetEquipmentItem().ID,
                "equipment-type" : typeval
            }
        )
    }

    const AbilityList : WarbandProperty[] = M_Model.SubProperties;
    const AbilityTTSList : TTSAbilities[] = []
    for (let i = 0 ; i < AbilityList.length; i++) {
        AbilityTTSList.push(
            {
                "ability-name" : AbilityList[i].SelfDynamicProperty.OptionChoice.GetTrueName(),
                "ability-id" : AbilityList[i].SelfDynamicProperty.OptionChoice.ID
            }
        )
    }

    const UpgradeList : WarbandPurchase[] = M_Model.Upgrades;
    const UpgradeTTSList : TTSUpgrades[] = []
    for (let i = 0 ; i < UpgradeList.length; i++) {
        UpgradeTTSList.push(
            {
                "upgrade-name" : (UpgradeList[i].HeldObject as WarbandProperty).SelfDynamicProperty.OptionChoice.GetTrueName(),
                "upgrade-id" : (UpgradeList[i].HeldObject as WarbandProperty).SelfDynamicProperty.OptionChoice.ID
            }
        )
    }

    const AdvancementList : WarbandProperty[] = M_Model.Skills;
    const AdvancementTTSList : TTSAdvancements[] = []
    for (let i = 0 ; i < AdvancementList.length; i++) {
        AdvancementTTSList.push(
            {
                "advancement-name" : AdvancementList[i].SelfDynamicProperty.OptionChoice.GetTrueName(),
                "advancement-id" : AdvancementList[i].SelfDynamicProperty.OptionChoice.ID
            }
        )
    }

    const InjuriesList : WarbandProperty[] = M_Model.Injuries;
    const InjuriesTTSList : TTSInjuries[] = []
    for (let i = 0 ; i < InjuriesList.length; i++) {
        InjuriesTTSList.push(
            {
                "injury-name" : InjuriesList[i].SelfDynamicProperty.OptionChoice.GetTrueName(),
                "injury-id" : InjuriesList[i].SelfDynamicProperty.OptionChoice.ID
            }
        )
    }

    const KeywordList : Keyword[] = await M_Model.GetKeywordsFull();
    const KeywordTTSList : TTSKeywords[] = []
    for (let i = 0 ; i < KeywordList.length; i++) {
        KeywordTTSList.push(
            {
                "keyword-name" : KeywordList[i].GetTrueName(),
                "keyword-id" : KeywordList[i].ID
            }
        )
    }

    return {
        "model-name": M_Model.CurModel.GetTrueName(),
        "model-id" : M_Model.CurModel.ID,
        name : M_Model.GetTrueName(),
        "stat-move": getModelStatMove(Stats),
        "stat-melee" : getModelStatMelee(Stats),
        "stat-ranged" : getModelStatRanged(Stats),
        "stat-armour" : getModelStatArmour(Stats),
        cost : {
            ducats: M_Purch.GetTotalDucats(),
            glory: M_Purch.GetTotalGlory()
        },
        equipment : EquipTTSList,
        abilities : AbilityTTSList,
        upgrades : UpgradeTTSList,
        advancements : AdvancementTTSList,
        injuries : InjuriesTTSList,
        keywords : KeywordTTSList
    }
}

export interface TTSExport {
    "warband-id": number,
    "warband-url" : string,
    "warband-name" : string,
    "ducat-bank" : number,
    "glory-bank" : number,
    "ducat-rating" : number,
    "glory-rating" : number,
    models : TTSModel[]
}

interface TTSModel {
    "model-name": string,
    "model-id" : string,
    name : string,
    "stat-move": string,
    "stat-melee" : string,
    "stat-ranged" : string,
    "stat-armour" : string
    cost : TTSCost,
    equipment : TTSEquipment[],
    abilities : TTSAbilities[],
    upgrades : TTSUpgrades[],
    advancements : TTSAdvancements[],
    injuries : TTSInjuries[],
    keywords : TTSKeywords[]
}

interface TTSEquipment {
    "equipment-name" : string,
    "equipment-id" : string,
    "equipment-type" : 'melee weapon' | 'ranged weapon' | 'armour' | 'equipment'
}

interface TTSAbilities {
    "ability-name" : string,
    "ability-id" : string
}

interface TTSAdvancements {
    "advancement-name" : string,
    "advancement-id" : string
}

interface TTSInjuries {
    "injury-name" : string,
    "injury-id" : string
}

interface TTSUpgrades {
    "upgrade-name" : string,
    "upgrade-id" : string
}

interface TTSKeywords {
    "keyword-name" : string,
    "keyword-id" : string
}

interface TTSCost {
    ducats : number,
    glory : number
}

/**
 * Formats TTS Text bold
 * @param text
 */
function TTSBold ( text : string ) {
    return '[b]' + text + '[/b]';
}

/**
 * Format TTS Text colored
 * @param text
 */
function TTScMove ( text : string) {
    const color = '#89E1E3';
    return '[89E1E3]' + text + '[-]';
}
function TTScRanged ( text : string) {
    const color = '#C966E5';
    return '[C966E5]' + text + '[-]';
}
function TTScMelee ( text : string) {
    const color = '#fa8231';
    return '[fa8231]' + text + '[-]';
}
function TTScArmour ( text : string) {
    const color = '#b2b7be';
    return '[b2b7be]' + text + '[-]';
}
function TTScUpgrade ( text : string) {
    const color = '#618DF4';
    return '[618DF4]' + text + '[-]';
}
function TTScAbility ( text : string) {
    const color = '#0fb9b1';
    return '[0fb9b1]' + text + '[-]';
}
function TTScEquipment ( text : string) {
    const color = '#f7b731';
    return '[f7b731]' + text + '[-]';
}
function TTScSkill ( text : string) {
    const color = '#20bf6b';
    return '[20bf6b]' + text + '[-]';
}
function TTScInjury ( text : string) {
    const color = '#eb3b5a';
    return '[eb3b5a]' + text + '[-]';
}


export async function ConvertModelToTTSText(wb_model : RealWarbandPurchaseModel, type: "short" | "medium" | "full") : Promise<string> {

    const ex: string[] = []; // export string

    // collection of unicode chars
    // verified:
    // ⊕ ✝ ✦ ✧ ✪ ☠ ✜ ✢ ✠ ✹ ✞ ☩

    const i_name    = '☩';
    const i_ranged  = '⊕';
    const i_melee   = '✢';
    const i_arm     = '❖';
    const i_equip   = '✜';
    const i_ability = '✧';
    const i_up      = '✹';
    const i_skill   = '△';
    const i_injury  = '▽';


    const M_Purch : WarbandPurchase = wb_model.purchase;
    const M_Model : WarbandMember = wb_model.model

    if (!M_Model || !M_Purch) {
        return "Data not loaded yet";
    }

    const Stats : ModelStatistics = await M_Model.GetStats(); // Get Model Stats

    // construct stats strings
    const stats_strings = [
        TTSBold(TTScMove(getModelStatMove(Stats))),
        TTSBold(TTScMelee('Mel. ' + getModelStatMelee(Stats) + 'D')),
        TTSBold(TTScRanged('Ran. ' + getModelStatRanged(Stats) + 'D')),
        TTSBold(TTScArmour('Arm. ' + getModelStatArmour(Stats)))
    ]

    /** Main fighter info */
    ex.push(TTSBold(i_name+i_name+' ' + M_Model.GetFighterName() + ' '+i_name+i_name)); // name
    ex.push((M_Model.GetModelName() != undefined)? '('+ M_Model.GetModelName() + ')' : "Unknown" ); // type

    ex.push(stats_strings.join(' | ')); // Fighter stats

    // Fighter Keywords
    const KeywordList: Keyword[] = await M_Model.GetKeywordsFull();
    const Keywords: string[] = KeywordList.map(kw => kw.Name ?? "");
    ex.push(Keywords.join(', '));

    ex.push(''); // separator


    /** Fighter Equipment */
    const EquipList : RealWarbandPurchaseEquipment[] = await M_Model.GetAllEquipForShow();

    // Set category order
    const categoryOrder: Record<string, number> = {
        melee: 1,
        ranged: 2,
        armour: 3,
        equipment: 4,
    };

    // Sort equip by category
    EquipList.sort((a, b) => {
        const aCat = a.equipment.GetEquipmentItem().Category;
        const bCat = b.equipment.GetEquipmentItem().Category;

        const aRank = categoryOrder[aCat] ?? 99;
        const bRank = categoryOrder[bCat] ?? 99;

        return aRank - bRank;
    });


    for (const eq of EquipList) {
        const abilityObject = (eq.equipment.MyEquipment.SelfDynamicProperty?.OptionChoice as Equipment | undefined);


        let eq_name = '';

        // Equipment icon
        if( eq.equipment.GetEquipmentItem().Category == 'ranged' ) {
            eq_name += TTScRanged(i_ranged+' ' + eq.equipment.GetEquipmentItem().GetTrueName());
        }
        if (eq.equipment.GetEquipmentItem().Category == 'melee') {
            eq_name += TTScMelee(i_melee+' ' + eq.equipment.GetEquipmentItem().GetTrueName());
        }
        if (eq.equipment.GetEquipmentItem().Category == 'armour') {
            eq_name += TTScArmour(i_arm+' ' + eq.equipment.GetEquipmentItem().GetTrueName());
        }
        if (eq.equipment.GetEquipmentItem().Category == 'equipment') {
            eq_name += TTScEquipment(i_equip+' ' + eq.equipment.GetEquipmentItem().GetTrueName());
        }

        eq_name = TTSBold(eq_name);

        ex.push(eq_name);

        // Equipment range - for ranged and melee only
        let range_string = '';
        if( type === 'medium' || type === 'full') {
            if( eq.equipment.GetEquipmentItem().Category == 'ranged'
                || eq.equipment.GetEquipmentItem().Category == 'melee') {
                range_string += eq.equipment.GetEquipmentItem().GetRange()
            }
        }

        // Equipment Keywords
        let kw_string = '';
        if( type === 'medium' || type === 'full') {
            const keywords: Keyword[] = await eq.equipment.GetKeywords();
            if (keywords.length > 0) {
                kw_string += keywords.map(kw => kw.Name).join(', ');
            }
        }

        // Short description
        let short_desc_string = '';
        if( type === 'medium' ) {
            if (abilityObject && abilityObject.Modifiers.length > 0) {
                short_desc_string += abilityObject.Modifiers.join(', ');
            }
        }

        // Long description
        let long_desc_string = '';
        if( type === 'full' ) {
            if (abilityObject && abilityObject.Modifiers.length > 0) {
                short_desc_string += abilityObject.Modifiers.join(', ');
            }
            if (abilityObject && abilityObject.Description.length > 0) {
                long_desc_string += PrintOutDesc(abilityObject.Description)
            }
        }

        // output details for medium
        if (type === "medium") {
            const parts = [range_string, kw_string, short_desc_string].filter(p => p && p.trim().length > 0);
            if (parts.length > 0) {
                ex.push(parts.join(" | "));
            }
        }

        // output details for full
        if( type === 'full') {
            if( kw_string != '' ) {
                ex.push(kw_string);
            }

            if(long_desc_string != '' ) {
                ex.push(long_desc_string);
            }
        }

        // line break
        if( type === 'full') {
            ex.push('');
        }
    }

    ex.push(''); // separator

    /** Fighter Abilities */
    for (const ability of M_Model.SubProperties) {

        let ab_name = i_ability+' ' + ability.SelfDynamicProperty.OptionChoice.GetTrueName();

        const selections = (ability).SelfDynamicProperty.Selections
        for (let i = 0; i < selections.length; i++) {
            if (selections[i].SelectedChoice != null) {
                ab_name += ' (' + selections[i].SelectedChoice?.display_str + ')'
            }
        }

        ex.push(TTSBold(TTScAbility(ab_name)));


        if( type == 'full' ) {
            let long_desc_string = '';
            if ((ability.SelfDynamicProperty.OptionChoice as Ability).Description.length > 0) {
                long_desc_string += PrintOutDesc((ability.SelfDynamicProperty.OptionChoice as Ability).Description)
            }
            if(long_desc_string != '' ) {
                ex.push(long_desc_string);
            }

        }
    }


    /** Fighter Upgrades */
    for (const upgrade of M_Model.Upgrades) {
        let up_name = i_up+' ';

        up_name += (upgrade.HeldObject as WarbandProperty).SelfDynamicProperty.OptionChoice.GetTrueName();

        const selections = (upgrade.HeldObject as WarbandProperty).SelfDynamicProperty.Selections
        for (let i = 0; i < selections.length; i++) {
            if (selections[i].SelectedChoice != null) {
                up_name += ' (' + selections[i].SelectedChoice?.display_str + ')'
            }
        }

        ex.push(TTSBold(TTScUpgrade(up_name)));

        if( type == 'full' ) {
            let long_desc_string = '';
            if (((upgrade.HeldObject  as WarbandProperty).SelfDynamicProperty.OptionChoice as Upgrade).Description.length > 0) {
                long_desc_string += PrintOutDesc(((upgrade.HeldObject  as WarbandProperty).SelfDynamicProperty.OptionChoice as Upgrade).Description)
            }
            if(long_desc_string != '' ) {
                ex.push(long_desc_string);
            }
        }
    }

    ex.push(''); // separator

    /** Fighter Skills */
    for (const skill of M_Model.Skills) {

        const sk_name = i_skill+' ' + skill.SelfDynamicProperty.OptionChoice.GetTrueName();

        ex.push(TTSBold(TTScSkill(sk_name)));


        if( type == 'full' ) {
            let long_desc_string = '';
            if (((skill).SelfDynamicProperty.OptionChoice as Skill).Description.length > 0) {
                long_desc_string += PrintOutDesc(((skill).SelfDynamicProperty.OptionChoice as Skill).Description)
            }
            if(long_desc_string != '' ) {
                ex.push(long_desc_string);
            }
        }
    }

    /** Fighter Injuries */
    for (const injury of M_Model.Injuries) {
        const in_name = i_injury+' ' + injury.SelfDynamicProperty.OptionChoice.GetTrueName();

        ex.push(TTSBold(TTScInjury(in_name)));

        if( type == 'full' ) {
            let long_desc_string = '';
            if (((injury).SelfDynamicProperty.OptionChoice as Injury).Description.length > 0) {
                long_desc_string += PrintOutDesc(((injury).SelfDynamicProperty.OptionChoice as Injury).Description)
            }
            if(long_desc_string != '' ) {
                ex.push(long_desc_string);
            }
        }
    }


    return ex.join("\n");
}