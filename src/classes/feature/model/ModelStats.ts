import {getMoveType} from "../../../utility/functions";

// Raw stat profile of a model
interface ModelStatistics {
    movement?: number,
    melee?: number, 
    ranged?: number,
    base?: number[],
    armour?: number, 
    movetype?: number,
    potential?: number,
    mercenary?: boolean
}

// Variant of the stat profile for use in displaying
interface PresentModelStatistics {
    movement?: number[],
    melee?: number[], 
    ranged?: number[],
    base?: number[][],
    armour?: number[], 
    movetype?: number[],
    potential?: number[],
    mercenary?: boolean[]
}

// Given a baselist, override any stats with their equivilent addonlist,
// but leave any stats not given by the addonlist the same.
export function MergeTwoStats(baseList: ModelStatistics, addonList : ModelStatistics) {
    const MergedList : ModelStatistics = {}
    
    if (baseList.movement != undefined) {MergedList.movement = baseList.movement}
    if (baseList.melee != undefined) {MergedList.melee = baseList.melee}
    if (baseList.ranged != undefined) {MergedList.ranged = baseList.ranged}
    if (baseList.base != undefined) {MergedList.base = baseList.base}
    if (baseList.armour != undefined) {MergedList.armour = baseList.armour}
    if (baseList.movetype != undefined) {MergedList.movetype = baseList.movetype}
    if (baseList.potential != undefined) {MergedList.potential = baseList.potential}
    if (baseList.mercenary != undefined) {MergedList.mercenary = baseList.mercenary}

    if (addonList.movement != undefined) {MergedList.movement = addonList.movement}
    if (addonList.melee != undefined) {MergedList.melee = addonList.melee}
    if (addonList.ranged != undefined) {MergedList.ranged = addonList.ranged}
    if (addonList.base != undefined) {MergedList.base = addonList.base}
    if (addonList.armour != undefined) {MergedList.armour = addonList.armour}
    if (addonList.movetype != undefined) {MergedList.movetype = addonList.movetype}
    if (addonList.potential != undefined) {MergedList.potential = addonList.potential}
    if (addonList.mercenary != undefined) {MergedList.mercenary = addonList.mercenary}

    return MergedList
}

// Given a stat profile and a list of selected stat options, create a 
// presentation statistics instance.
export function GetPresentationStatistic(base_stats : ModelStatistics, stat_options : ModelStatistics[][]) {
    const finalstats : PresentModelStatistics = {}
    const movement_op = []  
    const melee_op = []  
    const ranged_op = []  
    const base_op = []  
    const armour_op = []  
    const movetype_op = []  
    const potential_op = []  
    const mercenary_op = []

    if (base_stats.movement != undefined) { movement_op.push(base_stats.movement)}  
    if (base_stats.melee != undefined) { melee_op.push(base_stats.melee)}
    if (base_stats.ranged != undefined) { ranged_op.push(base_stats.ranged)}
    if (base_stats.base != undefined) { base_op.push(base_stats.base)}
    if (base_stats.armour != undefined) { armour_op.push(base_stats.armour)}
    if (base_stats.movetype != undefined) { movetype_op.push(base_stats.movetype)}
    if (base_stats.potential != undefined) { potential_op.push(base_stats.potential)}
    if (base_stats.mercenary != undefined) { mercenary_op.push(base_stats.mercenary)}

    try {
        for (let i = 0; i < stat_options.length; i++) {
            const option_suite : ModelStatistics[] = stat_options[i]
            let add_to_merc = true
            for (let j = 0; j < option_suite.length; j++) {
                if (hasOnlyOneProperty(option_suite[j]) == false) {
                    add_to_merc = false;
                    break;
                }
            }
            if (add_to_merc) {
                for (let j = 0; option_suite.length; j++) {
                    const cur_opt = option_suite[j];
                    if (cur_opt.armour != undefined) {armour_op.push(cur_opt.armour)}
                    if (cur_opt.base != undefined) {base_op.push(cur_opt.base)}
                    if (cur_opt.melee != undefined) {melee_op.push(cur_opt.melee)}
                    if (cur_opt.mercenary != undefined) {mercenary_op.push(cur_opt.mercenary)}
                    if (cur_opt.movement != undefined) {movement_op.push(cur_opt.movement)}
                    if (cur_opt.movetype != undefined) {movetype_op.push(cur_opt.movetype)}
                    if (cur_opt.potential != undefined) {potential_op.push(cur_opt.potential)}
                    if (cur_opt.ranged != undefined) {ranged_op.push(cur_opt.ranged)}
                }
            }
        }
    } catch (e) {console.log(e)}

    if (movement_op.length > 0) {
        const arr = []
        for (let i = 0; i < movement_op.length; i++) { arr.push(movement_op[i]) }
        finalstats.movement = arr;
    }
    if (movetype_op.length > 0) {
        const arr = []
        for (let i = 0; i < movetype_op.length; i++) { arr.push(movetype_op[i]) }
        finalstats.movetype = arr;
    }
    if (armour_op.length > 0) {
        const arr = []
        for (let i = 0; i < armour_op.length; i++) { arr.push(armour_op[i]) }
        finalstats.armour = arr;
    }
    if (mercenary_op.length > 0) {
        const arr = []
        for (let i = 0; i < mercenary_op.length; i++) { arr.push(mercenary_op[i]) }
        finalstats.mercenary = arr;
    }
    if (potential_op.length > 0) {
        const arr = []
        for (let i = 0; i < potential_op.length; i++) { arr.push(potential_op[i]) }
        finalstats.potential = arr;
    }
    if (base_op.length > 0) {
        const arr = []
        for (let i = 0; i < base_op.length; i++) { arr.push(base_op[i]) }
        finalstats.base = arr;
    }
    if (ranged_op.length > 0) {
        const arr = []
        for (let i = 0; i < ranged_op.length; i++) { arr.push(ranged_op[i]) }
        finalstats.ranged = arr;
    }
    if (melee_op.length > 0) {
        const arr = []
        for (let i = 0; i < melee_op.length; i++) { arr.push(melee_op[i]) }
        finalstats.melee = arr;
    }

    return finalstats
}

