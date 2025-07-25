import React, { useEffect, useState } from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { SumWarband, WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { useLocation, useNavigate } from 'react-router-dom';
import WarbandItemViewDisplay from '../components/features/saveitem/Warband/WarbandItemViewDisplay';
import {PrintModeProvider} from "../../context/PrintModeContext";
import PageMetaInformation from "../components/generics/PageMetaInformation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../components/generics/Loading-Overlay';

const WbbEditPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;

    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const [_currentItem, returnItem] = useState<SumWarband | null>(null);
    const [keyval, setKeyVal] = useState(0);
    
    const navigate = useNavigate();

    function grabItemFromURL() {
        const CurItemID = urlSplits.slice(-1)[0]

        const ItemCurrent = Manager.GetItemByID(CurItemID);
        if (ItemCurrent == null ) {
            navigate(`/warband/view/${CurItemID}`)
        }
        return ItemCurrent
    }
    
    useEffect(() => {
        async function SetWarband() {
            await Manager.GetItemsAll();
            const Item = grabItemFromURL()
            returnItem(Item)
            setKeyVal((prev) => (prev + 1))
        }
        SetWarband();
    }, [state]);

    return (

        <div className={'WbbEditPage'} key={keyval}>
            {_currentItem != null &&
                <>
                    <PrintModeProvider>
                        <WbbEditView
                            warbandData={_currentItem}
                            manager={Manager}
                        />
                    </PrintModeProvider>
                </>
            }
            {_currentItem == null &&
                <div className={'LoadingOverlay-wrap-100vh'}>
                    <LoadingOverlay
                        message={'Loading your warband'}
                    />
                </div>
            }
        </div>
    );
};

export default WbbEditPage;