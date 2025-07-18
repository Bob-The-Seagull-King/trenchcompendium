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

interface WbbEditSelectionProps {
    choice : SelectedOption;
    property : WarbandProperty;
    overrideplay? : boolean
}

const WbbOptionSelect: React.FC<WbbEditSelectionProps> = ({choice,  property, overrideplay}) => {
    const { warband, reloadDisplay, updateKey } = useWarband();

    const [showModal, setshowModal] = useState(false);
    const [displayState, setDisplayState] = useState( <></> );
    const [_keyvar, setkeyvar] = useState(0);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null && overrideplay != true) {
            choice.SelectOption(foundOption? foundOption.id : null);
            property.RegenerateSubProperties().then(() => 
            property.RegenerateOptions().then(() =>{
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())}))
        }
    };

    
    async function SetModelOptions() {
        await property.RegenerateOptions();
        if (choice.SelectedChoice != null) {
            
            const EventProc: EventRunner = new EventRunner();
            
            const result = await EventProc.runEvent(
                "returnWbbOptionDisplay",
                property,
                [],
                null,
                choice.SelectedChoice
            );
            if (result != null) {
                setDisplayState(result)
                setkeyvar((prev) => prev + 1);
            }
        }

    }
    
    useEffect(() => {
            SetModelOptions();
    }, [updateKey]);
    
    return (
        <div className={'WbbOptionSelect'} key={updateKey}>
            <WbbOptionBox
                title={choice.Option.Name}
                value={choice.GetSelectedTitle()}
                onClick={() => setshowModal(true)}
                overrideplay={overrideplay || choice.Option.AutoSelect}
            />

            <WbbEditSelectionModal
                show={showModal}
                onClose={() => setshowModal(false)}
                currentChoice={choice.GetSelected()}
                onSubmit={handleSubmit}
                choiceparent={choice}
            />

            <div key={_keyvar} className="SingleOptionSetDisplay-Details">
                {displayState}
            </div>
        </div>
    );
};

export default WbbOptionSelect;