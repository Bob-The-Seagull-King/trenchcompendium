interface ModelStatistics {
    movement?: number,
    melee?: number, 
    ranged?: number,
    base?: number[],
    armor?: number, 
    movetype?: number,
    potential?: number,
    mercenary?: boolean
}

export function MergeTwoStats(baseList: ModelStatistics, addonList : ModelStatistics) {
    const MergedList : ModelStatistics = {}
    
    if (baseList.movement != undefined) {MergedList.movement = baseList.movement}
    if (baseList.melee != undefined) {MergedList.melee = baseList.melee}
    if (baseList.ranged != undefined) {MergedList.ranged = baseList.ranged}
    if (baseList.base != undefined) {MergedList.base = baseList.base}
    if (baseList.armor != undefined) {MergedList.armor = baseList.armor}
    if (baseList.movetype != undefined) {MergedList.movetype = baseList.movetype}
    if (baseList.potential != undefined) {MergedList.potential = baseList.potential}
    if (baseList.mercenary != undefined) {MergedList.mercenary = baseList.mercenary}

    if (addonList.movement != undefined) {MergedList.movement = addonList.movement}
    if (addonList.melee != undefined) {MergedList.melee = addonList.melee}
    if (addonList.ranged != undefined) {MergedList.ranged = addonList.ranged}
    if (addonList.base != undefined) {MergedList.base = addonList.base}
    if (addonList.armor != undefined) {MergedList.armor = addonList.armor}
    if (addonList.movetype != undefined) {MergedList.movetype = addonList.movetype}
    if (addonList.potential != undefined) {MergedList.potential = addonList.potential}
    if (addonList.mercenary != undefined) {MergedList.mercenary = addonList.mercenary}

    return MergedList
}

export {ModelStatistics}