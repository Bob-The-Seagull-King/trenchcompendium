import React from 'react';
import WbbEditView from "../components/warband-builder/WbbEditView";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';

const WbbEditPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;
    
    return (

        <div className={'WbbEditPage'}>
            <WbbEditView
            />
        </div>
    );
};

export default WbbEditPage;