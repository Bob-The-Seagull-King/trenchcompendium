import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewCollectionsModel } from '../../classes/viewmodel/collections/ViewCollectionsModel'
import { CollectionsListPage } from '../../classes/viewmodel/pages/CollectionListPage'

// Components
import ViewTableItemDisplay from '../../display/components/subcomponents/list/ViewTableItemDisplay'
import BaseFilterSelectDisplay from '../../display/components/subcomponents/filters/BaseFilterSelectDisplay'
import { DisplayCollectionDataDex, DisplayCollectionType } from './DisplayPageStatic'

const AllDisplayNoFilterCompendium = (prop: any) => {
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
    
    const [open, setOpen]   = useState(true);

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
                                        {_foundItems.length == 0 &&
                                            <div className="">
                                                <div className='borderstyler subbordergrey emptyboxStructure'>
                                                    <h1 className="subtletext">No Items Selected</h1>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sx-1 row-cols-xs-1 row-cols-1">
                                    {_foundItems.map((item) => (
                                        <div className="col" key={"itemDisplay"+item.ID}>
                                            {DisplayPage.returnDisplay(item)}
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
            
            <div className="row justify-content-center">
                {/* Display the filters and abilities which match the filters, if any. */}
                
                
                
                {/* Display the selected abilities, if any */}
                <div className={"col-lg-" + (DisplayPage.width+(open? 0 : (12-DisplayPage.width))) + " col-md-" + (DisplayPage.width+(open? 0 : (12-DisplayPage.width))) + " col-sm-12 col-xs-12 col-12"}>
                    
                    <div className="row">                        
                        {returnItemDOM()}
                    </div>
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default AllDisplayNoFilterCompendium