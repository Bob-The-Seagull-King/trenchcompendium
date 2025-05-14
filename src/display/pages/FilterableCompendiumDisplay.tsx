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
import { useLocation } from 'react-router-dom';
import {Equipment} from "../../classes/feature/equipment/Equipment";
import RulesEquipmentEntry from "../components/rules-content/RulesEquipmentEntry";
import {ModelCollection} from "../../classes/feature/model/ModelCollection";
import {Keyword} from "../../classes/feature/glossary/Keyword";

const FilterableCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    
    function grabItemFromURL() {
        const CurItemID = urlSplits.slice(-1)[0]
        return CurItemID;
    }
    
    // Initialize Use State
    const [_curItems, setCurItems] = useState<any[]>([]);
    const [_keyval, setKeyVal] = useState(0);  
    const [slugname, setslugname] = useState("Loading");  


    useEffect(() => {

        async function SetCollectionOptions() {
            if (DisplayPage.categoryparam && (grabItemFromURL() != ViewPageController.TypeName)) {
                const urlitem = grabItemFromURL();
                ViewPageController.FilterManager.ResetFilters();
                let FoundSet = false;

                for (let i = 0; i < ViewPageController.FilterManager.MiscOptions.length; i++) {
                    const option = ViewPageController.FilterManager.MiscOptions[i]

                    if (option.Group == DisplayPage.categoryparam) {
                        if (option.Name == urlitem) {
                            FoundSet = true;
                            option.DoInclude = true;
                            option.IsActive = true;
                        }
                    }
                }
                if (FoundSet) {
                    await ViewPageController.updateSearch();
                } else {
                    await ViewPageController.initCollection();                    
                }
            } else {
                await ViewPageController.initCollection();
            }
            setslugname("No Items Found")
            setCurItems(InitStateSet());
            setKeyVal((prev) => prev + 1);
        }

    
        SetCollectionOptions();
    }, []);

    function InitStateSet() {
        const SetItem = CollectionController.itemcollection;
        return SetItem;
    }
    
    /**
     * Get the controller to update the search, then update
     * the state of the ability/item list arrays. Update the
     * keyval in order to force a rerender of elements.
     */
    async function UpdateSearch() {
        await ViewPageController.updateSearch();
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
            <div className={'FilterableCompendiumDisplay'}>

                <div className="filter-items-wrap">
                    {_curItems.map((item) => (
                        <div className={'filter-item'} key={item.HeldItem.ID}>
                            <>
                                {DisplayPage.returnDisplay(item.HeldItem)}
                            </>
                        </div>))}
                </div>

            </div>
        )
    }


    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilteredDisplayCompendium.tsx</div>}>
            <>
                <div>
                    {ReturnFilters()}
                </div>
                <div  key={_keyval}>
                    {ReturnItems()}
                </div>
            </>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default FilterableCompendiumDisplay