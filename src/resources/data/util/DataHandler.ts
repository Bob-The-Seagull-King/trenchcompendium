// Data File Imports -----------------------------------

/////////////////////////////// DEFAULT ///////////////////////////////
// Data File Imports -----------------------------------
import def_glossarydata from '../data/general/glossary.json'
import def_tabledata from '../data/general/table.json'
import def_imagedata from '../data/general/images.json'
import def_keyworddata from '../data/general/keyword.json'
import def_gameruledata from '../data/general/game_rules.json'
import def_campaignruledata from '../data/general/book_rules.json'
import def_errataruledata from '../data/general/errata_rules.json'

import def_abilitydata from '../data/units/ability.json'
import def_modeldata from '../data/units/model.json'
import def_modelvariantdata from '../data/units/modelvariant.json'
import def_upgradedata from '../data/units/upgrade.json'

import def_fireteamdata from '../data/collectable/fireteam.json'
import def_equipmentdata from '../data/collectable/equipment.json'

import def_factiondata from '../data/faction/faction.json'
import def_factionvariantdata from '../data/faction/factionvariant.json'
import def_factionruledata from '../data/faction/rule.json'

import def_modelupgraderelationship from '../data/relationships/modelupgraderelationship.json'
import def_modelequipmentrelationship from '../data/relationships/modelequipmentrelationship.json'
import def_factionmodelrelationship from '../data/relationships/factionmodelrelationship.json'
import def_factionequipmentrelationship from '../data/relationships/factionequipmentrelationship.json'

import def_scenario from '../data/scenario/scenarios.json'
import def_gloriousdeeds from '../data/scenario/glorious_deeds.json'
import def_scenariorule from '../data/scenario/scenario_rule.json'
import def_scenarioobjectives from '../data/scenario/gen_scenarios_objective.json'
import def_scenariodeployments from '../data/scenario/gen_scenarios_deployment.json'

import def_explorationlocation from '../data/exploration/exploration_location.json'
import def_explorationtable from '../data/exploration/exploration_table.json'

import def_skill from '../data/skill/skill.json'
import def_injury from '../data/skill/injury.json'
import def_skillgroup from '../data/skill/skillgroup.json'
import def_patron from '../data/skill/patron.json'
import def_patronrelationship from '../data/skill/patronrelationship.json'

import def_testdynamic from '../data/testitemscontext/testitemdynamic.json'
import def_teststatic from '../data/testitemscontext/testitemstatic.json'
import def_testbasic from '../data/testitemscontext/testitembasic.json'
// -----------------------------------------------------
/////////////////////////////// DEFAULT ///////////////////////////////

/////////////////////////////// DEFAULT ///////////////////////////////
// Data File Imports -----------------------------------
import pre_glossarydata from '../data_ver_163/general/glossary.json'
import pre_tabledata from '../data_ver_163/general/table.json'
import pre_imagedata from '../data_ver_163/general/images.json'
import pre_keyworddata from '../data_ver_163/general/keyword.json'
import pre_gameruledata from '../data_ver_163/general/game_rules.json'
import pre_campaignruledata from '../data_ver_163/general/book_rules.json'
import pre_errataruledata from '../data_ver_163/general/errata_rules.json'

import pre_abilitydata from '../data_ver_163/units/ability.json'
import pre_modeldata from '../data_ver_163/units/model.json'
import pre_modelvariantdata from '../data_ver_163/units/modelvariant.json'
import pre_upgradedata from '../data_ver_163/units/upgrade.json'

import pre_fireteamdata from '../data_ver_163/collectable/fireteam.json'
import pre_equipmentdata from '../data_ver_163/collectable/equipment.json'

import pre_factiondata from '../data_ver_163/faction/faction.json'
import pre_factionvariantdata from '../data_ver_163/faction/factionvariant.json'
import pre_factionruledata from '../data_ver_163/faction/rule.json'

import pre_modelupgraderelationship from '../data_ver_163/relationships/modelupgraderelationship.json'
import pre_modelequipmentrelationship from '../data_ver_163/relationships/modelequipmentrelationship.json'
import pre_factionmodelrelationship from '../data_ver_163/relationships/factionmodelrelationship.json'
import pre_factionequipmentrelationship from '../data_ver_163/relationships/factionequipmentrelationship.json'

import pre_scenario from '../data_ver_163/scenario/scenarios.json'
import pre_gloriousdeeds from '../data_ver_163/scenario/glorious_deeds.json'
import pre_scenariorule from '../data_ver_163/scenario/scenario_rule.json'
import pre_scenarioobjectives from '../data_ver_163/scenario/gen_scenarios_objective.json'
import pre_scenariodeployments from '../data_ver_163/scenario/gen_scenarios_deployment.json'

