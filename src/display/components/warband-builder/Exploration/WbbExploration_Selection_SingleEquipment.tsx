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

interface Option {
    id: string;
    name: string;
    available: boolean;
}

interface WbbExploration_Selection_SingleEquipment_Props {
    onSubmit: (selected: string) => void;
}

// This lets the user select a single equipment item from a list of items
// See for reference: src/display/components/warband-builder/modals/fighter/WbbModalAddEquipment.tsx

const WbbExploration_Selection_SingleEquipment: React.FC<
    WbbExploration_Selection_SingleEquipment_Props
> = (props) => {
    const { play_mode, edit_mode, view_mode, print_mode, mode, setMode } = useWbbMode(); // play mode v2

    const [showModal, setshowModal] = useState(false);

    const options: Option[] = [
        { id: "combat_helmet", name: "Combat Helmet", available: true },
        { id: "jezzail", name: "Jezzail", available: true },
        { id: "musket", name: "Musket", available: false },
    ];

    const [hasSelectedItem, setHasSelectedItem] = useState(false);
    const [selectedID, setSelectedID] = useState<string | null>(null);

    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        alert('submitting')
    });

    return (
        <div className="WbbExploration_Selection_SingleEquipment mb-3">
            <div className={'fw-bold mb-2'}>
                {'Select Item'}
            </div>

            <div className={'equipment-select'}>
                <div className={'equipment-select-string'}>
                    {selectedID ? (
                        <>
                            {/* @TODO: output acutal name here*/}
                            {selectedID}
                        </>
                    ) : (
                        <>
                            {'-'}
                        </>
                    )}
                </div>

                {(edit_mode) &&
                    <div className={'btn btn-primary'} onClick={() => setshowModal(true)}>
                        <FontAwesomeIcon icon={selectedID ? faArrowsRotate : faPlus}
                                         className={'icon-inline-left-l'}/>
                        {selectedID ? "Change Item" : "Select Item"}
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
                    {/* @TODO: for each item in the list */}
                    {options.map((opt) => (
                        <React.Fragment
                            key={opt.id}
                        >
                            <div
                                className={`select-item ${selectedID === opt.id ? 'selected' : ''}`}
                                onClick={() => setSelectedID(opt.id)}
                            >
                                <span className={'item-left'}>
                                    <span className={'item-name'}>
                                        {opt.name}
                                    </span>
                                </span>

                                <span className={'item-right'}>
                                    <span className={'item-cost'}>
                                        {'15 D'}
                                    </span>

                                    {/* If has LIMIT */}
                                    <span className={'item-limit'}>
                                        Limit: {'1' + "/" + '2'}
                                    </span>

                                    {/* If has restrictions */}
                                    <span className={'item-limit'}>
                                            Restrictions: {'Bob Only'}
                                    </span>
                                </span>
                            </div>

                            {selectedID === opt.id &&
                                <div className={'details-wrap'}>
                                    {/* @TODO: connect equipment here */}
                                    {/*<WbbEquipmentDetails*/}
                                    {/*    equipment={cache[item].facrel.EquipmentItem}*/}
                                    {/*    showType={false}*/}
                                    {/*/>*/}

                                    <div className={'details-quick-action'}>
                                        <Button variant="primary"
                                                onClick={handleSubmit} disabled={!selectedID || isSubmitting}
                                                className={' mb-3 btn-sm w-100'}
                                        >
                                            {isSubmitting ? (
                                                <FontAwesomeIcon icon={faCircleNotch}
                                                                 className={'icon-inline-left fa-spin '}/>
                                            ) : (
                                                <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'}/>
                                            )}
                                            {'Select Item'}
                                        </Button>
                                    </div>
                                </div>
                            }
                        </React.Fragment>
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