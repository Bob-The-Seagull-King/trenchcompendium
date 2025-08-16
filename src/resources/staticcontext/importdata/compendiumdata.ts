
export type NameToNameTable = {[type : string]: string};

export function ConvertCompendiumToCompanionID(_id : string) : string {
    if (CompendiumDataConvertTable[_id] != undefined
        && CompendiumDataConvertTable[_id] != null
    ) {
        return CompendiumDataConvertTable[_id]
    }
    return _id
}

export const CompendiumDataConvertTable : NameToNameTable = {
    "fc_hereticlegion" : "fc_hereticlegion",
    "fc_trenchpilgrim" : "fc_trenchpilgrim",
    "fc_ironsultanate" : "fc_ironsultanate",
    "fc_newantioch" : "fc_newantioch",
    "fc_blackgrail" : "fc_cultoftheblackgrail",
    "fc_court" : "fc_courtofthesevenheadedserpent",
    "fv_navalraidingparty" : "fc_hereticlegion_fv_hereticnavalraidingparty",
    "fv_trenchghosts" : "fc_hereticlegion_fv_trenchghosts",
    "fv_knightsofavarice" : "fc_hereticlegion_fv_knightsofavarice",
    "fv_processionofthesacredaffliction" : "fc_trenchpilgrim_fv_processionofthesacredaffliction",
    "fv_warpilgramigeofstmethodius" : "fc_trenchpilgrim_fv_warpilgimageofsaintmethodius",
    "fv_cavalcadeofthetenthplague" : "fc_trenchpilgrim_fv_cavalcadeofthetenthplague",
    "fv_fidaiofalamutthecabalofassassins" : "fc_ironsultanate_fv_fidaiofalamut",
    "fv_houseofwisdom" : "fc_ironsultanate_fv_houseofwisdom",
    "fv_defendersoftheironwall" : "fc_ironsultanate_fv_defendersoftheironwall",
    "fv_papalstatesinterventionforce" : "fc_newantioch_fv_papalstatesinterventionforce",
    "fv_eirerangers" : "fc_newantioch_fc_eirerangers",
    "fv_stostruppenofthefreestateofprussia" : "fc_newantioch_fc_stortruppenofthefreestateofprussia",
    "fv_kingdomofalbaassaultdetachment" : "fc_newantioch_fv_kingdomofalbaassaultdetatchment",
    "fv_expeditionaryforcesofabyssinia" : "fc_newantioch_fv_expeditionaryforcedofabyssinia",
    "fv_theredbrigade" : "fc_newantioch_fv_redbrigade",
    "fv_dirgeofthegreathegemon" : "fc_cultoftheblackgrail_fv_dirgeofthegreathegemon"
}