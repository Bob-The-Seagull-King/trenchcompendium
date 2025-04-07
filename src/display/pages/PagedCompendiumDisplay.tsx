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
import RulesPageLinks from "../components/features/rules-content/RulesPageLinks";

const PagedCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller
    ViewPageController.initCollection();

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const [_curItem, setCurItem] = useState(InitStateSet());
    const [_keyval, setKeyVal] = useState(0);
    const [_canprev, setCanPrev] = useState(SetPrevButtonActive());
    const [_cannext, setCanNext] = useState(SetNextButtonActive());

    useEffect(() => {
        setCurItem(GetCurrentItem())
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(GetCurrentItem());
        SetButtonActive(IndexOfCur);
        setKeyVal(_keyval+1)
    }, [state]);

    function InitStateSet() {
        const SetItem = GetCurrentItem()
        return SetItem;
    }

    
    // Navigation
    const navigate = useNavigate(); 
    

    function SpecificNavigtateOut(item : any) {
        CollectionController.UpdateTargetItem(item);
        navigate('/compendium/' + DisplayPage.searchId + "/"+item.HeldItem.ID, {state: item.HeldItem.ID + Date.now().toString()});
    }

    function GetCurrentItem() {
        if (urlSplits.length > 3) {
            const CurItemID = urlSplits.slice(-1)
            for (let i = 0; i < CollectionController.itemcollection.length; i++) {
                if (CollectionController.itemcollection[i].HeldItem.ID == CurItemID) {                    
                    return CollectionController.itemcollection[i]
                }
            }
        }
        if (CollectionController.TargetItem == null) {
            return CollectionController.itemcollection[0]
        } else {
            return CollectionController.TargetItem;
        }
    }

    function GrabPrevItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        SpecificNavigtateOut(CollectionController.itemcollection[IndexOfCur - 1])
    }

    function GrabNextItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        SpecificNavigtateOut(CollectionController.itemcollection[IndexOfCur + 1])
    }

    function GetNextName() {
        const LengthOfList : number = CollectionController.itemcollection.length;
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);

        if (IndexOfCur < (LengthOfList-1)) {
            return CollectionController.itemcollection[IndexOfCur + 1].HeldItem.Name;
        } else {
            return "-"
        }
    }

    function GetPrevName() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);

        if (IndexOfCur > 0) {
            return CollectionController.itemcollection[IndexOfCur - 1].HeldItem.Name;
        } else {
            return "-"
        }
    }

    function SetButtonActive(newIndex : number) {
        const LengthOfList : number = CollectionController.itemcollection.length;

        if (newIndex <= 0) {
            setCanPrev(false);
        } else {setCanPrev(true)}
        if (newIndex < (LengthOfList - 1)) {
            setCanNext(true)
        } else {setCanNext(false)}
    }

    function SetPrevButtonActive() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);

        if (IndexOfCur <= 0) {
            return (false);
        } else {
            return (true)
        }   
    }

    function SetNextButtonActive() {
        const LengthOfList : number = CollectionController.itemcollection.length;
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);

        if (IndexOfCur < (LengthOfList - 1)) {
            return (true)
        } else {return (false)}
    }




    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PagedDisplayCompendium.tsx</div>}>
            <div className="paged-compendium-display" key={_keyval}>
                <div className={'rules-content-main'}>
                    {((_curItem == undefined) || (_curItem == null)) &&
                        <h1 className="">No Items Selected</h1>
                    }
                    {((_curItem != undefined) && (_curItem != null)) &&
                        <div className="">
                            {DisplayPage.returnDisplay(_curItem.HeldItem)}
                        </div>
                    }
                </div>

                {/* @TODO: this is the bottom links component */}
                <RulesPageLinks
                    prev_page={GrabPrevItem}
                    next_page={GrabNextItem}
                    prev_name={GetPrevName()}
                    next_name={GetNextName()}
                />
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default PagedCompendiumDisplay