import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useState, useRef } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Classes
import { FilterText, FilterItem, FilterTag, FilterRange } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces'
import { makestringpresentable } from '../../../../utility/functions'
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { faChevronDown, faRefresh, faSquareMinus, faSquarePlus, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
function UpdateName(item : FilterText, value: string) {
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
            <div className="backgroundBgBase">
                <div className="colourBasicText size-subtitle">
                    {makestringpresentable(ItemFilter.Group)}
                </div>
                <Form.Control 
                    onChange={e => UpdateName(ItemFilter, e.target.value)} 
                    className='bordergrey' 
                    aria-label="Text input with checkbox" 
                    defaultValue={ItemFilter.Val}/>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

const FilterRangeItem = (prop: any) => {
    const ItemFilter: FilterRange = prop.data


    const lowerRef = useRef<HTMLInputElement>(null);
    const upperRef = useRef<HTMLInputElement>(null);

    const [_keyval, setkeyval] = useState(0);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

    function resetRangeLower(item : FilterRange) {
        item.Lower = item.Set_Lower;
        if (lowerRef != null) {
            if (lowerRef.current) {
                lowerRef.current.value = item.Set_Lower.toString();
            }
        }
        setkeyval(_keyval + 1);
    }

    function resetRangeUpper(item : FilterRange) {
        item.Upper = item.Set_Upper;
        if (upperRef != null) {
            if (upperRef.current) {
                upperRef.current.value = item.Set_Upper.toString();
            }
        }
        setkeyval(_keyval + 1);
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
            <Dropdown 
                bsPrefix="empty" 
                autoClose="outside"
                onToggle={(isOpen) => {
                    if (isOpen && toggleRef.current) {
                    setMenuWidth(toggleRef.current.getBoundingClientRect().width);
                    }
                }}>
                <Dropdown.Toggle ref={toggleRef} bsPrefix="empty" id="dropdown-basic" className="bordergrey borderthin buttonclean">
                    <div className="">
                        <div className="backgroundBgBase borderthin bordergrey findme-filter1">
                            <div className="align-left ">
                                {makestringpresentable(ItemFilter.Group)}
                            </div>
                        </div>
                        <div className="backgroundBgCard borderthin bordergrey ">
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="" style={{ width: menuWidth }}>
                    <div className=" ">
                        <div>
                            <div className="colourBasicText">
                                {"Min"}
                            </div>
                            <div className="">
                                <Form.Control 
                                    onChange={e => updateLower(ItemFilter, parseInt(e.target.value))} 
                                    className='bordergrey' 
                                    type="number"
                                    aria-label="Text input with checkbox" 
                                    defaultValue={ItemFilter.Set_Lower}
                                    ref={lowerRef}/>
                                <FontAwesomeIcon className="colourBasicText  " onClick={() => resetRangeLower(ItemFilter)} icon={faRefresh}/>
                            </div>

                        </div>
                        <div>
                            <div className="colourBasicText">
                                {"Max"}
                            </div>
                            <div className="">
                                <Form.Control 
                                    onChange={e => updateUpper(ItemFilter, parseInt(e.target.value))} 
                                    className='bordergrey' 
                                    type="number"
                                    aria-label="Text input with checkbox" 
                                    defaultValue={ItemFilter.Set_Upper}
                                    ref={upperRef}/>
                                <FontAwesomeIcon className="colourBasicText  " onClick={() => resetRangeUpper(ItemFilter)} icon={faRefresh}/>
                            </div>
                        </div>

                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </ErrorBoundary>
    )
    // -------------------------------------------
}


const FilterItemSet = (prop: any) => {
    const ItemFilter: FilterItem[] = prop.data
    const ItemName : string = prop.name;

    return (
        <div>
            <Dropdown bsPrefix="empty">
                <Dropdown.Toggle bsPrefix="empty" id="dropdown-basic">
                    {ItemName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}


const FilterTagSet = (prop: any) => {
    const ItemFilter: FilterTag[] = prop.data
    const ItemName : string = prop.name;
        
    const toggleRef = useRef<HTMLButtonElement>(null);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

    return (
        <div>
            <Dropdown 
                bsPrefix="empty" 
                autoClose="outside"
                onToggle={(isOpen) => {
                    if (isOpen && toggleRef.current) {
                    setMenuWidth(toggleRef.current.getBoundingClientRect().width);
                    }
                }}>
                <Dropdown.Toggle ref={toggleRef} bsPrefix="empty" id="dropdown-basic" className="bordergrey borderthin buttonclean">
                    <div className="">
                        <div className="backgroundBgBase borderthin bordergrey">
                            <div className="align-left ">
                                {ItemName}
                            </div>
                        </div>
                        <div className="backgroundBgCard borderthin bordergrey ">
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="" style={{ width: menuWidth }}>
                    {ItemFilter.map((item) => (
                        <div key={item.TagType.Name}>
                            {ItemFilter.indexOf(item) != 0 &&
                            <div className="backgroundgrey "/>
                            }
                            <TagSelectItem  data={item}/>
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

const TagSelectItem = (prop : any) => {
    const ItemFilter: FilterTag = prop.data

    const [keyval, setkeyval] = useState(0);

    function SetToFalse() {
        ItemFilter.TagType.IsActive = true;
        ItemFilter.TagType.DoInclude = false;
        setkeyval(keyval + 1);
    }

    function SetToTrue() {
        ItemFilter.TagType.IsActive = true;
        ItemFilter.TagType.DoInclude = true;
        setkeyval(keyval + 1);
    }

    function SetToOff() {
        ItemFilter.TagType.IsActive = false;
        setkeyval(keyval + 1);
    }

    return (
        <div className="  ">
            <div className="">
                {makestringpresentable(ItemFilter.TagType.Name)}  
            </div>
            <div className="size-subtitle " key={keyval}>
                <FontAwesomeIcon icon={faSquareXmark} onClick={() => SetToFalse()} className={" " + (((ItemFilter.TagType.DoInclude == false) && (ItemFilter.TagType.IsActive == true))? "" : " lowopacity" )}/>
                <FontAwesomeIcon icon={faSquareMinus} onClick={() => SetToOff()} className={" colorgrey" + (((ItemFilter.TagType.IsActive == false))? "" : " lowopacity" )}/>
                <FontAwesomeIcon icon={faSquarePlus} onClick={() => SetToTrue()} className={" " + (((ItemFilter.TagType.DoInclude == true) && (ItemFilter.TagType.IsActive == true))? "" : " lowopacity" )}/>
            </div>
        </div>
    )
}


const FilterMiscSet = (prop: any) => {
    const ItemFilter: FilterItem[] = prop.data
    const ItemName : string = prop.name;
        
    const toggleRef = useRef<HTMLButtonElement>(null);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

    return (
        <div>
            <Dropdown 
                bsPrefix="empty" 
                autoClose="outside"
                onToggle={(isOpen) => {
                    if (isOpen && toggleRef.current) {
                    setMenuWidth(toggleRef.current.getBoundingClientRect().width);
                    }
                }}>
                <Dropdown.Toggle ref={toggleRef} bsPrefix="empty" id="dropdown-basic" className="bordergrey borderthin buttonclean">
                    <div className="">
                        <div className="backgroundBgBase maxwidth borderthin bordergrey">
                            <div className="align-left ">
                                {ItemName}
                            </div>
                        </div>
                        <div className="backgroundBgCard borderthin bordergrey ">
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="" style={{ width: menuWidth }}>
                    {ItemFilter.map((item) => (
                        <div key={item.Name}>
                            {ItemFilter.indexOf(item) != 0 &&
                            <div className="backgroundgrey"/>
                            }
                            <TagSelectMisc  data={item}/>
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

const TagSelectMisc = (prop : any) => {
    const ItemFilter: FilterItem = prop.data

    const [keyval, setkeyval] = useState(0);

    function SetToFalse() {
        ItemFilter.IsActive = true;
        ItemFilter.DoInclude = false;
        setkeyval(keyval + 1);
    }

    function SetToTrue() {
        ItemFilter.IsActive = true;
        ItemFilter.DoInclude = true;
        setkeyval(keyval + 1);
    }

    function SetToOff() {
        ItemFilter.IsActive = false;
        setkeyval(keyval + 1);
    }

    return (
        <div className="  ">
            <div className="">
                {makestringpresentable(ItemFilter.Name)}  
            </div>
            <div className="size-subtitle " key={keyval}>
                <FontAwesomeIcon icon={faSquareXmark} onClick={() => SetToFalse()} className={" " + (((ItemFilter.DoInclude == false) && (ItemFilter.IsActive == true))? "" : " lowopacity" )}/>
                <FontAwesomeIcon icon={faSquareMinus} onClick={() => SetToOff()} className={" colorgrey" + (((ItemFilter.IsActive == false))? "" : " lowopacity" )}/>
                <FontAwesomeIcon icon={faSquarePlus} onClick={() => SetToTrue()} className={" " + (((ItemFilter.DoInclude == true) && (ItemFilter.IsActive == true))? "" : " lowopacity" )}/>
            </div>
        </div>
    )
}

const FilterMiscItem = (prop: any) => {
    const ItemFilter: FilterItem = prop.data
    const [_currentstate, returnactivetext] = useState(GetDisplayVal(ItemFilter));

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterItems.tsx</div>}>
        <div className="col">
            <div className="centerPosition">
                <div className={" quartermargin borderstyler basestructure filterbuttonitem" + (_currentstate == "" ? " bordergrey backgroundgrey" : _currentstate == "positive" ? " " : " sub ")} onClick={() => SwitchStates(ItemFilter, returnactivetext)}>
                    {makestringpresentable(ItemFilter.Name)}
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}


export {FilterTextItem, FilterMiscItem, FilterRangeItem, FilterItemSet, FilterTagSet, FilterMiscSet}