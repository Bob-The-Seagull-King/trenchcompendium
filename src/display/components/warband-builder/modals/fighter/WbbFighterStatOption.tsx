import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faPen, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { makestringpresentable } from '../../../../../utility/functions';
import { GetStatAsFullString, ModelStatistics } from '../../../../../classes/feature/model/ModelStats';
import { RealWarbandPurchaseModel } from '../../../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { useWarband } from '../../../../../context/WarbandContext';
import { ToolsController } from '../../../../../classes/_high_level_controllers/ToolsController';
import WbbEditFighterStatProfile from './WbbEditFighterStatProfile';

interface WbbEditFighterStatOptionProps {
    fighter : RealWarbandPurchaseModel;
    options : ModelStatistics[];
}

const WbbEditFighterStatOption: React.FC<WbbEditFighterStatOptionProps> = ({
                                                                       fighter,
                                                                       options
                                                                   }) => {

    const {warband, updateKey, reloadDisplay } = useWarband();
    const [showStatModal, setShowStatModal] = useState(false);
    const [currentstat, setcurrentstat] = useState<ModelStatistics | null>(null);

    const handleStatUpdate = (newstat: ModelStatistics) => {
        fighter.model.UpdateStatOption(newstat, currentstat);
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(() => reloadDisplay())
    };
    
    useEffect(() => {
        for (let i = 0; i < fighter.model.Stat_Selections.length; i++) {
            for (let j = 0; j < options.length; j++) {
                if (GetStatAsFullString(fighter.model.Stat_Selections[i]) == GetStatAsFullString(options[j])) {
                    setcurrentstat(fighter.model.Stat_Selections[i])
                }
            }
        }
    }, [updateKey]);



    return (
        <>

            <div className={'fighter-status'}>
                <div className={'fighter-status-string'}>
                    {currentstat? GetStatAsFullString(currentstat) : "-"}
                </div>

                <div className={'btn btn-primary'} onClick={() => setShowStatModal(true)}>
                    <FontAwesomeIcon icon={faPen} className={'icon-inline-left-l'}/>

                    {'Change'}
                </div>
            </div>

            
            <WbbEditFighterStatProfile
                show={showStatModal}
                fighter={fighter}
                onClose={() => setShowStatModal(false)}
                currentStatus={currentstat} 
                options={options}
                onSubmit={handleStatUpdate}
            />
        </>
    );
};

export default WbbEditFighterStatOption;
