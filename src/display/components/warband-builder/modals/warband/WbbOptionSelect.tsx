import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import { IChoice } from '../../../../../classes/options/StaticOption';
import WbbOptionBox from '../../WbbOptionBox';
import WbbEditSelectionModal from './WbbEditSelectionModal';
import { useWarband } from '../../../../../context/WarbandContext';
import { ToolsController } from '../../../../../classes/_high_level_controllers/ToolsController';

interface WbbEditSelectionProps {
    choice : SelectedOption;
    isinner?: boolean;
}

const WbbOptionSelect: React.FC<WbbEditSelectionProps> = ({choice, isinner}) => {
    const { warband, reloadDisplay, updateKey } = useWarband();
    const [selectedoption, setSelectedoption] = useState<IChoice | null>(choice.GetSelected());

    const [showModal, setshowModal] = useState(false);

    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null) {
            setSelectedoption(foundOption)
            choice.SelectOption(foundOption? foundOption.id : null);
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        }
    };
    return (
        <div className={(isinner != undefined) ? (isinner == true)? 'modifier-inner-body' : 'modifier-body' : 'modifier-body'} key={updateKey}>
            <WbbOptionBox
                title={choice.Option.Name}
                value={choice.GetSelectedTitle()}
                onClick={() => setshowModal(true)}
            />

            <WbbEditSelectionModal
                show={showModal}
                onClose={() => setshowModal(false)}
                currentChoice={choice.GetSelected()}
                onSubmit={handleSubmit}
                choiceparent={choice}
            />
        </div>
    );
};

export default WbbOptionSelect;