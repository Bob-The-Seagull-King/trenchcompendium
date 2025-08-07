import { useWarband } from '../../../../context/WarbandContext';
import { FactionEquipmentRelationship } from '../../../../classes/relationship/faction/FactionEquipmentRelationship';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { containsTag, getCostType } from '../../../../utility/functions';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faTrophy, faXmark} from "@fortawesome/free-solid-svg-icons";
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import { EquipmentFactory } from '../../../../factories/features/EquipmentFactory';

interface Item {
    id: string;
    name: string;
    costDucats?: number;
    costGlory?: number;
}

interface WbbModalAddItemToStashProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (weapon: Equipment, cost : number, costtype : number) => void;
}

const WbbEquipmentAddCustomStash: React.FC<WbbModalAddItemToStashProps> = ({ show, onClose, onSubmit}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [cost, setCost] = useState<number>(1);
    const [costType, setCostType] = useState<0 | 1>(0); // 0 == ducats, 1 == glory
    
    const { warband } = useWarband();
    const [listofoptions, setListofOptions] = useState<Equipment[]>([])
    const [keyvar, setkevvar] = useState(0);

    // local states for filter selections
    const [selectedFaction, setSelectedFaction] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const handleSubmit = () => {
        const weapon = listofoptions.find(w => w.ID === selectedId);
        if (weapon) {
            onSubmit(weapon, cost, costType);
            setSelectedId(null);
            onClose();
        }
    };
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await EquipmentFactory.GetAllEquipment()
            if (options != undefined) {
                setListofOptions(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [show]);

    const factionMap = new Map<string, string>();

    listofoptions.forEach((eq: any) => {
        eq.EquipmentItems?.forEach((rel: any) => {
            rel.Factions?.forEach((f: any) => {
                if (f.ID && f.Name) {
                    factionMap.set(f.ID, f.Name);
                }
            });
        });
    });

    const factionOptions = Array.from(factionMap.entries()); // [ [id, name], ... ]

    const categoryLabels: Record<string, string> = {
        melee: "Melee Weapons",
        ranged: "Ranged Weapons",
        armour: "Armour",
        equipment: "Equipment",
        field: "Field Equipment",
    };

    const categoryOptions = Array.from(new Set(
        listofoptions.map(eq => eq.Category).filter(Boolean)
    ));

    const filteredItems = listofoptions.filter((item: any) => {
        const matchesCategory = selectedCategory === "all" || item.Category === selectedCategory;
        const matchesFaction =
            selectedFaction === "all" ||
            item.EquipmentItems?.some((rel: any) =>
                rel.Factions?.some((f: any) => f.ID === selectedFaction)
            );
        return matchesCategory && matchesFaction;
    });


    return (
        <Modal show={show} key={keyvar} onHide={onClose} className="WbbModalAddItem WbbModalAddItemToStash WbbModalAddItemToStashCustom" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Add Item to Stash</Modal.Title>

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
                        <option value="all">Show all</option>
                        {factionOptions.map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="categorySelect" className="form-label">Category</label>
                    <select
                        id="categorySelect"
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">Show all</option>
                        {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>
                                {categoryLabels[cat] || cat}
                            </option>
                        ))}
                    </select>
                </div>

                <hr />

                { filteredItems.length > 0 ? (
                    <>
                        {filteredItems.map((item) => (
                            <div
                                key={item.ID}
                                className={`select-item ${selectedId === item.ID ? 'selected' : ''}`}
                                onClick={() => setSelectedId(item.ID)}
                            >
                        <span className={'item-name'}>
                            {item.GetTrueName()}
                        </span>
                            </div>
                        ))}
                    </>
                ): (
                    <>
                        {'No items found for the selected filters.'}
                    </>
                )}

                <hr/>
                
                <input
                    type="number" id={'add-cost-input'}
                    className="form-control"
                    defaultValue={0}
                    onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                />

                
                <div className={'mt-2'} style={{width:"100%"}}>
                    <Button className={'btn btn-primary ' + (costType == 0? 'perma-active':'')}
                        onClick={() => setCostType(0)}
                        style={{width:"50%"}}
                        active={costType == 0}>
                        <FontAwesomeIcon icon={faCoins} className="icon-inline-left-l"/>
                        {'Spend Ducats'}
                    </Button>
                    <Button className={'btn btn-primary ' + (costType == 1? 'perma-active':'')}
                        onClick={() => setCostType(1)}
                        style={{width:"50%"}}
                        active={costType == 1}>
                        <FontAwesomeIcon icon={faTrophy} className="icon-inline-left-l"/>
                        {'Spend Glory'}
                    </Button>
                </div>


            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                {/*  Disable when nothing is selected or selection not visible */}
                <Button variant="primary"
                    onClick={handleSubmit}
                    disabled={
                        !selectedId || !filteredItems.some(item => item.ID === selectedId)
                    }
                >
                    Add item
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbEquipmentAddCustomStash;
