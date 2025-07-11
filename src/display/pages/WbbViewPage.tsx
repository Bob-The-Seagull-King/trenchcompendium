import React, { useEffect, useState } from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { SumWarband, WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { useLocation } from 'react-router-dom';
import WarbandItemViewDisplay from '../components/features/saveitem/Warband/WarbandItemViewDisplay';
import {PrintModeProvider} from "../../context/PrintModeContext";
import PageMetaInformation from "../components/generics/PageMetaInformation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../components/generics/Loading-Overlay';
import { WarbandFactory } from '../../factories/warband/WarbandFactory';
import WbbItemView from './WbbItemView';

const WbbViewPage = (prop: any) => {
    
    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    const [_currentItem, returnItem] = useState<SumWarband | null>(null);
    const [emergency, setemergency] = useState<boolean>(false);
    const [keyval, setKeyVal] = useState(0);
    
    async function grabItemFromURL() {
        const CurItemID = urlSplits.slice(-1)[0]

        if (!isNaN(Number(CurItemID))) {
            const ItemCurrent = await WarbandFactory.GetWarbandPublicByID(Number(CurItemID))
            return ItemCurrent
        } else {
            return null;
        }
    }
    
    useEffect(() => {
        async function SetWarband() {
            const Item = await grabItemFromURL()
            setemergency(true)
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
                        <WbbItemView
                            warbandData={_currentItem}
                        />
                    </PrintModeProvider>
                </>
            }
            {_currentItem == null &&
                <div className={'LoadingOverlay-wrap-100vh'}>
                    {emergency == true &&
                        <LoadingOverlay
                            message={'Warband not found'}
                            override={true}
                        />
                    }
                    {emergency == false &&
                        <LoadingOverlay
                            message={'Loading your warband'}
                        />
                    }
                    
                </div>
            }
        </div>
    );
};

export default WbbViewPage;