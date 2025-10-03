import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../classes/options/SelectedOption';
import WbbEditViewModifier from '../WbbEditViewModifier';
import { useWarband } from '../../../../context/WarbandContext';
import { ISelectedOption, WarbandProperty } from '../../../../classes/saveitems/Warband/WarbandProperty';
import WbbEditViewExtraModifier from '../WbbEditViewExtraModifier';
import WbbModalAddExplorationLocation from '../modals/WbbModalAddExplorationLocation';
import WbbEditViewExploration from '../WbbEditViewExploration';
import { ExplorationLocation } from '../../../../classes/feature/exploration/ExplorationLocation';
import { ToolsController } from '../../../../classes/_high_level_controllers/ToolsController';
import {useWbbMode} from "../../../../context/WbbModeContext";
import WbbEditViewExplorationUnstored from '../WbbEditViewExplorationUnstored';
import { ExplorationTableSuite, FilteredLocation, StoredLocation } from '../../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';

const WbbLocationsList = () => {
    const { warband, updateKey, reloadDisplay } = useWarband();
    const { play_mode, edit_mode, view_mode, print_mode, setMode } = useWbbMode(); // play mode v2
    const [keyvar, setkeyvar] = useState(0);
    const [locations, setlocations] = useState<WarbandProperty[]>([]);
    const [templocation, settemplocation] = useState<StoredLocation[]>(warband? warband.warband_data.Exploration.CurLocation : []);

    // Exploration Location Modal
    const [showAddExplorationModal, setShowAddExplorationModal] = useState(false);

    const handleSaveExplorationLocation = (optionsuite : FilteredLocation) => {
        if (!warband) { return; }
        warband.warband_data.Exploration.CurLocation.push({
            base_item: optionsuite,
            selected_options: []
        })
        settemplocation(warband.warband_data.Exploration.CurLocation)
        reloadDisplay()
    };
    
    useEffect(() => {
        async function RunUpdate() {
            if (warband) {
                const Modifiers = warband?.warband_data.GetLocations();
                setlocations(Modifiers);
            }
            settemplocation(warband? warband.warband_data.Exploration.CurLocation : [])
            setkeyvar(keyvar + 1);
        }

        RunUpdate()
    }, [updateKey]);

    return (
        <div key={keyvar}>        
            {/* Warband Exploration Locations */}
            {(locations.length > 0 || edit_mode) &&
                <h3 className={'mb-3'}>Exploration Locations</h3>
            }


            {locations.map((item, index) =>
                <WbbEditViewExploration
                    key={index}
                    location={item}
                />
            )}

            {templocation.map((item, index) =>
                <WbbEditViewExplorationUnstored
                    location={item}
                    key={index}
                    clear={() => settemplocation([])}
                />
            )}

            {edit_mode &&
            <div className={'btn btn-add-element btn-block'}
                    onClick={() => setShowAddExplorationModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>
                {'Add Exploration Location'}
            </div>
            }
            
            {edit_mode &&
                <WbbModalAddExplorationLocation
                    show={showAddExplorationModal}
                    onClose={() => setShowAddExplorationModal(false)}
                    onSubmit={handleSaveExplorationLocation}
                />
            }
        </div>
    );
};

export default WbbLocationsList;