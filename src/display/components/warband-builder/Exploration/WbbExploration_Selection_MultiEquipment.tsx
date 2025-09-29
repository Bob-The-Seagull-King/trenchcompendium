import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faPlus, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useWarband } from "../../../../context/WarbandContext";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";
import { IChoice } from "../../../../classes/options/StaticOption";

interface Option {
    id: string;
    name: string;
    cost: number;
}

interface WbbExploration_Selection_MultiEquipment_Props {
    property : WarbandConsumable;
}

const WbbExploration_Selection_MultiEquipment: React.FC<
    WbbExploration_Selection_MultiEquipment_Props
> = ({ property }) => {
    
    const { warband, reloadDisplay, updateKey } = useWarband();
    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);
    const [tempoption, settempoption] = useState<IChoice | null>(null);

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


    function getDisplayString() {
        if (selectedoption != null) {
            for (let i = 0; i < property.Options.length; i++) {
                if (selectedoption == property.Options[i].value) {
                    return property.Options[i].display_str
                }
            }
        } else {return ""}
    }

    return (
        <div className="WbbExploration_Selection_MultiEquipment mb-3">

            {/* List of selected items */}
            <div className={'items-list'}>
                {selectedoption != null ? (
                    
                    <div  className="item">
                        <span>{getDisplayString()}</span>
                    </div>
                ) : (
                    <div>
                        <div
                            className={'btn btn-primary w-100'}
                            onClick={() => setshowModal(true)}
                        >
                            {'Add Item'}
                        </div>
                    </div>
                )}

            </div>
<Modal show={showModal} onHide={() => setshowModal(false)}
                        className="WbbModal WbbModalSelect WbbModalAddEquipment" centered>
                                <Modal.Header closeButton={false}>
                                    <Modal.Title>Select Equipment</Modal.Title>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="modal-close-icon"
                                        role="button"
                                        onClick={() => setshowModal(false)}
                                    />
                                </Modal.Header>

                                <Modal.Body>
                                    {/* loop through available items and mark disabled if over cost limit */}
                                    {property.Options.map((opt) => 
                                    <div
                                        key={property.Options.indexOf(opt)}
                                        className={`select-item ${selectedoption === opt.value ? 'selected' : ''}`}
                                        onClick={() => settempoption(opt)}
                                    >
                                        <span className={'item-left'}>
                                        <span className={'item-name'}>
                                            {opt.display_str}
                                        </span>
                                    </span>
                                    {tempoption === opt && (
                                    <div className={'details-wrap'}>

                                        <div className={'details-quick-action'}>
                                            <Button variant="primary"
                                                    onClick={() => handleSubmit(opt)}
                                                    className={' mb-3 btn-sm w-100'}
                                            >
                                                <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'}/>
                                                {'Select Item'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                    </div>
                                    )}
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setshowModal(false)}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
            
        </div>
    );
};

export default WbbExploration_Selection_MultiEquipment;