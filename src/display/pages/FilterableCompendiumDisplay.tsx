import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import FilterBox from '../components/subcomponents/filters/FilterBox';

const FilterableCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller
    ViewPageController.initCollection();

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const [_curItems, setCurItems] = useState(InitStateSet());
    const [_keyval, setKeyVal] = useState(0);

    function InitStateSet() {
        const SetItem = CollectionController.itemcollection;
        return SetItem;
    }
    
    /**
     * Get the controller to update the search, then update
     * the state of the ability/item list arrays. Update the
     * keyval in order to force a rerender of elements.
     */
    function UpdateSearch() {
        ViewPageController.updateSearch();
        setCurItems(CollectionController.ReturnItems())
        setKeyVal(_keyval+1)
    }

    function ReturnFilters() {
        return (
            <FilterBox controller={ViewPageController} runfunction={UpdateSearch}/>
        )
    }

    function ReturnItems() {
        return (
            <div>
                <div className="verticalspacermed"/>
                {((_curItems == undefined) || (_curItems == null) || (_curItems.length == 0)) &&
                    <div className="">
                        <h1 className="">No Items Found</h1>
                        <div className="verticalspacermed"/>
                    </div>
                }
                {((_curItems != undefined) && (_curItems != null) && (_curItems.length > 0)) &&
                    <div className="">
                        {_curItems.map((item) => (
                            <div key={item.HeldItem.ID}>
                                {DisplayPage.returnDisplay(item.HeldItem)}
                                <div className="verticalspacermed"/>
                            </div>))}
                    </div>}
            </div>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilteredDisplayCompendium.tsx</div>}>
            <div className="col-lg-6 col-md-12">
                <div>
                    {ReturnFilters()}
                </div>
                <div  key={_keyval}>
                    {ReturnItems()}
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterableCompendiumDisplay