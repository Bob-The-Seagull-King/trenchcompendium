import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faPlus, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useWarband } from "../../../../context/WarbandContext";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";
import { IChoice } from "../../../../classes/options/StaticOption";
import WbbSelectItemEquipment from "../micro-elements/WbbSelectItem";
import {getCostType} from "../../../../utility/functions";

interface Option {
    id: string;
    name: string;
    cost: number;
}

interface WbbExploration_Selection_MultiEquipment_Props {
    property : WarbandConsumable;
    dochange : boolean
}

const WbbExploration_Selection_MultiEquipment: React.FC<
    WbbExploration_Selection_MultiEquipment_Props
> = ({ property, dochange }) => {
    
    const { warband, reloadDisplay, updateKey } = useWarband();
    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);
    const OptionList = ((property.FullOptions.length == 0)? property.Options : property.FullOptions)
    const [tempoption, settempoption] = useState<IChoice | null>(null);

    const [showModal, setshowModal] = useState(false);
    const [_keyvar, setkeyvar] = useState(0);
    const [openedID, setOpenedID] = useState<string | null>(null);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null) {
            property.OnSelect(foundOption).then(() => {
                setSelectedoption(property.SelectItem)
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                 () => reloadDisplay())
            })
        } else {
            property.OnEmpty().then(() => {
                setSelectedoption(null)
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                 () => reloadDisplay())
            })

        }
    };


    function getDisplayString() {
        if (selectedoption != null) {
            for (let i = 0; i < property.Options.length; i++) {
                if (selectedoption.GetID() == property.Options[i].value.GetID()) {
                    return property.Options[i].display_str
                }
            }
        } else {return ""}
    }

    // Returns bool if location be selected
    function canSelectLocation (loc : IChoice) {
        if (property.FullOptions.length == 0) { return true; }
        if (getLocationFromTables(loc) != null) { return true; }
        return false;
    }

    function getLocationFromTables(loc : IChoice) {
        for (let i = 0; i < property.Options.length; i++) {
            if (property.Options[i].id == loc.id) {
                    return property.Options[i];
                }
        }
        return null
    }

    return (
        <div className="WbbExploration_Selection_MultiEquipment">
            {/* List of selected items */}
            {selectedoption != null ? (
                <div  className="item">
                    <span>{getDisplayString()}</span>
                    {dochange &&
                    <span className={'remove'}
                        onClick={() => {
                            handleSubmit(null)
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    }
                </div>
            ) : (
                <div>
                    {dochange && 
                    <div
                        className={'btn btn-primary w-100'}
                        onClick={() => setshowModal(true)}
                    >
                        {'Add Item'}
                    </div>
                    }
                </div>
            )}

            {selectedoption == null && (
                <Modal show={showModal} onHide={() => setshowModal(false)}
                       className="WbbModal WbbModalSelect WbbModalAddEquipment" centered
                >
                    <Modal.Header closeButton={false}>
                        <Modal.Title>Add Equipment</Modal.Title>
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="modal-close-icon"
                            role="button"
                            onClick={() => setshowModal(false)}
                        />
                    </Modal.Header>

                    <Modal.Body>
                        {OptionList.map((opt) => (
                            <WbbSelectItemEquipment
                                key={`select-item-${opt.id}`}

                                id={opt.id}
                                title={opt.value.Name}
                                opened={openedID === opt.id}
                                available={canSelectLocation(opt)}
                                onClick={() => {
                                    
                                    if (canSelectLocation(opt)) {
                                        setOpenedID(opt.id === openedID ? null : opt.id)
                                    }
                                }}
                                equipment={opt.value.EquipmentItem}
                                isSubmitting={false}
                                onSubmit={() => handleSubmit(opt)}
                                submitBtnString={'Add Equipment'}
                                cost={opt.value.Cost + " " + getCostType(opt.value.CostType)}
                            />
                        ))}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setshowModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default WbbExploration_Selection_MultiEquipment;