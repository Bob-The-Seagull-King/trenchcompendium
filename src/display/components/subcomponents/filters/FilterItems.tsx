import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState, useRef } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Classes
import { FilterText, FilterItem, FilterTag, FilterRange } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces'
import { makestringpresentable } from '../../../../utility/functions'


/**
 * Switch between "off", "must include", and "must exclude"
 */
function SwitchStates(item : FilterItem, returnactivetext: any) {
    if (item.IsActive) {
        if (item.DoInclude) {
            item.IsActive = true;
            item.DoInclude = false;
        } else {
            item.IsActive = false;
            item.DoInclude = false;
        }
    } else {
        item.IsActive = true;
        item.DoInclude = true;
    }
    returnactivetext(GetDisplayVal(item))
}

/**
     * Determines the current state of the filter
     * "" = No impact
     * "negative" = Reject if fitler applies
     * "positive" = Accept if filter applies
     * @returns String to append to className
     */
function GetDisplayVal(item : FilterItem){
    if (item.IsActive) {
        if (item.DoInclude) {
            return "positive"
        } else {
            return "negative"
        }
    } else {
        return ""
    }
}

// Update the value of the text fitler
function updateName(item : FilterText, value: string) {
    item.Val = value;
}

// Update the strictness of the text filter
function updateStrict(item : FilterText, returnactivetext : any) {
    item.IsStrict = !item.IsStrict
    returnactivetext(item.IsStrict)
}

const FilterTextItem = (prop: any) => {
    const ItemFilter: FilterText = prop.data
    const [_currentstate, returnactivetext] = useState(ItemFilter.IsStrict);

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterItems.tsx</div>}>
            <div className="col">
                <div className="centerPosition">
                    <InputGroup className="mb-3 borderstyler subborderdefault">
                        <Form.Control onChange={e => updateName(ItemFilter, e.target.value)} className='' aria-label="Text input with checkbox" defaultValue={ItemFilter.Val}/>
                        <InputGroup.Text className=''>Exact Match?</InputGroup.Text>
                        <InputGroup.Checkbox checked={_currentstate}  onChange={e => updateStrict(ItemFilter, returnactivetext)}  className='' aria-label="Checkbox for following text input" ></InputGroup.Checkbox>
                    </InputGroup>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

const FilterRangeItem = (prop: any) => {
    const ItemFilter: FilterRange = prop.data

    const lowerRef = useRef<HTMLInputElement>(null);
    const upperRef = useRef<HTMLInputElement>(null);

    function resetRange(item : FilterRange) {
        item.Lower = item.Set_Lower;
        item.Upper = item.Set_Upper;
        if (lowerRef != null) {
            if (lowerRef.current) {
                lowerRef.current.value = item.Set_Lower.toString();
            }
        }
        if (upperRef != null) {
            if (upperRef.current) {
                upperRef.current.value = item.Set_Upper.toString();
            }
        }
    }
    
    function updateLower(item : FilterRange, value: number) {
        item.Lower = value;
    }
    function updateUpper(item : FilterRange, value: number) {
        item.Upper = value;
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterItems.tsx</div>}>
        <div className="col">
            <div className="centerPosition">
                
                <div className="row" style={{minHeight:"5rem"}}>
                    
                <div className="col-2">
                        
                        <div className={"filterbox quartermargin borderstyler basestructure filterbuttonitem bordergrey backgroundgrey setheightcentered"}  >

                            
                            <div onClick={() => resetRange(ItemFilter)} className="hovermouse widecentertext">
                                {"Reset"}
                            </div>  
                            
                            
                        </div>
                    </div>
                    <div className="col-5">
                        
                        <div className={"filterbox quartermargin borderstyler basestructure filterbuttonitem bordergrey backgroundgrey setheightcentered"} >
                            <div className='hovermouse tagpad'/>
                            {"MIN"}
                            <div className='tagpad'/>
                            
                            <div className='col-9'>
                                <InputGroup className=" tagboxpad" >                            
                                    <Form.Control type="number" ref={lowerRef} onChange={e => updateLower(ItemFilter, parseInt(e.target.value))} className='' aria-label="Text input with checkbox" defaultValue={ItemFilter.Lower.toString()}/>
                                </InputGroup>
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-5">
                        
                        <div className={"filterbox quartermargin borderstyler basestructure filterbuttonitem bordergrey backgroundgrey setheightcentered"}  >
                            <div className='hovermouse tagpad'/>
                            {"MAX"}
                            <div className='tagpad'/>
                            
                            <div className='col-9'>
                                <InputGroup className=" tagboxpad" >                            
                                    <Form.Control type="number" ref={upperRef} onChange={e => updateUpper(ItemFilter, parseInt(e.target.value))} className='' aria-label="Text input with checkbox" defaultValue={ItemFilter.Upper.toString()}/>
                                </InputGroup>
                            </div>
                            
                        </div>
                    </div>
                </div>
            
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

const FilterTagItem = (prop: any) => {
    const ItemFilter: FilterTag = prop.data
    const [_currentstate, returnactivetext] = useState(GetDisplayVal(ItemFilter.TagType));

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterItems.tsx</div>}>
        <div className="">
            <div className="centerPosition">
                <div className={"setheightcentered filterbox quartermargin borderstyler basestructure filterbuttonitem" + (_currentstate == "" ? " bordergrey backgroundgrey" : _currentstate == "positive" ? " subbordergreen subbackgroundgreen" : " subborderred subbackgroundred")} >
                    <div className='hovermouse tagpad'/>
                    <div onClick={() => SwitchStates(ItemFilter.TagType, returnactivetext)} className="hovermouse tagboxtitle ">
                        {makestringpresentable(ItemFilter.TagType.Name)}
                    </div>
                    <div className='tagpad'/>
                     
                    <div className=''>
                        <InputGroup className="shorten tagboxpad" >
                            <Form.Control size="sm" className="no-margins" style={{fontSize:"0.75em", height:"0.5em", margin:"0em", textAlign:"center"}} onChange={e => updateName(ItemFilter.TagVal, e.target.value)} aria-label="Text input with checkbox" defaultValue={ItemFilter.TagVal.Val} placeholder=""/>
                        </InputGroup>
                    </div>
                    
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

const FilterMiscItem = (prop: any) => {
    const ItemFilter: FilterItem = prop.data
    const [_currentstate, returnactivetext] = useState(GetDisplayVal(ItemFilter));


    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterItems.tsx</div>}>
        <div className="col">
            <div className="centerPosition">
                <div className={"hovermouse quartermargin borderstyler basestructure filterbuttonitem" + (_currentstate == "" ? " bordergrey backgroundgrey" : _currentstate == "positive" ? " subbordergreen subbackgroundgreen" : " subborderred subbackgroundred")} onClick={() => SwitchStates(ItemFilter, returnactivetext)}>
                    {makestringpresentable(ItemFilter.Name)}
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}


export {FilterTextItem, FilterTagItem, FilterMiscItem, FilterRangeItem}