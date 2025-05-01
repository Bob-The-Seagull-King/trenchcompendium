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

const CollectionCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const [_curItems, setCurItems] = useState<any[]>([]);
    const [_keyval, setKeyVal] = useState(0);
    const [slugname, setslugname] = useState("Loading");
    
    useEffect(() => {
        async function SetCollectionOptions() {
            await ViewPageController.initCollection();
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

    function ReturnItems() {
        return (
            <>
                {((_curItems == undefined) || (_curItems == null) || (_curItems.length == 0)) &&
                    <h1 className="">{slugname}</h1>
                }
                {((_curItems != undefined) && (_curItems != null) && (_curItems.length > 0)) &&
                    <>                       
                       {DisplayPage.returnDisplay(_curItems)}
                    </>}
            </>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with FilteredDisplayCompendium.tsx</div>}>
            
                <div  key={_keyval}>
                    {ReturnItems()}
                </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default CollectionCompendiumDisplay