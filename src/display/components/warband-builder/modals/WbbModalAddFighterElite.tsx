import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import { useWarband } from '../../../../context/WarbandContext';
import { getCostType } from '../../../../utility/functions';
import SynodModelImage from "../../../../utility/SynodModelImage";

interface Fighter {
    id: string;
    name: string;
}

interface WbbModalAddFighterEliteProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighters: FactionModelRelationship[]) => void;
}

const WbbModalAddFighterElite: React.FC<WbbModalAddFighterEliteProps> = ({ show, onClose, onSubmit }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<FactionModelRelationship[]>([])
    const [keyvar, setkevvar] = useState(0);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };
    
    useEffect(() => {
        async function SetModelOptions() {
            const options = await warband?.warband_data.GetEliteFighterOptions()
            if (options != undefined) {
                setListofOptions(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetModelOptions();
    }, [show]);

    const handleSubmit = () => {
        if (selectedId) {
            const selected = listofoptions.filter((f) => f.ID === selectedId);
            onSubmit(selected);
            setSelectedId(null); // clear selection
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} key={keyvar} className={'WbbModalAddItem WbbModalAddFighter WbbModalAddFighterElite'} centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Elite</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                {listofoptions.map((fighter) => (
                    <div
                        key={fighter.ID}
                        className={`select-item ${selectedId === fighter.ID ? 'selected' : ''}`}
                        onClick={() => handleSelect(fighter.ID)}
                    >
                        <div className={'model-image-wrap'}>
                            <SynodModelImage
                                modelSlug={fighter.GetSlug()}
                                size="small"
                                className={'model-image'}
                            />
                        </div>

                        <span className={'item-name'}>
                            {fighter.Model.GetName()}
                        </span>
                        <span className={'item-cost'}>
                            {fighter.Cost + " " + getCostType(fighter.CostType)}
                        </span>
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={!selectedId}>
                    Add Fighter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddFighterElite;
