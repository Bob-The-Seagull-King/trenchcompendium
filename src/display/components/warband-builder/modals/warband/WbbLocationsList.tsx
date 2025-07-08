import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import WbbEditViewModifier from '../../WbbEditViewModifier';
import { useWarband } from '../../../../../context/WarbandContext';
import { WarbandProperty } from '../../../../../classes/saveitems/Warband/WarbandProperty';
import WbbEditViewExtraModifier from '../../WbbEditViewExtraModifier';
import WbbModalAddExplorationLocation from '../WbbModalAddExplorationLocation';
import WbbEditViewExploration from '../../WbbEditViewExploration';

const WbbLocationsList = () => {
    const { warband, updateKey, reloadDisplay } = useWarband();

    const [keyvar, setkeyvar] = useState(0);
    const [locations, setlocations] = useState<WarbandProperty[]>([]);

    // Exploration Location Modal
    const [showAddExplorationModal, setShowAddExplorationModal] = useState(false);
    const handleAddExplorationLocation = (location: any) => {
        if (!warband) { return; }
        console.log("ADD EXPLORATION LOCATION")
        //warband.warband_data.AddExplorationLocation(location, selectedOptions);
    };
    
    useEffect(() => {
        async function RunUpdate() {
            if (warband) {
                const Modifiers = warband?.warband_data.GetLocations();
                setlocations(Modifiers);
            }
            setkeyvar(keyvar + 1);
        }

        RunUpdate()
    }, [updateKey]);

    return (
        <div key={keyvar}>        
            {/* Warband Exploration Locations */}
            <h3 className={'category-headline'}>Exploration Locations</h3>


            {locations.map((item, index) => 
                <WbbEditViewExploration
                    key={index}
                    location={item}
                />
            )}

            <div className={'btn btn-add-element btn-block'}
                    onClick={() => setShowAddExplorationModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                {'Add Exploration Location'}
            </div>
            
            <WbbModalAddExplorationLocation
                show={showAddExplorationModal}
                onClose={() => setShowAddExplorationModal(false)}
                onSubmit={handleAddExplorationLocation}
            />
        </div>
    );
};

export default WbbLocationsList;