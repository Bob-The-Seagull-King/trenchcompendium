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
    
    if (baseList.movement) {MergedList.movement = baseList.movement}
    if (baseList.melee) {MergedList.melee = baseList.melee}
    if (baseList.ranged) {MergedList.ranged = baseList.ranged}
    if (baseList.base) {MergedList.base = baseList.base}
    if (baseList.armor) {MergedList.armor = baseList.armor}
    if (baseList.movetype) {MergedList.movetype = baseList.movetype}
    if (baseList.potential) {MergedList.potential = baseList.potential}
    if (baseList.mercenary) {MergedList.mercenary = baseList.mercenary}
    
    if (addonList.movement) {MergedList.movement = addonList.movement}
    if (addonList.melee) {MergedList.melee = addonList.melee}
    if (addonList.ranged) {MergedList.ranged = addonList.ranged}
    if (addonList.base) {MergedList.base = addonList.base}
    if (addonList.armor) {MergedList.armor = addonList.armor}
    if (addonList.movetype) {MergedList.movetype = addonList.movetype}
    if (addonList.potential) {MergedList.potential = addonList.potential}
    if (addonList.mercenary) {MergedList.mercenary = addonList.mercenary}

    return MergedList
}

export {ModelStatistics}