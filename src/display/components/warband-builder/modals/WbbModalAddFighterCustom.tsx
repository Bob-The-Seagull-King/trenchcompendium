import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import { useWarband } from '../../../../context/WarbandContext';
import { getCostType } from '../../../../utility/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SynodModelImageSource from "../../../../utility/SynodModelImageSource";
import SynodModelImage from "../../../../utility/SynodModelImage";
import { Model } from '../../../../classes/feature/model/Model';
import { ModelFactory } from '../../../../factories/features/ModelFactory';


interface WbbModalAddFighterTroopProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (selectedFighter: Model, cost : number, costtype : number) => void;
}

const WbbModalAddFighterCustom: React.FC<WbbModalAddFighterTroopProps> = ({ show, onClose, onSubmit }) => {
    
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [cost, setCost] = useState<number>(1);
    const [costType, setCostType] = useState<0 | 1>(0); // 0 == ducats, 1 == glory

    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<Model[]>([])
    const [keyvar, setkevvar] = useState(0);

    // filter for selected faction
    const [selectedFaction, setSelectedFaction] = useState<string>('all');

    // get Faction options
    const factions = Array.from(new Set(
        listofoptions
            .flatMap(f => (f as any).Models?.map((rel: any) => rel.Faction?.Name) || [])
            .filter(Boolean)
    ));


    const factionMap = new Map<string, string>(); // Map<ID, Name>

    listofoptions.forEach((model: any) => {
        model.Models?.forEach((rel: any) => {
            rel.Factions?.forEach((faction: any) => {
                if (faction.ID && faction.Name) {
                    factionMap.set(faction.ID, faction.Name);
                }
            });
        });
    });

    const factionOptions = Array.from(factionMap.entries()); // [ [id, name], ... ]


    // filter fighters based on selected faction
    const filteredFighters = selectedFaction === 'all'
        ? listofoptions
        : listofoptions.filter((model: any) =>
            model.Models?.some((rel: any) =>
                rel.Factions?.some((f: any) => f.ID === selectedFaction)
            )
        );

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };
        
    useEffect(() => {
        async function SetModelOptions() {
            const options = await ModelFactory.GetAllModels();
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
            if (selected.length > 0) {
                onSubmit(selected[0], cost, costType);
                setSelectedId(null); // clear selection
                onClose();
            }
        }
    };


    return (
        <Modal show={show} onHide={onClose} className={'WbbModalAddItem WbbModalAddFighter WbbModalAddFighterCustom'} centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Custom Fighter</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="factionSelect" className="form-label">Faction</label>
                    <select
                        id="factionSelect"
                        className="form-select"
                        value={selectedFaction}
                        onChange={(e) => setSelectedFaction(e.target.value)}
                    >
                        <option value="all">All</option>
                        {factionOptions.map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>

                <hr/>

                {filteredFighters.map((fighter) => (
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
                            {fighter.GetName()}
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

export default WbbModalAddFighterCustom;
