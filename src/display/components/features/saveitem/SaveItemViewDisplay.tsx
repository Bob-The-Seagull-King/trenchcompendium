import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import 'react-toastify/dist/ReactToastify.css';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { Item } from '../../../../classes/saveitems/item';
import { ItemManager } from '../../../../classes/saveitems/itemmanager';
import { Button } from 'react-bootstrap';

const SaveItemViewDisplay = (prop: any) => {
    const Manager : ItemManager = prop.manager;
    const ItemItem: Item = prop.data;
    const UpdateFunction = prop.updater;
    
    const ref = useRef<HTMLDivElement>(null);

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(ItemItem.ConvertToInterface(), null, 4)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = ItemItem.Title + ".json";
    
        link.click();
      };
      

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with SaveItemViewDisplay.tsx</div>}>
        <div>
            
            <div className="row">
                <div className="verticalspacerbig"/>
                <div className="verticalspacerbig"/>
            </div>

            <div className="row">        
                <span className="">
                    <Button className="colordefault no-padding" variant="" onClick={() => exportData()}>
                        <FontAwesomeIcon icon={faDownload} className="contentpacklabel no-margin"/>
                    </Button>
                </span>    
            </div>

            <div className="row">
                <div className="colordefault largefonttext centerPosition">
                        <div className="widecentertext">
                            {ItemItem.Title} 
                        </div>
                    </div>
            </div>
            <div className="row">
                <div className="verticalspacerbig"/>
                <div className="verticalspacerbig"/>
            </div> 
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SaveItemViewDisplay;