// Data File Imports -----------------------------------

/////////////////////////////// ENGLISH ///////////////////////////////
// Data File Imports -----------------------------------
import en_glossarydata from '../data/general/glossary.json'
import en_tabledata from '../data/general/table.json'
import en_imagedata from '../data/general/images.json'
import en_keyworddata from '../data/general/keyword.json'
import en_gameruledata from '../data/general/game_rules.json'
import en_campaignruledata from '../data/general/book_rules.json'
import en_errataruledata from '../data/general/errata_rules.json'

import en_abilitydata from '../data/units/ability.json'
import en_modeldata from '../data/units/model.json'
import en_modelvariantdata from '../data/units/modelvariant.json'
import en_upgradedata from '../data/units/upgrade.json'

import en_equipmentdata from '../data/collectable/equipment.json'

import en_factiondata from '../data/faction/faction.json'
import en_factionvariantdata from '../data/faction/factionvariant.json'
import en_factionruledata from '../data/faction/rule.json'

import en_modelupgraderelationship from '../data/relationships/modelupgraderelationship.json'
import en_modelequipmentrelationship from '../data/relationships/modelequipmentrelationship.json'
import en_factionmodelrelationship from '../data/relationships/factionmodelrelationship.json'
import en_factionequipmentrelationship from '../data/relationships/factionequipmentrelationship.json'

import en_scenario from '../data/scenario/scenarios.json'
import en_gloriousdeeds from '../data/scenario/glorious_deeds.json'
import en_scenariorule from '../data/scenario/scenario_rule.json'
import en_scenarioobjectives from '../data/scenario/gen_scenarios_objective.json'
import en_scenariodeployments from '../data/scenario/gen_scenarios_deployment.json'

import en_explorationlocation from '../data/exploration/exploration_location.json'
import en_explorationtable from '../data/exploration/exploration_table.json'

import en_skill from '../data/skill/skill.json'
import en_injury from '../data/skill/injury.json'
import en_skillgroup from '../data/skill/skillgroup.json'
import en_patron from '../data/skill/patron.json'
import en_patronrelationship from '../data/skill/patronrelationship.json'

import en_testdynamic from '../data/testitemscontext/testitemdynamic.json'
import en_teststatic from '../data/testitemscontext/testitemstatic.json'
import en_testbasic from '../data/testitemscontext/testitembasic.json'
// -----------------------------------------------------
/////////////////////////////// ENGLISH ///////////////////////////////

// -----------------------------------------------------


export interface LanguageDataTable {[languageID: string]: DataSetTC}

export interface DataSetTC {
    glossarydata : any,
    tabledata : any,
    imagedata : any,
    keyworddata : any,
    gameruledata : any,
    campaignruledata : any,
    errataruledata : any,
    abilitydata : any,
    modeldata : any,
    modelvariantdata : any,
    upgradedata : any,
    modelupgraderelationship : any,
    equipmentdata : any,
    modelequipmentrelationship : any,
    factiondata : any,
    factionvariantdata : any,
    factionruledata : any,
    factionmodelrelationship : any,
    factionequipmentrelationship : any,
    scenario : any,
    gloriousdeeds : any,
    scenariorule : any,
    scenarioobjectives : any,
    scenariodeployments : any,
    explorationlocation : any,
    explorationtable : any,
    skilldata : any,
    skillgroup : any,
    patrondata : any,
    patronrelationship : any,
    injurydata : any,
    testdynamicdata : any,
    teststaticdata : any,
    testbasicdata : any
}

export const DataByLanguageTable : LanguageDataTable = {
    ln_english: {
        glossarydata : en_glossarydata,
        tabledata : en_tabledata,
        imagedata : en_imagedata,
        keyworddata : en_keyworddata,
        gameruledata : en_gameruledata,
        campaignruledata : en_campaignruledata,
        errataruledata : en_errataruledata,
        abilitydata : en_abilitydata,
        modeldata : en_modeldata,
        modelvariantdata : en_modelvariantdata,    
        upgradedata : en_upgradedata,
        modelupgraderelationship : en_modelupgraderelationship,  
        equipmentdata : en_equipmentdata,  
        modelequipmentrelationship : en_modelequipmentrelationship,
        factiondata : en_factiondata,
        factionvariantdata : en_factionvariantdata,
        factionruledata : en_factionruledata,
        factionmodelrelationship : en_factionmodelrelationship,
        factionequipmentrelationship : en_factionequipmentrelationship,
        scenario : en_scenario,
        gloriousdeeds : en_gloriousdeeds,
        scenariorule : en_scenariorule,
        scenarioobjectives : en_scenarioobjectives,
        scenariodeployments : en_scenariodeployments,
        explorationlocation : en_explorationlocation,
        skilldata : en_skill,
        skillgroup : en_skillgroup,
        injurydata : en_injury,
        patrondata : en_patron,
        patronrelationship : en_patronrelationship,
        explorationtable : en_explorationtable,
        testdynamicdata : en_testdynamic,
        teststaticdata : en_teststatic,
        testbasicdata : en_testbasic
    }
}