// Data File Imports -----------------------------------

/////////////////////////////// ENGLISH ///////////////////////////////
// Data File Imports -----------------------------------
import en_glossarydata from '../data/general/glossary.json'
import en_tabledata from '../data/general/table.json'
import en_imagedata from '../data/general/images.json'
import en_keyworddata from '../data/general/keyword.json'

import en_abilitydata from '../data/units/ability.json'
import en_modeldata from '../data/units/model.json'
import en_modelvariantdata from '../data/units/modelvariant.json'

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
    abilitydata : any,
    modeldata : any,
    modelvariantdata : any,
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
        abilitydata : en_abilitydata,
        modeldata : en_modeldata,
        modelvariantdata : en_modelvariantdata,        
        testdynamicdata : en_testdynamic,
        teststaticdata : en_teststatic,
        testbasicdata : en_testbasic
    }
}