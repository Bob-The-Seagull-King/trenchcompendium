import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import 'react-toastify/dist/ReactToastify.css';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
import { WarbandManager } from '../../../../classes/saveitems/WarbandManager';
import { WarbandContentItem } from '../../../../classes/saveitems/WarbandContentItem';

const WarbandItemViewDisplay = (prop: any) => {
    const Manager : WarbandManager = prop.manager;
    const WarbandItem: WarbandContentItem = prop.data;
    const UpdateFunction = prop.updater;
    
    const ref = useRef<HTMLDivElement>(null);

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(WarbandItem.ConvertToInterface(), null, 4)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = WarbandItem.Title + ".json";
    
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
                            {WarbandItem.Title} 
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

export default WarbandItemViewDisplay;