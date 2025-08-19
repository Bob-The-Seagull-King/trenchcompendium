import { getModelStatArmour, getModelStatMelee, getModelStatMove, getModelStatRanged, ModelStatistics } from "../../../feature/model/ModelStats";
import { WarbandMember } from "../Purchases/WarbandMember";
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from "../Purchases/WarbandPurchase";
import { UserWarband } from "../UserWarband"
import { SumWarband } from "../WarbandManager"
import { EventRunner } from "../../../contextevent/contexteventhandler";
import { WarbandProperty } from "../WarbandProperty";
import { Keyword } from "../../../feature/glossary/Keyword";

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