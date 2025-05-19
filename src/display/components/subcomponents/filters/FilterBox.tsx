import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';

// Classes
import { makestringpresentable } from '../../../../utility/functions'
import { ErrorBoundary } from "react-error-boundary";
import { CollectionsListPage } from '../../../../classes/viewmodel/pages/CollectionListPage';
import { FilterManager } from '../../../../classes/viewmodel/collections/filters/FilterManager';
import { FilterItem, FilterRange, FilterTag, FilterText } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces';
import { InputGroup, Form, Button, Collapse } from 'react-bootstrap';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FilterTextItem } from './FilterItems';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../../pages/DisplayPageStatic';
import BasicButton from '../interactables/BasicButton';

const FilterBox = (prop: any) => {
    const ViewPageController: CollectionsListPage = prop.controller
    const FilterManagerObj: FilterManager = ViewPageController.FilterManager;
    const updatesearch = prop.runfunction;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]

    const [singleSelections, setSingleSelections] = useState<string[]>(DisplayPage.textboxOptions(ViewPageController));
    const [open, setOpen] = useState(false);

    function UpdateName( _filter : FilterText, newVal : string) {
        _filter.Val = newVal;
    }

    function ReturnTextFilterParam(_filter : FilterText) {
        return (            
            <div className="ReturnTextFilterParam ">
                <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name"
                    onInputChange={(text) => UpdateName(_filter, text)}
                    options={singleSelections}
                    placeholder={_filter.Val}
                    selected={undefined}                    
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            updatesearch();
                        }
                    }}
                    />
                <Button bsPrefix="empty" className="borderremove backgroundBgBase " onClick={() => updatesearch()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className=""/>
                </Button>
            </div>
        )
    }

    function ReturnFilterBoxInner() {
        return (
            <div className="ReturnFilterBoxInner">
                {DisplayPage.returnFilterSelect(FilterManagerObj, updatesearch, updatesearch)}
                <div className=""/>
                <div className="filterbuttoncomp">
                    <BasicButton btn_title={"Search"} btn_state={true} btn_press={updatesearch}/>
                </div>
            </div>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterBox.tsx</div>}>
            {(DisplayPage.hidefilter == undefined) &&
            <div className={'FilterBox'}>
                <div>
                    {FilterManagerObj.ReturnTextFilters().filter((item) => (item.Group == 'name')).map((item) =>
                    <div key={item.Group}>
                        {ReturnTextFilterParam(item)}
                    </div>)}
                </div>

                <div>
                    
                        <div className="borderthin bordergrey findme-1">
                            <div onClick={() => {setOpen(!open)}} className={'      borderbed bordergrey borderthin backgroundBgCard'}>
                                <div className={' font-seriftext'}>
                                    {"Filters"}
                                </div>
                                <div className={''}>
                                    <FontAwesomeIcon icon={faFilter} className=""/>
                                </div>
                            </div>
                            <Collapse in={open}>
                                <div className={'borderthin bordergrey findme-123'}>
                                    <div className="content">                    
                                        {ReturnFilterBoxInner()}
                                    </div>
                                </div>
                            </Collapse>    
                        </div> 
                                                       
                </div>
            </div>}
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterBox