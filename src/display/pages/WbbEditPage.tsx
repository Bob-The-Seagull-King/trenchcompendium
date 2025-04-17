import React, { useEffect, useState } from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { useLocation } from 'react-router-dom';
import { UserWarband } from '../../classes/saveitems/Warband/UserWarband';

interface WbbEditPageProps {
    manager: WarbandManager;
}

const WbbEditPage: React.FC<WbbEditPageProps> = ({ manager }) => {
    const { state } = useLocation();
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');

    const [_currentItem, setCurrentItem] = useState<UserWarband | null>(grabItemFromURL);
    const [keyval, setKeyVal] = useState(0);

    function grabItemFromURL(): UserWarband | null {
        const CurItemID = urlSplits.slice(-1)[0];
        const ItemCurrent = manager.GetItemByID(CurItemID);
        return ItemCurrent ?? null;
    }

    useEffect(() => {
        setCurrentItem(grabItemFromURL());
        setKeyVal((prev) => prev + 1);
    }, [state]);

    return (
        <div className={'WbbEditPage'} key={keyval}>
            <WbbEditView warbandData={_currentItem} />
        </div>
    );
};

export default WbbEditPage;
