import '../../resources/styles/vendor/bootstrap.css'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Item } from '../../classes/saveitems/item';
import WarbandItemViewDisplay from '../components/features/saveitem/WarbandItemViewDisplay';
import WarbandItemListDisplay from '../components/features/saveitem/WarbandItemListDisplay';
import { useLocation } from 'react-router-dom';

const ToolsSavedItem = (prop: any) => {
    const Manager = prop.manager;
    
    const [_currentItem, returnItem] = useState(grabItemFromURL);
    const [_keyval, returnkey] = useState(1);

    function grabItemFromURL() {
        const param = grabURL();

        const ItemCurrent = Manager.GetItemByName(param);
        
        return ItemCurrent
    }

    function UpdateItem(_Item : Item) {
        Manager.SetStorage();
        returnItem(_Item);
        returnkey(_keyval + 1);
    }

    function grabURL() {
        const urlPath = useLocation().pathname;
        const urlSplits = urlPath.split('/');
        console.log(urlSplits);
        let urlBuildParam = "";
        if (urlSplits.length >= 3) {
            urlBuildParam = urlSplits[2];
            if (urlBuildParam.length > 0) {
                return urlBuildParam;
            }
        }
        return urlBuildParam;
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ToolsSaveItem.tsx</div>}>
        <div className="container" style={{minWidth:"98%", marginLeft:"0.5rem", marginRight:"0.5rem"}}>
            {_currentItem != null &&
            <>
                <div>
                    <WarbandItemViewDisplay key={_keyval} data={_currentItem} updater={UpdateItem} manager={Manager}/>
                </div>
            </>
                
            }
            {_currentItem == null &&
                <WarbandItemListDisplay manager={Manager} updater={UpdateItem}/>
            }
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsSavedItem