import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import BasicButton from '../components/subcomponents/interactables/BasicButton';
import { useLocation } from 'react-router-dom';

const FilterableCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller
    ViewPageController.initCollection();

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const [_curItems, setCurItems] = useState(InitStateSet());
    const [_keyval, setKeyVal] = useState(0);
    const { state } = useLocation();

    function InitStateSet() {
        const SetItem = CollectionController.itemcollection;
        console.log(CollectionController.itemcollection);
        return SetItem;
    }


    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilteredDisplayCompendium.tsx</div>}>
            <div className="col-lg-6 col-md-12" key={_keyval}>
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
                                </div>
                            )) }
                        </div>
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterableCompendiumDisplay