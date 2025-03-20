import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { makestringpresentable } from '../../../utility/functions';
import { ViewCollectionsModel } from '../../../classes/viewmodel/collections/ViewCollectionsModel';
import { CollectionsListPage } from '../../../classes/viewmodel/pages/CollectionListPage';
import { DisplayCollectionType, DisplayCollectionDataDex } from '../../pages/DisplayPageStatic';
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from './PalleteSwap';

const CompendiumMenuItem = (prop: any) => {
    
    const ViewPageController: CollectionsListPage = prop.controller
    const StyleType : number = prop.bordertype;

    const CollectionController: ViewCollectionsModel = ViewPageController.Collection;
    const DisplayPage: DisplayCollectionType = DisplayCollectionDataDex[ViewPageController.TypeName]
    
    if (DisplayPage.menushowitems == true) {        
        ViewPageController.initCollection();
    }
    
    // Navigation
    const navigate = useNavigate(); 
    
    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateOut() {
        navigate('/compendium/' + DisplayPage.searchId);
    }

    function SpecificNavigtateOut(item : any) {
        CollectionController.UpdateTargetItem(item);
        navigate('/compendium/' + DisplayPage.searchId, {state: item.HeldItem.ID});
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>
            <>
            {DisplayPage.menushowitems == true &&
                <GenericCollapsableBlockDisplay 
                d_name={DisplayPage.titlename} 
                d_colour={"grey"} 
                d_state={false}  
                d_border={false}
                bordertype={0}
                d_method={() => (
                    <div className={"backgroundBgBase borderthin bordergrey"}>
                    {CollectionController.itemcollection.map((item) => (
                        <div key={item.HeldItem.ID} onClick={() => SpecificNavigtateOut(item)} className={'align-left-right font-default hovermouse colorBasicText centered-div '}>
                            <div className='totalmarginsml horizontalspacermed'>
                                {item.HeldItem.Name}
                            </div>
                        </div>
                        ))
                    }
                    </div>
                )} />
            }
            {DisplayPage.menushowitems == false &&
                <div onClick={() => NavigateOut()} className={'align-left-right size-strongtext font-default hovermouse colorBasicText centered-div backgroundBgBase bordergrey borderthin'}>
                    <div className='totalmarginmed'>
                        {DisplayPage.titlename}
                    </div>
                </div>
            }                
            </>
        </ErrorBoundary>
    );
}

export default CompendiumMenuItem

