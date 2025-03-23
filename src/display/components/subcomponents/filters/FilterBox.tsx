import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'

// Classes
import { makestringpresentable } from '../../../../utility/functions'
import { ErrorBoundary } from "react-error-boundary";
import { CollectionsListPage } from '../../../../classes/viewmodel/pages/CollectionListPage';
import { FilterManager } from '../../../../classes/viewmodel/collections/filters/FilterManager';
import { FilterText } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterBox = (prop: any) => {
    const ViewPageController: CollectionsListPage = prop.controller
    const FilterManagerObj: FilterManager = ViewPageController.FilterManager;
    const updatesearch = prop.runfunction;

    console.log()

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

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterBox.tsx</div>}>
            <div className="">
                {FilterManagerObj.ReturnTextFilters().filter((item) => (item.Group == 'name')).map((item) =>
                <div key={item.Group}>
                    {ReturnTextFilterParam(item)}
                </div>
                ) }
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterBox