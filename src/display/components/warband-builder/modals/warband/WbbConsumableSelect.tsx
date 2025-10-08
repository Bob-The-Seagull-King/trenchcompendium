import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import { IChoice } from '../../../../../classes/options/StaticOption';
import WbbOptionBox from '../../WbbOptionBox';
import WbbEditSelectionModal from './WbbEditSelectionModal';
import { useWarband } from '../../../../../context/WarbandContext';
import { ToolsController } from '../../../../../classes/_high_level_controllers/ToolsController';
import { WarbandProperty } from '../../../../../classes/saveitems/Warband/WarbandProperty';
import { EventRunner } from '../../../../../classes/contextevent/contexteventhandler';
import { WarbandConsumable } from '../../../../../classes/saveitems/Warband/WarbandConsumable';
import { ContextObject } from '../../../../../classes/contextevent/contextobject';
import WbbEditConsumableModal from './WbbEditConsumableModal';

interface WbbEditSelectionProps {
    property : WarbandConsumable;
    dochange: boolean;
}

const WbbConsumableSelect: React.FC<WbbEditSelectionProps> = ({property, dochange}) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);

    const [showModal, setshowModal] = useState(false);
    const [_keyvar, setkeyvar] = useState(0);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null) {
            property.OnSelect(foundOption).then(() => {
                setSelectedoption(property.SelectItem)
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                 () => reloadDisplay())
            })
        }
    };

    
    return (
        <div className={'WbbOptionSelect'} key={updateKey}>
            <WbbOptionBox
                title={property.GetTrueName()}
                value={selectedoption? selectedoption.GetTrueName() : "-"}
                onClick={() => setshowModal(true)}
                overrideplay={selectedoption != null}
            />

            <WbbEditConsumableModal
                show={showModal}
                onClose={() => setshowModal(false)}
                currentChoice={selectedoption? {
                    display_str: selectedoption.GetTrueName(),
                    id: selectedoption.ID,
                    value: selectedoption
                } : null}
                onSubmit={handleSubmit}
                choiceparent={property}
            />
        </div>
    );
};

export default WbbConsumableSelect;