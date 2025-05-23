import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'
import BasicButton from '../components/subcomponents/interactables/BasicButton';
import { useLocation, useNavigate } from 'react-router-dom';
import RulesPageLinks from "../components/rules-content/RulesPageLinks";

const PagedCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    console.log(ViewPageController.TypeName)
    // Initialize Use State
    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const [_curItem, setCurItem] = useState<any>(null);
    const [_keyval, setKeyVal] = useState(0);
    const [slugname, setslugname] = useState("Loading");
    
    useEffect(() => {
        async function SetCollectionOptions() {
            await ViewPageController.initCollection();
            setslugname("No Items Found")
            setCurItem(InitStateSet());
            setKeyVal((prev) => prev + 1);
        }
    
        SetCollectionOptions();
    }, []);

    useEffect(() => {
        setCurItem(null)
        setCurItem(GetCurrentItem())
        setKeyVal(_keyval+1)
    }, [state]);

    function InitStateSet() {
        const SetItem = GetCurrentItem()
        return SetItem;
    }
    

    function GetCurrentItem() {  
        console.log("TEST A ")     
        if (urlSplits.length > 3) {
            const CurItemID = (ViewPageController.TypeName != 'faction')? urlSplits.slice(urlSplits.length-1)[0] : urlSplits.slice(3)[0]
            
            console.log("TEST B " + CurItemID)
            for (let i = 0; i < CollectionController.itemcollection.length; i++) {
                if (CollectionController.itemcollection[i].HeldItem.ID == CurItemID) {   
                    console.log("TEST C " + CurItemID)                 
                    return CollectionController.itemcollection[i]
                }
            }
        }  
        console.log("TEST D ")     
        if (DisplayPage.defaultpage) {
            return null;
        }
        console.log("TEST E ")     
        if (CollectionController.TargetItem == null) {
            return CollectionController.itemcollection[0]
        } else {
            console.log("TEST F ")     
            return CollectionController.TargetItem;
        }
    }

    function GrabPrevItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        return (CollectionController.itemcollection[IndexOfCur - 1])
    }

    function GrabNextItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        return (CollectionController.itemcollection[IndexOfCur + 1])
    }


    const navigate = useNavigate(); 

    function SpecificNavigtateOut(item : any) {
        if (item != undefined) {
            CollectionController.UpdateTargetItem(item);
            navigate('/compendium/'+ DisplayPage.searchId + "/" + (item.HeldItem.ID), {state: Date.now().toString()});
        }
    }


    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PagedDisplayCompendium.tsx</div>}>
            <div className="PagedCompendiumDisplay" key={_keyval}>
                <div className={'rules-content-main'}>
                    {((_curItem == null) && (DisplayPage.defaultpage)) &&
                        <>
                            {DisplayPage.defaultpage(ViewPageController)}
                        </>
                    }
                    {(((_curItem == undefined) || (_curItem == null)) && (!DisplayPage.defaultpage)) &&
                        <h1 className="">{slugname}</h1>
                    }
                    {((_curItem != undefined) && (_curItem != null)) &&
                        <div className="">
                            {DisplayPage.returnDisplay(_curItem.HeldItem)}
                        </div>
                    }
                </div>

                <RulesPageLinks
                    prev_page={GrabPrevItem()}
                    next_page={GrabNextItem()}
                    display_path={'compendium/' + DisplayPage.searchId + "/"}
                    func={SpecificNavigtateOut}
                />
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default PagedCompendiumDisplay