import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'

// Classes
import { ErrorBoundary } from "react-error-boundary";
import { CollectionsListPage } from '../../../../classes/viewmodel/pages/CollectionListPage';
import { FilterManager } from '../../../../classes/viewmodel/collections/filters/FilterManager';
import { FilterItem, FilterRange, FilterTag, FilterText } from '../../../../classes/viewmodel/collections/filters/FilterInterfaces';
import { InputGroup, Form, Button, Collapse } from 'react-bootstrap';
import {faClose, faFilter, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../../pages/DisplayPageStatic';
import RulesCollapsibleContent from "../../rules-content/RulesCollapsibleContent";

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
            <div className="ReturnTextFilterParam">
                <InputGroup>
                    <Typeahead
                        id="basic-typeahead-single"
                        labelKey="name"
                        onInputChange={(text) => UpdateName(_filter, text)}
                        options={singleSelections}
                        placeholder={_filter.Val}
                        selected={[]}
                        onChange={(selected) => {
                            if (selected.length > 0) {
                                UpdateName(_filter, selected[0].toString()); // optional: update text filter value
                                updatesearch();

                                // DOM-based blur fallback
                                setTimeout(() => {
                                    const el = document.querySelector<HTMLInputElement>('.rbt input[type="text"]')
                                    el?.blur()
                                }, 0)
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                updatesearch();
                            }
                        }}
                    />

                    <Button
                        variant="secondary"
                        className="search-btn"
                        onClick={() => {
                            UpdateName(_filter, '');
                            updatesearch();
                        }}
                    >
                        <FontAwesomeIcon icon={faClose} className=""/>
                    </Button>
                </InputGroup>
            </div>
        )
    }

    function ReturnFilterBoxInner() {
        return (
            <div className="ReturnFilterBoxInner">
            {DisplayPage.returnFilterSelect(FilterManagerObj, updatesearch, updatesearch)}

                <Button variant="primary" onClick={updatesearch}>
                    Apply Filter
                </Button>
            </div>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilterBox.tsx</div>}>
            {(DisplayPage.hidefilter == undefined) &&
            <div className={'FilterBox'}>
                {FilterManagerObj.ReturnTextFilters().filter((item) => (item.Group == 'name')).map((item) =>
                    (
                        <React.Fragment key={item.Group}>
                            {ReturnTextFilterParam(item)}
                        </React.Fragment>
                    ))}

                <RulesCollapsibleContent
                    headline={'Filters'}
                    headlineIcon={faFilter}
                    content={ReturnFilterBoxInner()}
                />
            </div>}
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterBox