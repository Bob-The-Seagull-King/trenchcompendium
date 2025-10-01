import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faChevronDown,
    faChevronUp,
    faCircleNotch,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {getCostType} from "../../../../utility/functions";
import WbbEquipmentDetails from "../micro-elements/WbbEquipmentDetails";
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";
import {useWbbMode} from "../../../../context/WbbModeContext";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { IChoice } from "../../../../classes/options/StaticOption";
import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";
import { useWarband } from "../../../../context/WarbandContext";
import WbbSelectItemEquipment from "../micro-elements/WbbSelectItem";
import {FactionEquipmentRelationship} from "../../../../classes/relationship/faction/FactionEquipmentRelationship";


interface WbbExploration_Selection_SingleEquipment_Props {
    property : WarbandConsumable;
}

// This lets the user select a single equipment item from a list of items
// See for reference: src/display/components/warband-builder/modals/fighter/WbbModalAddEquipment.tsx

const WbbExploration_Selection_SingleEquipment: React.FC<
    WbbExploration_Selection_SingleEquipment_Props
> = ({property}) => {
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    const { warband, reloadDisplay, updateKey } = useWarband();
    const [showModal, setshowModal] = useState(false);

    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);

    const [openedID, setOpenedID] = useState<string | null>(null);

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
        <div className="WbbExploration_Selection_SingleEquipment mb-3">
            <div className={'fw-bold mb-2'}>
                {'Select Item'}
            </div>

            <div className={'equipment-select'}>
                <div className={'equipment-select-string'}>
                    {selectedoption ? (
                        <>
                            {selectedoption.GetTrueName()}
                        </>
                    ) : (
                        <>
                            {'-'}
                        </>
                    )}
                </div>

                {(edit_mode) &&
                    <div className={'btn btn-primary'} onClick={() => setshowModal(true)}>
                        <FontAwesomeIcon icon={selectedoption ? faArrowsRotate : faPlus}
                                         className={'icon-inline-left-l'}/>
                        {selectedoption ? "Change Item" : "Select Item"}
                    </div>
                }
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
                    {/* @TODO: show all options and make unavailable ones unavailable */}
                    {property.Options.map((opt) => (
                            <WbbSelectItemEquipment
                                key={`select-item-${opt.id}`}

                                id={opt.id}
                                title={opt.value.Name}
                                opened={openedID === opt.id}
                                available={true} // @TODO add availability here
                                onClick={() => {
                                    setOpenedID(opt.id === openedID ? null : opt.id)
                                }}
                                equipment={opt.value.EquipmentItem}
                                isSubmitting={false}
                                onSubmit={() => handleSubmit(opt)}
                                submitBtnString={'Add Equipment'}
                                cost={opt.value.Cost + " " + getCostType(opt.value.CostType)}
                                // @TODO: add limit and restrictions
                                // limit={
                                //     opt.value.limit > 0
                                //         ? "Limit: " + (cache[item].count_cur + "/" + cache[item].limit)
                                //         : ""
                                // }
                                // restrictions={cache[item].restrictions}
                            />
                    ))}
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

export default WbbExploration_Selection_SingleEquipment;

function reloadDisplay() {
    throw new Error("Function not implemented.");
}
