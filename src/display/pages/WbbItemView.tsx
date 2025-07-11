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

const WbbItemView = (prop: any) => {
    
    const Warband : SumWarband = prop.warbandData;

    return (

        <div >
            {Warband.warband_data.GetTrueName()}
        </div>
    );
};

export default WbbItemView;