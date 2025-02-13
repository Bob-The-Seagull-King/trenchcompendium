import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveItemListDisplay from '../components/features/saveitem/SaveItemListDisplay';
import SaveItemViewDisplay from '../components/features/saveitem/SaveItemViewDisplay';
import { Item } from '../../classes/saveitems/item';

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
        const urlPath = window.location.pathname;
        const urlSplits = urlPath.split('/');
        let urlBuildParam = "";
        if (urlSplits.length >= 4) {
            urlBuildParam = urlSplits[3];
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
                    <SaveItemViewDisplay key={_keyval} data={_currentItem} updater={UpdateItem} manager={Manager}/>
                </div>
            </>
                
            }
            {_currentItem == null &&
                <SaveItemListDisplay manager={Manager} updater={UpdateItem}/>
            }
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsSavedItem