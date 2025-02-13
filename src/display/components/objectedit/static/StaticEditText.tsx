
import React, { useState } from 'react'

export interface EditTextType {
    title      : string,
    returnBaseValue : (_objitem : any | null, _subitem? : any | null) => string,
    returnButton : (_manager : any, _objitem : any | null, open : any, _subitem? : any | null, _item? : string | null) => JSX.Element,
    updateText : (_manager : any, _objitem : any | null, itemName : string, close : any, update: any, _subitem? : any | null) => void
}

export interface EditTextDataTable {[moveid: Lowercase<string>]: EditTextType}

export const EditTextDataDex : EditTextDataTable = {
    
}