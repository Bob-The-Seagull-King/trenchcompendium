/*
util.tsx holds functions that are used often in
multiple locations, and also return DOM elements.
*/
import React from 'react'

// Classes
import { Requester } from '../factories/Requester';
import { IGlossaryRule, GlossaryRule } from '../classes/feature/glossary/Glossary';

// Components
import GenericHover from '../display/components/generics/GenericHover';
import AdvancedDescriptionItemDisplay from '../display/components/subcomponents/description/AdvancedDescriptionItemDisplay';
import GlossaryDisplay from '../display/components/features/glossary/GlossaryDisplay';
import { makestringpresentable } from './functions';
import { ObjectTag } from '../classes/CompendiumItem';
import { GlossaryRuleFactory } from '../factories/features/GlossaryFactory';
import { KeywordFactory } from '../factories/features/KeywordFactory';
import KeywordDisplay from '../display/components/features/glossary/KeywordDisplay';

/**
 * Takes a string, and an array of string:glossary_id pairs, and turns
 * each word in the array into a hoverable element.
 * @param glossary  An array of JSON pairs in the format 
 *                  {val: String, id: String}
 * @param content   The string to convert
 * @returns Span element containing all elements of the text, with
 *          some parts of the text as <GlossaryHover/> elements.
 */
export function ConvertContentWithGlossary(glossary: any[] | undefined, content: string) {
    if (glossary) {
        let i = 0;
        let splitSet : string[] = [content];
        for (i = 0; i < (glossary?.length || 0); i ++) {
            const modifiers = "g"
            const matchstring = "("+glossary[i].val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")" //eslint-disable-line
            const patt = new RegExp(matchstring,modifiers);
            const tempsplit : string[] = [];
            let j = 0;
            for (j = 0; j < splitSet.length; j ++) {
                const split = splitSet[j].split(patt);
                let k = 0;
                for (k = 0; k < split.length; k ++) {
                    tempsplit.push(split[k])
                }
            }

            splitSet = tempsplit;
            
        }
        
        return (
            <span>
                {splitSet.map((item) => (
                    <span key='glossarysplititem' >
                        {ArrayItemIntoHtml(item, glossary)}
                    </span>
                ))}
            </span>
        )
    }
    return content;
}

/**
 * Transforms a single part of the string into the right element
 * @param content The content to be converted
 * @param delim The value the content should be if it's a hover item
 * @returns Either a <span> or <GlossaryHover> containing the content
 */
function ArrayItemIntoHtml(content: string, delim: any) {
    if (content != "") {
        let i = 0;
        for (i = 0; i < delim.length; i ++) {
            if (content == delim[i].val) {
                const GlossaryObject = GlossaryRuleFactory.CreateNewGlossaryRule(delim[i].id)
                if (GlossaryObject == null) {
                    const KeywordObject = KeywordFactory.CreateNewKeyword(delim[i].id, null)
                    return (<GenericHover d_colour={'grey'} d_name={content} titlename={KeywordObject.Name} d_type={""} d_method={() => <KeywordDisplay data={KeywordObject} />}/>)
                } else {
                    return (<GenericHover d_colour={'grey'} d_name={content} titlename={GlossaryObject.Name} d_type={""} d_method={() => <GlossaryDisplay data={GlossaryObject} />}/>)
                }
                
            }
        }
        
        return ( <span>{content}</span> )
        
    }
    return ( <span></span> )
}

/**
 * Gathers the list of tags that should be rendered
 * @param taglist List of tag objects the item has
 * @param bannedList Any tag which matches a string in here should not be shown
 * @returns Array of tag objects
 */
function sortTagsForDisplay(taglist:  ObjectTag, bannedList : string[]) {
    const tagarray: ObjectTag = {}

    for (const key of Object.keys(taglist)) {
        if (!bannedList.includes(key)) {
            tagarray[makestringpresentable(key)] = (typeof taglist[key] === 'boolean')? null : taglist[key];
        }
    }

    return tagarray;
}

/**
 * Returns the organized description of an object based on model data
 * @param baseObject The model which this description is attatched to
 * @param objectArray The array of description items to render
 * @returns Map of AbilityDescriptionItemDisplay elements
 */
export function returnDescription(baseObject: any, objectArray : any[]) {
    if (objectArray == undefined) {
        return (<></>)
    }
    return (
        <>
            {objectArray.map((item) => (
                <span key={"descriptionDisplay"} className={"description-element"}>
                    <AdvancedDescriptionItemDisplay data={item} parent={baseObject}/>
                </span>
            ))}
        </>
    )
}

/**
 * Returns the organized description of an object based on model data
 * @param baseObject The model which this description is attatched to
 * @param objectArray The array of description items to render
 * @returns Map of AbilityDescriptionItemDisplay elements
 */
export function returnParagraphsDescription(baseObject: any, objectArray : any[]) {
    return (
        <>
            {objectArray.map((item) => (
                <p key={"descriptionDisplay"} className={"description-element"}>
                    <AdvancedDescriptionItemDisplay data={item} parent={baseObject}/>
                </p>
            ))}
        </>
    )
}