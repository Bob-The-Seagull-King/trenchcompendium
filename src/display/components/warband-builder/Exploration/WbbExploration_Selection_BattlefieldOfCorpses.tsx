import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faPlus, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Option {
    id: string;
    name: string;
    cost: number;
}

interface WbbExploration_Selection_BattlefieldOfCorpses_Props {
    onChange?: (selected: Option[]) => void;
}

const WbbExploration_Selection_BattlefieldOfCorpses: React.FC<
    WbbExploration_Selection_BattlefieldOfCorpses_Props
> = ({ onChange }) => {
    // @TODO: Dummy items -> replace with actual data
    const options: Option[] = [
        { id: "combat_helmet_1", name: "Combat Helmet", cost: 105 },
        { id: "jezzail", name: "Jezzail", cost: 50 },
        { id: "musket", name: "Musket", cost: 55 },
        { id: "combat_helmet_2", name: "Combat Helmet", cost: 30 },
        { id: "gas_mask", name: "Gas Mask", cost: 50 },
    ];

    const [showModal, setshowModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Option[]>([]);
    const [modalSelection, setModalSelection] = useState<Option | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalCost = selectedItems.reduce((sum, item) => sum + item.cost, 0);

    const handleSelect = (option: Option) => {
        setModalSelection(option);
    };

    const handleSubmit = () => {
        if (!modalSelection) return;

        const wouldExceed = totalCost + modalSelection.cost > 100;
        if (selectedItems.length >= 2 || wouldExceed) return;

        const updated = [...selectedItems, modalSelection];
        setIsSubmitting(true);
        setTimeout(() => {
            setSelectedItems(updated);
            if (onChange) onChange(updated);
            setModalSelection(null);
            setIsSubmitting(false);
            setshowModal(false);
        }, 500);
    };

    const handleRemove = (id: string) => {
        const updated = selectedItems.filter((item) => item.id !== id);
        setSelectedItems(updated);
        if (onChange) onChange(updated);
    };

    return (
        <div className="WbbExploration_Selection_BattlefieldOfCorpses mb-3">
            {/* List of selected items */}
            <div className={'items-list'}>
                {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                        <div key={item.id} className="item">
                            <span>{item.name} ({item.cost} D)</span>

                            {/* @TODO do not remove all items with ID but this one item */}
                            <span
                                className={'remove'}
                                onClick={() => handleRemove(item.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </span>

                        </div>
                    ))
                ) : (
                    <div className="item">
                        {'No items selected'}
                    </div>
                )}
            </div>

            {/* Show button if a selection needs to be made */}
            {selectedItems.length < 2 &&
                <div
                    className={'btn btn-primary w-100'}
                    onClick={() => setshowModal(true)}
                >
                    {'Add Item'}
                </div>
            }

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
                    {/* loop through available items and mark disabled if over 100 total */}
                    {options.map((opt) => {
                        const isSelected = modalSelection?.id === opt.id;
                        const wouldExceed = totalCost + opt.cost > 100;
                        const disableItem = (selectedItems.length >= 2 || wouldExceed);

                        return (
                            <React.Fragment key={opt.id}>
                                <div
                                    className={`select-item ${isSelected ? 'selected' : ''} ${disableItem ? 'disabled' : ''}`}
                                    onClick={() => !disableItem && handleSelect(opt)}
                                >
                                    <span className={'item-left'}>
                                        <span className={'item-name'}>
                                            {opt.name}
                                        </span>
                                    </span>

                                    <span className={'item-right'}>
                                        <span className={'item-cost'}>
                                            {opt.cost} D
                                        </span>
                                    </span>
                                </div>

                                {isSelected && (
                                    <div className={'details-wrap'}>
                                        {/* @TODO: connect equipment here */}
                                        {/*<WbbEquipmentDetails*/}
                                        {/*    equipment={cache[item].facrel.EquipmentItem}*/}
                                        {/*    showType={false}*/}
                                        {/*/>*/}

                                        <div className={'details-quick-action'}>
                                            <Button variant="primary"
                                                    onClick={handleSubmit} disabled={ isSubmitting}
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
                        );
                    })}
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

export default WbbExploration_Selection_BattlefieldOfCorpses;