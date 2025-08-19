import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCheckCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Patron } from '../../../../../classes/feature/skillgroup/Patron';
import { useWarband } from '../../../../../context/WarbandContext';
import {makestringpresentable} from "../../../../../utility/functions";

interface WbbEditPatronSelectionProps {
    show: boolean;
    onClose: () => void;
    currentPatron: Patron | null;
    onSubmit: (newPatron: string) => void;
}

const WbbEditPatronSelectionModal: React.FC<WbbEditPatronSelectionProps> = ({
                                                                                show,
                                                                                onClose,
                                                                                currentPatron,
                                                                                onSubmit
                                                                            }) => {
    const [selectedPatron, setSelectedPatron] = useState<Patron | null>(currentPatron);
    const [patronOptions, setPatronOptions] = useState<Patron[]>([]);

    const { warband, reloadDisplay, updateKey } = useWarband();
    const [keyvar, setkeyvar] = useState(0);

    useEffect(() => {
        async function SetDisplayOptions() {
            
            let options : Patron[] = []
            if (warband) {
                options = await (warband?.warband_data.GetPatronList());
            }
            setPatronOptions(options)
            setkeyvar(keyvar + 1);
        }


        SetDisplayOptions();
    }, [show]);

    const handleSubmit = () => {
        onSubmit(selectedPatron? selectedPatron.ID : "");
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbEditPatronSelectionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Patron</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body key={keyvar}>
                <div className={'patron-selection-wrap'}>
                    {patronOptions.map((patron) => (
                        <div
                            key={patron.GetID()}
                            className={`select-item ${selectedPatron === (patron) ? 'selected' : ''}`}
                            onClick={() => setSelectedPatron(patron)}
                        >
                            <span>
                                {currentPatron === patron &&
                                    <FontAwesomeIcon icon={faCheckCircle} className={'icon-inline-left-l'}/>
                                }
                                {patron.GetTrueName()}
                            </span>

                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedPatron === currentPatron}
                >
                    Update Patron
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEditPatronSelectionModal;
