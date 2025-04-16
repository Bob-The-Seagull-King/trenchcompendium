import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbWarbandListItem from "../components/warband-builder/WbbWarbandListItem";
import WbbFactionSelectItem from "../components/warband-builder/WbbFactionSelectItem";
import {Button} from "react-bootstrap";
import WbbCreateNewDetailsForm from "../components/warband-builder/WbbCreateNewDetailsForm";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';

const WbbCreateNewPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;

    const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
    const [selectedFactionName, setSelectedFactionName] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);


    // Testing Faction Names to create display
    const factions = [
        {
            name: "Trench Pilgrims",
            faction_id: "fc_trenchpilgrim1",
            sub_factions: [
                {
                    name: "Procession of the Sacred Affliction",
                    faction_id: "fc_trenchpilgrim2",
                },
                {
                    name: "Cavalcade of the Tenth Plague",
                    faction_id: "fc_trenchpilgrim3",
                },
                {
                    name: "War Pilgrimage of Saint Methodius",
                    faction_id: "fc_trenchpilgrim4",
                }
            ]
        },
        {
            name: "The Principality of New Antioch",
            faction_id: "fc_trenchpilgrim5",
            sub_factions: [
                {
                    name: "Papal States Intervention Force",
                    faction_id: "fc_trenchpilgrim6",
                },
                {
                    name: "Eire Rangers",
                    faction_id: "fc_trenchpilgrim7",
                },
                {
                    name: "Stosstruppen of the Free State of Prussia",
                    faction_id: "fc_trenchpilgrim8",
                },
                {
                    name: "Kingdom of Alba Assault Detachment",
                    faction_id: "fc_trenchpilgrim9",
                }
            ]
        },
        {
            name: "The Iron Sultanate",
            faction_id: "fc_trenchpilgrim10",
            sub_factions: [
                {
                    name: "The House of Wisdom",
                    faction_id: "fc_trenchpilgrim11",
                },
                {
                    name: "Defenders of the Iron Wall",
                    faction_id: "fc_trenchpilgrim12",
                },
                {
                    name: "Fida'i of Alamut â€“ The Cabal of Assassins",
                    faction_id: "fc_trenchpilgrim13",
                }
            ]
        },
        {
            name: "Heretic Legion",
            faction_id: "fc_trenchpilgrim",
            sub_factions: [
                {
                    name: "Heretic Naval Raiding Party",
                    faction_id: "fc_trenchpilgrim14",
                },
                {
                    name: "Trench Ghosts",
                    faction_id: "fc_trenchpilgrim15",
                },
                {
                    name: "Knights of Avarice",
                    faction_id: "fc_trenchpilgrim16",
                },
            ]
        },
        {
            name: "Black Grail",
            faction_id: "fc_trenchpilgrim17",
            sub_factions: [
                {
                    name: "Dirge of the Great Hegemon",
                    faction_id: "fc_trenchpilgrim18",
                }
            ]
        },
        {
            name: "The Court of the seven headed serpent",
            faction_id: "fc_trenchpilgrim19",
        },

    ];

    const handleFactionSubmit = () => {
        if (selectedFactionId) {
            setStep(2); // move to the next step
        }

    };

    const handleFactionSelect = (id: string, name: string) => {
        setSelectedFactionId(id);
        setSelectedFactionName(name);
    };

    const handleBack = () => {
        setStep(1); // allow going back
        setSelectedFactionId(null);
    };

    return (
        <div className={'WbbCreateNewPage'}>

                {step === 1 && (
                    <div className={'container'}>
                        <div className={'headline-wrap'}>
                            <h1>Select Faction</h1>
                            <h2 className={'sub-headline'}>New Warband</h2>
                        </div>
                        <div className={'row'}>
                            {factions.map(item => (
                                <WbbFactionSelectItem
                                    key={item.faction_id}
                                    item={item}
                                    selectedFactionId={selectedFactionId}
                                    onSelect={handleFactionSelect}
                                />
                            ))}
                        </div>

                        <div className="bottom-actions">
                            <a href={"/warband-builder"} className="btn btn-secondary">
                                Back to Main
                            </a>
                            <Button className="btn-primary" onClick={handleFactionSubmit} disabled={!selectedFactionId}>
                                Choose Faction
                            </Button>
                        </div>
                    </div>
                )}

            {step === 2 && selectedFactionId && (
                <div className={'container'}>
                    <div className={'headline-wrap'}>
                        <h1>Warband Options</h1>
                        <h2 className={'sub-headline'}>New Warband</h2>
                    </div>

                    <WbbCreateNewDetailsForm
                        factionId={selectedFactionId}
                        factionName={selectedFactionName}
                        onBack={handleBack}
                    />
                </div>

                )}

        </div>
    );
};

export default WbbCreateNewPage;