import pre_explorationlocation from '../data_ver_163/exploration/exploration_location.json'
import pre_explorationtable from '../data_ver_163/exploration/exploration_table.json'

import pre_skill from '../data_ver_163/skill/skill.json'
import pre_injury from '../data_ver_163/skill/injury.json'
import pre_skillgroup from '../data_ver_163/skill/skillgroup.json'
import pre_patron from '../data_ver_163/skill/patron.json'
import pre_patronrelationship from '../data_ver_163/skill/patronrelationship.json'

import pre_testdynamic from '../data_ver_163/testitemscontext/testitemdynamic.json'
import pre_teststatic from '../data_ver_163/testitemscontext/testitemstatic.json'
import pre_testbasic from '../data_ver_163/testitemscontext/testitembasic.json'
// -----------------------------------------------------
/////////////////////////////// DEFAULT ///////////////////////////////

// -----------------------------------------------------


export interface VersionDataTable {[languageID: string]: DataSetTC}

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
    fireteamdata : any,
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

export const DataByVersionTable : VersionDataTable = {
    ver_default: {
        glossarydata : def_glossarydata,
        tabledata : def_tabledata,
        imagedata : def_imagedata,
        keyworddata : def_keyworddata,
        gameruledata : def_gameruledata,
        campaignruledata : def_campaignruledata,
        errataruledata : def_errataruledata,
        abilitydata : def_abilitydata,
        modeldata : def_modeldata,
        modelvariantdata : def_modelvariantdata,    
        upgradedata : def_upgradedata,
        modelupgraderelationship : def_modelupgraderelationship,  
        fireteamdata : def_fireteamdata,
        equipmentdata : def_equipmentdata,  
        modelequipmentrelationship : def_modelequipmentrelationship,
        factiondata : def_factiondata,
        factionvariantdata : def_factionvariantdata,
        factionruledata : def_factionruledata,
        factionmodelrelationship : def_factionmodelrelationship,
        factionequipmentrelationship : def_factionequipmentrelationship,
        scenario : def_scenario,
        gloriousdeeds : def_gloriousdeeds,
        scenariorule : def_scenariorule,
        scenarioobjectives : def_scenarioobjectives,
        scenariodeployments : def_scenariodeployments,
        explorationlocation : def_explorationlocation,
        skilldata : def_skill,
        skillgroup : def_skillgroup,
        injurydata : def_injury,
        patrondata : def_patron,
        patronrelationship : def_patronrelationship,
        explorationtable : def_explorationtable,
        testdynamicdata : def_testdynamic,
        teststaticdata : def_teststatic,
        testbasicdata : def_testbasic
    },
    ver_pre_163: {
        glossarydata : pre_glossarydata,
        tabledata : pre_tabledata,
        imagedata : pre_imagedata,
        keyworddata : pre_keyworddata,
        gameruledata : pre_gameruledata,
        campaignruledata : pre_campaignruledata,
        errataruledata : pre_errataruledata,
        abilitydata : pre_abilitydata,
        modeldata : pre_modeldata,
        modelvariantdata : pre_modelvariantdata,    
        upgradedata : pre_upgradedata,
        modelupgraderelationship : pre_modelupgraderelationship,  
        fireteamdata : pre_fireteamdata,
        equipmentdata : pre_equipmentdata,  
        modelequipmentrelationship : pre_modelequipmentrelationship,
        factiondata : pre_factiondata,
        factionvariantdata : pre_factionvariantdata,
        factionruledata : pre_factionruledata,
        factionmodelrelationship : pre_factionmodelrelationship,
        factionequipmentrelationship : pre_factionequipmentrelationship,
        scenario : pre_scenario,
        gloriousdeeds : pre_gloriousdeeds,
        scenariorule : pre_scenariorule,
        scenarioobjectives : pre_scenarioobjectives,
        scenariodeployments : pre_scenariodeployments,
        explorationlocation : pre_explorationlocation,
        skilldata : pre_skill,
        skillgroup : pre_skillgroup,
        injurydata : pre_injury,
        patrondata : pre_patron,
        patronrelationship : pre_patronrelationship,
        explorationtable : pre_explorationtable,
        testdynamicdata : pre_testdynamic,
        teststaticdata : pre_teststatic,
        testbasicdata : pre_testbasic
    }
}