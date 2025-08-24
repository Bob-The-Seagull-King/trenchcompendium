import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faCircleNotch,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";
import {useWbbMode} from "../../../../context/WbbModeContext";

interface Option {
    id: string;
    name: string;
    available: boolean;
}

interface WbbExploration_Selection_GloryPurchase_Props {
    onSubmit: (selected: string) => void;
}

const WbbExploration_Selection_GloryPurchase: React.FC<
    WbbExploration_Selection_GloryPurchase_Props
> = (props) => {
    const { edit_mode } = useWbbMode();

    const [showModal, setshowModal] = useState(false);

    // @TODO: Include all items within the glory limit as options
    // @TODO: Items that exceed the current unspent glory are disabled
    const options: Option[] = [
        { id: "glory_sword", name: "Glorious Sword", available: true },
        { id: "glory_banner", name: "Banner of Glory", available: true },
        { id: "glory_armor", name: "Armor of Triumph", available: false },
    ];

    const [selectedID, setSelectedID] = useState<string | null>(null);

    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (selectedID) props.onSubmit(selectedID);
    });

    return (
        <div className="WbbExploration_Selection_GloryPurchase mb-3">
            <div className={'fw-bold mb-2'}>
                {'Select Glory Reward'}
            </div>

            <div className={'equipment-select'}>
                <div className={'equipment-select-string'}>
                    {selectedID ? (
                        <>
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
                    <Modal.Title>Select Glory Item</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    {options.map((opt) => (
                        <React.Fragment key={opt.id}>
                            <div
                                className={`select-item ${selectedID === opt.id ? 'selected' : ''} ${!opt.available ? 'disabled' : ''}`}
                                onClick={() => opt.available && setSelectedID(opt.id)}
                            >
                                <span className={'item-left'}>
                                    <span className={'item-name'}>
                                        {opt.name}
                                    </span>
                                </span>

                                <span className={'item-right'}>
                                    <span className={'item-cost'}>
                                        {'5 G'}
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

                            {selectedID === opt.id && (
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
                            )}
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

export default WbbExploration_Selection_GloryPurchase;
