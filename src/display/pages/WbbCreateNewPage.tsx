import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import WbbWarbandListItem from "../components/warband-builder/WbbWarbandListItem";
import WbbFactionSelectItem from "../components/warband-builder/WbbFactionSelectItem";
import {Button} from "react-bootstrap";
import WbbCreateNewDetailsForm from "../components/warband-builder/WbbCreateNewDetailsForm";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import { FactionCollection } from '../../classes/feature/faction/FactionCollection';
import { Faction } from '../../classes/feature/faction/Faction';
import { ControllerController } from '../../classes/_high_level_controllers/ControllerController';
import CustomNavLink from '../components/subcomponents/interactables/CustomNavLink';
import { useNavigate } from 'react-router-dom';

const WbbCreateNewPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;
    const navigate = useNavigate();

    const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [factionlist, setfactions] = useState<any[]>([]);
    const [keyvar, setkeyvar] = useState(0);

    
    useEffect(() => {
        async function GetFactions() {
            const ControllerData : ControllerController = ControllerController.getInstance();
            await ControllerData.FactionCollectionController.initCollection();
            setfactions(ControllerData.FactionCollectionController.Collection.itemcollection);
            setkeyvar((prev) => (prev + 1))
        }

        GetFactions();
    }, []);

    const handleFactionSubmit = () => {
        if (selectedFaction) {
            setStep(2); // move to the next step
        }

    };

    const handleFactionSelect = (fac : Faction) => {
        setSelectedFaction(fac);
    };

    const handleBack = () => {
        setStep(1); // allow going back
        setSelectedFaction(null);
    };

    return (
        <div className={'WbbCreateNewPage'}>

                {step === 1 && (
                    <div className={'container'}>
                        <div className={'headline-wrap'}>
                            <h1>Select Faction</h1>
                            <h2 className={'sub-headline'}>New Warband</h2>
                        </div>

                        <div className={'wbb-faction-masonry'}>
                            {factionlist.map(item => (
                                <WbbFactionSelectItem
                                    key={item.HeldItem.ID}
                                    item={item.HeldItem}
                                    trueitem={item.HeldItem.GetBaseFac()}
                                    onSelect={handleFactionSelect}
                                    selectedFaction={selectedFaction}
                                />
                            ))}
                        </div>

                        <div className="bottom-actions">
                            <CustomNavLink                             
                                link={"warband/"}
                                classes={"btn btn-secondary"}
                                runfunc={() => (navigate("/warband/"))}
                                >
                                    <>
                                        Back to Main
                                    </>
                            </CustomNavLink>
                            <Button className="btn-primary" onClick={handleFactionSubmit} disabled={!selectedFaction}>
                                Choose Faction
                            </Button>
                        </div>
                    </div>
                )}

            {step === 2 && selectedFaction && (
                <div className={'container'}>
                    <div className={'headline-wrap'}>
                        <h1>Warband Options</h1>
                        <h2 className={'sub-headline'}>New Warband</h2>
                    </div>

                    <WbbCreateNewDetailsForm
                        chosenfaction={selectedFaction}
                        onBack={handleBack}
                        manager={Manager}
                    />
                </div>

                )}

        </div>
    );
};

export default WbbCreateNewPage;