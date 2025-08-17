
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
    "fv_dirgeofthegreathegemon" : "fc_cultoftheblackgrail_fv_dirgeofthegreathegemon",
    "em_extradice" : "es_extradice",
    "em_duplicate" : "es_duplicate",
    "em_split" : "es_split",
    "em_reroll" : "es_reroll",
    "em_setdice" : "es_setdice",
    "em_seek" : "es_seek",
    "em_circleback" : "es_circleback",
    "em_combine" : "es_combine",
    "em_lucky" : "es_lucky",
    "lc_moonshinestash" : "el_moonshinestash",
    "lc_heavyweaponscache" : "el_heavyweaponscache",
    "lc_trenchshrine" : "el_trenchshrine",
    "lc_ruinedhouse" : "el_ruinedhouse",
    "lc_ruinedchurch" : "el_ruinedchurchmasjidsynagogue",
    "lc_survivor" : "el_survivor",
    "lc_fallensoldier" : "el_fallensoldier",
    "lc_trenchmerchant" : "el_trenchmerchant",
    "lc_mapanddocumentbag" : "el_mapanddocumentbag",
    "lc_snipersnest" : "el_snipersnest",
    "lc_fallenknight" : "el_fallenknight",
    "lc_warbandstrongbox" : "el_warbandstrongbox",
    "lc_angelicinstrument" : "el_angelicinstrument",
    "lc_abandonedprophecyradiopost" : "el_abandonedpropheticradiostation",
    "lc_potofmanna" : "el_potofmanna",
    "lc_ransackedalchemistworkshop" : "el_ransackedalchemistworkshop",
    "lc_battlefieldofcorpses" : "el_battlefieldofcorpses",
    "lc_hiddenpassages" : "el_hiddenpassages",
    "lc_blacknetworkcontact" : "el_blacknetworkcontact",
    "lc_treasureoftheholies" : "el_treasureoftheholies",
    "lc_lockofsamsonshair" : "el_lockofsamsonshair",
    "lc_sampleofholydna" : "el_sampleofholydna",
    "lc_golgothatektites" : "el_golgothatektites",
    "lc_fruitfromthetreeofgoodandevilknowledge" : "el_fruitfromthetreeofgoodandevilknowledge",
    "lc_esotericlibrary" : "el_esotericlibrary",
    "lc_jabireanalchemicalbook" : "el_jabireanalchemicalbooks",
    "lc_skullofasaint" : "el_skullofasaint",
    "lc_blackmarket" : "el_blackmarket",
    "lc_bookofgolems" : "el_bookofgolems",
    "lc_stashofdrugsanderotica" : "el_stashofdrugsanderotica",
    "lc_saintsreliquary" : "el_saintsreliquary",
    "lc_highrankingcaptive" : "el_highrankingcaptain",
    "lc_abandonedresurrectionmachine" : "el_abandonedressurectionmachine"
}