import React, { useEffect, useState } from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { useLocation } from 'react-router-dom';
import WarbandItemViewDisplay from '../components/features/saveitem/Warband/WarbandItemViewDisplay';

const WbbEditPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;

    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const [_currentItem, returnItem] = useState(grabItemFromURL);
    const [keyval, setKeyVal] = useState(0);
    
    function grabItemFromURL() {
        const CurItemID = urlSplits.slice(-1)[0]

        const ItemCurrent = Manager.GetItemByID(CurItemID);
        return ItemCurrent
    }
    
    useEffect(() => {
        returnItem(grabItemFromURL())
        setKeyVal((prev) => (prev + 1))
    }, [state]);

    return (

        <div className={'WbbEditPage'} key={keyval}>
            {_currentItem != null &&
                <>
                    <WbbEditView
                        warbandData={_currentItem}
                        manager={Manager}
                    />
                    <WarbandItemViewDisplay manager={Manager} data={_currentItem} updater={() => (console.log("NOTHING"))} />
                </>
            }
        </div>
    );
};

export default WbbEditPage;