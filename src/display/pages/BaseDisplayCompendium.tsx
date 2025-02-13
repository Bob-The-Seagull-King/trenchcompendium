import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import ViewTableItemDisplay from '../../display/components/subcomponents/list/ViewTableItemDisplay'
import BaseFilterSelectDisplay from '../../display/components/subcomponents/filters/BaseFilterSelectDisplay'
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'

const BaseDisplayCompendium = (prop: any) => {
    // Initialize controllers and managers
    const ViewPageController: CollectionsListPage = prop.controller
    ViewPageController.initCollection();

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    // Initialize Use State
    const [_activeItems, returnstate] = useState(CollectionController.ObjectList);
    const [_foundItems, returntable] = useState(CollectionController.itemcollection);
    const [_keyval, updatekey] = useState(1);
    
    const [stateWidth, setWidth] = useState(window.innerWidth);

    
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const setContentPackWidth = () => {
            if(ref.current) {
                setWidth(ref.current.clientWidth);
                updatekey(_keyval + 1);
            }
        }
        window.addEventListener("load", setContentPackWidth, false);
        window.addEventListener("resize", setContentPackWidth, false);
        setContentPackWidth();
    }, [])
    

    let listcolourval = 0;

    // Functions -----------------------------------------------------------------------------------

    /**
     * @return the current colour value + 1
     */
    function getcolor() {
        listcolourval += 1;
        return listcolourval;
    }

    /**
     * Update state of the list of abilities currently active
     */
    function ItemRecall() {
        returnstate(CollectionController.ReturnObjects())
    }

    /**
     * Get the controller to update the search, then update
     * the state of the ability/item list arrays. Update the
     * keyval in order to force a rerender of elements.
     */
    function UpdateSearch() {
        ViewPageController.updateSearch();
        returntable(CollectionController.ReturnItems())
        returnstate(CollectionController.ReturnObjects())
        updatekey(_keyval+1)
    }

    function returnFilterDOM() {
        return (
            <>
            <div className="col-12">
                                <div className="row">
                                    <div className='col-12'>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-12'>
                                        <BaseFilterSelectDisplay controller={ViewPageController} runfunction={UpdateSearch}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-12'>
                                        <br/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-12'>
                                        <div className='borderstyler borderdefault no-padding '>
                                            {_foundItems.length == 0 && 
                                                <div className="">
                                                    <h1 className="subtletext">No {ViewPageController.Collection.CollectionType.pageName} Found</h1>
                                                </div>
                                            }
                                            {_foundItems.map((item) => (
                                                <div className="col-12 my-0 py-0 no-margin" key={"tableItemDisplay"+item.HeldItem.ID+(_keyval.toString())}>
                                                    <ViewTableItemDisplay key={"tableItemDisplay"+item.HeldItem.ID+(_keyval.toString())} data={item} parent={CollectionController} statefunction={ItemRecall} positionid={getcolor}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
            </>
        )
    }

    function returnItemDOM() {
        return (
            <>
            <div className="col-12">
                                <div className="row">
                                    <div className='col-12'>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-12'>
                                        {_activeItems.length == 0 &&
                                            <div className="">
                                                <div className='borderstyler subbordergrey emptyboxStructure'>
                                                    <h1 className="subtletext">No Items Selected</h1>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                                    {_activeItems.map((item) => (
                                        <div className="col" key={"itemDisplay"+item.ID}>
                                            {DisplayPage.returnDisplay(item)}
                                            <br/>
                                        </div>
                                    ))}
                                </div>
                            </div>
            </>
        )
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with BaseDisplayCompendium.tsx</div>}>
        <div className="container" ref={ref} key={_keyval} style={{maxWidth:"100%"}}>
            <div className="row">
                {/* Display the filters and abilities which match the filters, if any. */}
                <div className={"col-lg-" + (12-DisplayPage.width) + " col-md-" + (12-DisplayPage.width) + " col-sm-12 col-xs-12 col-12 my-0 py-0"}>
                    {stateWidth > 700 &&
                        <div className="row p-3 overflow-auto flex-grow-1">
                            <div className="height80">
                            {returnFilterDOM()}
                            </div>
                        </div>
                    }
                    {stateWidth <= 700 &&
                        <div className="row"> 
                                {returnFilterDOM()}
                        </div>
                    }
                </div>
                {stateWidth <= 700 &&
                    <>
                        <div className="verticalspacerbig"/>
                        <div className="verticalspacerbig"/>
                        <div className="verticalspacerbig"/>
                        <div className="verticalspacerbig"/>
                    </>
                }
                {/* Display the selected abilities, if any */}
                <div className={"col-lg-" + (DisplayPage.width) + " col-md-" + (DisplayPage.width) + " col-sm-12 col-xs-12 col-12"}>
                    
                {stateWidth > 700 &&
                    <div className="row p-3 overflow-auto flex-grow-1">
                        <div className="height80">
                            {returnItemDOM()}
                        </div>
                    </div>
                }
                {stateWidth <= 700 &&
                    <div className="row">                        
                        {returnItemDOM()}
                    </div>
                }
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default BaseDisplayCompendium