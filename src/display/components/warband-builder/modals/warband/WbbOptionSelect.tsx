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
    const [displayOptions, setDisplayOptions] = useState(false);
    const [_keyvar, setkeyvar] = useState(0);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null && overrideplay != true) {
            choice.UserUpdateSelection((foundOption? foundOption.id : null)).then(() => { 
            property.RegenerateSubProperties().then(() => 
            property.RegenerateOptions().then(() =>{
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())}))})
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
            const doshow = await EventProc.runEvent(
                "showWbbOptionOptions",
                property,
                [],
                false,
                choice.SelectedChoice
            );
            console.log(choice)
            setDisplayOptions(doshow)
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
                overrideplay={overrideplay || choice.Option.AutoSelect || (!choice.CanChange() && choice.SelectedChoice != null)}
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
            {(property.SubProperties.length > 0 && displayOptions) &&
                <>
                    {property.SubProperties.length > 0 &&
                        <>
                            {property.SubProperties.map((item : WarbandProperty) =>
                                <div key={property.SubProperties.indexOf(item)}>
                                {item.SelfDynamicProperty.Selections.map((subitem) =>
                                        <WbbOptionSelect
                                            overrideplay={false}
                                            property={item}
                                            key={item.SelfDynamicProperty.Selections.indexOf(subitem)}
                                            choice={subitem}
                                        />
                                    )}
                                </div >
                            )}
                        </>
                    }
                </>
            }
        </div>
    );
};

export default WbbOptionSelect;