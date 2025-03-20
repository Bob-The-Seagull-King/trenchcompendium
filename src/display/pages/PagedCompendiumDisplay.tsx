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

const PagedCompendiumDisplay = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller
    ViewPageController.initCollection();

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const [_curItem, setCurItem] = useState(InitStateSet());
    const [_keyval, setKeyVal] = useState(0);
    const [_canprev, setCanPrev] = useState(SetPrevButtonActive());
    const [_cannext, setCanNext] = useState(SetNextButtonActive());
    const { state } = useLocation();

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

    function GetCurrentItem() {
        if (CollectionController.TargetItem == null) {
            return CollectionController.itemcollection[0]
        } else {
            return CollectionController.TargetItem;
        }
    }

    function GrabPrevItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        setCurItem(CollectionController.itemcollection[IndexOfCur - 1])
        SetButtonActive(IndexOfCur - 1);
        setKeyVal(_keyval+1)
    }

    function GrabNextItem() {
        const IndexOfCur : number = CollectionController.itemcollection.indexOf(_curItem);
        setCurItem(CollectionController.itemcollection[IndexOfCur + 1])
        SetButtonActive(IndexOfCur + 1);
        setKeyVal(_keyval+1)
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
            <div className="col-lg-6 col-md-12" key={_keyval}>
                <div>
                    <div className="verticalspacermed"/>
                    <div className="align-left-right">
                        <div className="col-5">
                            <BasicButton btn_title={GetPrevName()} btn_state={_canprev} btn_press={GrabPrevItem}/>
                        </div>
                        <div className="col-5">
                            <BasicButton btn_title={GetNextName()} btn_state={_cannext} btn_press={GrabNextItem}/>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="verticalspacermed"/>
                    {((_curItem == undefined) || (_curItem == null)) &&
                        <div className="">
                            <h1 className="">No Items Selected</h1>
                        </div>
                    }
                    {((_curItem != undefined) && (_curItem != null)) &&
                        <div className="">
                            {DisplayPage.returnDisplay(_curItem.HeldItem)}
                        </div>
                    }
                </div>
                <div>
                    <div className="verticalspacermed"/>
                    <div className="align-left-right">
                        <div className="col-5">
                            <BasicButton btn_title={GetPrevName()} btn_state={_canprev} btn_press={GrabPrevItem}/>
                        </div>
                        <div className="col-5">
                            <BasicButton btn_title={GetNextName()} btn_state={_cannext} btn_press={GrabNextItem}/>
                        </div>
                    </div>
                    <div className="verticalspacermed"/>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default PagedCompendiumDisplay