// Check if the statistics item has one property.
export function hasOnlyOneProperty(stat: ModelStatistics): boolean {
    const definedProps = Object.values(stat).filter(value => value !== undefined);
    return definedProps.length === 1;
}

export {ModelStatistics, PresentModelStatistics}

/**
 * Normalize stats for models and presentmodels that take differenty types
 * @param value
 */
function normalizeStat<T>(value: T | T[] | undefined): T[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}
type StatInput = ModelStatistics | PresentModelStatistics;

/**
 * Returns the string for the Models Move Stat
 * @param stats
 */
export function getModelStatMove(stats: StatInput): string {
    const movements = normalizeStat(stats.movement);
    const movetypes = normalizeStat(stats.movetype);

    if (movements.length === 0 || movetypes.length === 0) return '';

    const moveStr = movements.map(m => m.toString()).join('/');
    const typeStr = movetypes.map(getMoveType).join('/');

    return `${moveStr}"/${typeStr}`;
}

/**
 * Returns the string for the Models Ranged Stat
 * @param stats
 */
export function getModelStatRanged(stats: StatInput): string {
    const ranged = normalizeStat(stats.ranged);

    if (ranged.length === 0) return '0';

    return ranged
        .map(val => (val > 0 ? '+' : val < 0 ? '-' : '') + Math.abs(val))
        .join('/');
}

/**
 * Returns the string for the Models Melee Stat
 * @param stats
 */
export function getModelStatMelee(stats: StatInput): string {
    const melee = normalizeStat(stats.melee);

    if (melee.length === 0) return '0';

    return melee
        .map(val => (val > 0 ? '+' : val < 0 ? '-' : '') + Math.abs(val))
        .join('/');
}

/**
 * Returns the string for the Models ArmourStat
 * @param stats
 */
export function getModelStatArmour(stats: StatInput): string {
    const armour = normalizeStat(stats.armour);

    if (armour.length === 0) return '0';

    return armour.map(a => a.toString()).join('/');
}

// Return a single string with the full stat profile
export function GetStatAsFullString(statset : ModelStatistics) : string {
    const val : string[] = [];

    if (statset.movement != undefined) {val.push("Movement: " + statset.movement + "\"")}
    if (statset.movetype != undefined) {val.push("Move Type: " + statset.movetype)}
    if (statset.melee != undefined) {val.push("Melee: " + statset.melee)}
    if (statset.ranged != undefined) {val.push("Ranged: " + statset.ranged)}
    if (statset.armour != undefined) {val.push("Armour: " + statset.armour)}
    if (statset.base != undefined) {val.push("Base: " + statset.base.join('x') + "mm")}

    return val.join(', ');
}


