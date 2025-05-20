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


const FilterTagSet = (prop: any) => {
    const ItemFilter: FilterTag[] = prop.data
    const ItemName : string = prop.name;

    const [selectedValue, setSelectedValue] = useState<string | null>(null)

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value

        if (value === 'show_all') {
            setSelectedValue(null)
            ItemFilter.forEach((item) => {
                item.TagType.IsActive = true
                item.TagType.DoInclude = true
            })
        } else {
            setSelectedValue(value)
            ItemFilter.forEach((item) => {
                item.TagType.IsActive = item.TagType.Name === value
                item.TagType.DoInclude = item.TagType.Name === value
            })
        }
    }
    return (
        <div className={'FilterTagSet'}>
            <Form.Group controlId={ItemName + '-select'} className={'mb-3'}>
                <Form.Label>{'Choose ' + ItemName}</Form.Label>
                <Form.Select
                    value={selectedValue ?? 'show_all'}
                    onChange={handleSelectChange}
                >
                    <option value="show_all">Show All</option>

                    {ItemFilter.map((item) => (
                        <option value={item.TagType.Name} key={"ItemName + '-option'" + item.TagType.Name}>
                            {makestringpresentable(item.TagType.Name)}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>
    )
}


const FilterMiscSet = (prop: any) => {
    const ItemFilter: FilterItem[] = prop.data
    const ItemName : string = prop.name;
        
    const toggleRef = useRef<HTMLButtonElement>(null);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === 'show_all') {
            setSelectedValue(null); // ← Important

            ItemFilter.forEach((item) => {
                item.IsActive = true;
                item.DoInclude = true;
            });


        } else {
            setSelectedValue(value);
            ItemFilter.forEach((item) => {
                item.IsActive = item.Name === value;
                item.DoInclude = item.Name === value;
            });
        }
    };


    return (
        <div className={'FilterMiscSet'}>
            <Form.Group controlId={ItemName + '-select'} className={'mb-3'}>
                <Form.Label>{'Choose ' + ItemName}</Form.Label>
                <Form.Select
                    value={selectedValue ?? 'show_all'}
                    onChange={handleSelectChange}
                >
                    <option value="show_all">Show All</option>

                    {ItemFilter.map((item) => (
                        <option value={item.Name} key={"ItemName + '-option'" + item.Name}>
                            {makestringpresentable(item.Name)}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
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


export {FilterTextItem, FilterMiscItem, FilterRangeItem, FilterTagSet, FilterMiscSet}