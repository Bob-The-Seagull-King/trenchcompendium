import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Patron } from '../../../../../classes/feature/skillgroup/Patron';
import { useWarband } from '../../../../../context/WarbandContext';

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

    useEffect(() => {
        async function SetDisplayOptions() {
            const options : Patron[] = warband? warband.warband_data.GetPatronList() : [];
            setPatronOptions(options)
            reloadDisplay();
        }


        SetDisplayOptions();
    }, [show]);

    const handleSubmit = () => {
        onSubmit(selectedPatron? selectedPatron.ID : "");
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} className="WbbEditPatronSelectionModal" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Edit Patron</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body key={updateKey}>
                <h6>Select a Patron</h6>

                <div className={'patron-selection-wrap'}>
                    {patronOptions.map((patron) => (
                        <div
                            key={patron.GetID()}
                            className={`select-item ${selectedPatron === (patron) ? 'selected' : ''}`}
                            onClick={() => setSelectedPatron(patron)}
                        >
                            {patron}
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

function useEffect(arg0: () => void, arg1: any[]) {
    throw new Error('Function not implemented.');
}
