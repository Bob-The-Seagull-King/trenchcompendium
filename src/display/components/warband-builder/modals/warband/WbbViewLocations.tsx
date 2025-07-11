import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import WbbEditViewModifier from '../../WbbEditViewModifier';
import { useWarband } from '../../../../../context/WarbandContext';
import { ISelectedOption, WarbandProperty } from '../../../../../classes/saveitems/Warband/WarbandProperty';
import WbbEditViewExtraModifier from '../../WbbEditViewExtraModifier';
import WbbModalAddExplorationLocation from '../WbbModalAddExplorationLocation';
import WbbEditViewExploration from '../../WbbEditViewExploration';
import { ExplorationLocation } from '../../../../../classes/feature/exploration/ExplorationLocation';
import { ToolsController } from '../../../../../classes/_high_level_controllers/ToolsController';

const WbbViewLocations = () => {
    const { warband, updateKey } = useWarband();

    const [keyvar, setkeyvar] = useState(0);
    const [locations, setlocations] = useState<WarbandProperty[]>([]);

    
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
            {locations.length > 0 &&
                <>
                    {/* Warband Exploration Locations */}
                    <h3 className={'category-headline'}>Exploration Locations</h3>


                    {locations.map((item, index) => 
                        <WbbEditViewExploration
                            key={index}
                            location={item}
                        />
                    )}
                </>
            }   
            
        </div>
    );
};

export default WbbViewLocations;