import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'

// Classes
import { makestringpresentable } from '../../../../utility/functions'
import { ErrorBoundary } from "react-error-boundary";
import { CollectionsListPage } from '../../../../classes/viewmodel/pages/CollectionListPage';
import { FilterManager } from '../../../../classes/viewmodel/collections/filters/FilterManager';
import { FilterText } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces';
import { InputGroup, Form, Button, Collapse } from 'react-bootstrap';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterBox = (prop: any) => {
    const ViewPageController: CollectionsListPage = prop.controller
    const FilterManagerObj: FilterManager = ViewPageController.FilterManager;
    const updatesearch = prop.runfunction;

    
    const [open, setOpen] = useState(false);

    function UpdateName( _filter : FilterText, newVal : string) {
        _filter.Val = newVal;
    }

    function ReturnTextFilterParam(_filter : FilterText) {
        return (            
            <div className="backgroundBgBase centered-div">
                <Form.Control 
                    onChange={e => UpdateName(_filter, e.target.value)} 
                    className='bordergrey' 
                    aria-label="Text input with checkbox" 
                    defaultValue={_filter.Val}
                    onKeyUp={(event) => {
                        if (event.key === "Enter") {
                            updatesearch();
                        }
                    }}/>
                <Button bsPrefix="empty" className="borderremove backgroundBgBase horizontalspacermed" onClick={() => updatesearch()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="colorBasicText size-strongtext"/>
                </Button>
            </div>
        )
    }

    function ReturnTextParam(_filter : FilterText) {
        return (            
            <div className="backgroundBgBase">
                <div className="colourBasicText size-subtitle">
                    {makestringpresentable(_filter.Group)}
                </div>
                <Form.Control 
                    onChange={e => UpdateName(_filter, e.target.value)} 
                    className='bordergrey' 
                    aria-label="Text input with checkbox" 
                    defaultValue={_filter.Val}/>
            </div>
        )
    }

    function ReturnFilterBoxInner() {
        return (
            <div className="totalmarginsml">
                <div>
                    {FilterManagerObj.ReturnTextFilters().filter((item) => (item.Group != 'name')).map((item) =>
                        <div key={item.Group}>
                            {ReturnTextParam(item)}
                        </div>)}
                </div>
            </div>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterBox.tsx</div>}>
            <div>
                <div>
                    {FilterManagerObj.ReturnTextFilters().filter((item) => (item.Group == 'name')).map((item) =>
                    <div key={item.Group}>
                        {ReturnTextFilterParam(item)}
                    </div>)}
                </div>
                <div>
                    <div className="verticalspacermed"/>
                    <div className="borderthin bordergrey">
                        <div onClick={() => {setOpen(!open)}} className={'centered-div size-strongtext font-default hovermouse colorBasicText centered-div borderbed bordergrey borderthin backgroundBgCard'}>
                            <div className={'totalmarginxsm font-seriftext'}>
                                {"Filters"}
                            </div>
                            <div className={'totalmarginxsm'}>
                                <FontAwesomeIcon icon={faFilter} className="colorBasicText"/>
                            </div>
                        </div>
                        <Collapse in={open}>
                            <div className={'container borderthin bordergrey'}>
                                <div className="content">                    
                                    {ReturnFilterBoxInner()}
                                </div>
                            </div>
                        </Collapse>    
                    </div>                                    
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterBox