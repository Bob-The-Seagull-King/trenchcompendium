import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faCircleNotch, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { ExplorationLocation } from '../../../../classes/feature/exploration/ExplorationLocation';
import { useWarband } from '../../../../context/WarbandContext';
import { ExplorationTableSuite, FilteredLocation } from '../../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';
import WbbFighterCollapse from '../WbbFighterCollapse';
import { containsTag, makestringpresentable } from '../../../../utility/functions';
import { ISelectedOption } from '../../../../classes/saveitems/Warband/WarbandProperty';
import {useModalSubmitWithLoading} from "../../../../utility/useModalSubmitWithLoading";
import WbbGeneralCollapse from "../WbbGeneralCollapse";
import {returnDescription} from "../../../../utility/util";

interface WbbModalAddExplorationLocationProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (location: ExplorationLocation, options : ISelectedOption[] ) => void;
}

const WbbModalAddExplorationLocation: React.FC<WbbModalAddExplorationLocationProps> = ({ show, onClose, onSubmit }) => {
    const { warband, updateKey, reloadDisplay } = useWarband();

    const [selectedLocation, setSelectedLocation] = useState<FilteredLocation | null>(null);
    const [selectedOptionIds, setSelectedOptionIds] = useState<ISelectedOption[]>([]);
    const [availableoptions, setavailableoptions] = useState<ExplorationTableSuite[]>([]);

    const [isubmitdisabled, setisubmitdisabled] = useState<boolean>(true);
    const [keyvar, setkeyvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (selectedLocation) {
            onSubmit(selectedLocation.location, selectedOptionIds);
            setSelectedLocation(null);
            setSelectedOptionIds([]);
            onClose();
        }
    });

    function UpdateSelectedOptionIDs(newoption : ISelectedOption) {
        let found = false
        for (let i = 0; i < selectedOptionIds.length; i++) {
            if (selectedOptionIds[i].option_refID == newoption.option_refID) {
                found = true;
                selectedOptionIds[i].selection_ID = newoption.selection_ID;
            }
        }
        if (found == false) {
            selectedOptionIds.push(newoption);
        }
        RedoSubmitDisabled()
        setkeyvar(keyvar + 1)
    }

    useEffect(() => {
        async function RunGetLocations() {
            const Locations : ExplorationTableSuite[] | undefined = await warband?.warband_data.GetAvailableLocations();
            if (Locations != undefined) {
                setavailableoptions(Locations);
            }
            setkeyvar(keyvar + 1)
        }

        RunGetLocations()
    }, [updateKey]);
        
    useEffect(() => {
        async function RunUpdate() {
            RedoSubmitDisabled();
            setkeyvar(keyvar + 1)
        }

        RunUpdate()
    }, [updateKey, selectedOptionIds, selectedLocation]);

    function RedoSubmitDisabled() {
        setisubmitdisabled(!selectedLocation?.location.GetID() || (!(containsTag(selectedLocation.location.Tags, 'unforced')) && selectedLocation?.options && selectedLocation.options.length > 0 && (selectedLocation.options.length != selectedOptionIds.length )));
    }

    // will select and deselect a location on click
    function handleLocationClick(loc : FilteredLocation) {
        if(selectedLocation == loc) {
            setSelectedLocation(null);
        } else {
            setSelectedLocation(loc);
            for (let i = 0; i < loc.options.length; i++) {
                if (loc.options[i].selection_valid.length == 1) {
                    UpdateSelectedOptionIDs({option_refID: loc.options[i].baseopt.RefID, selection_ID: loc.options[i].selection_valid[0].id})
                }
            }
        }
    }

    return (
        <Modal show={show} onHide={onClose} className="WbbModalAddItem WbbModalAddExplorationLocation" centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>Select Exploration Location</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <div  className={'WbbGeneralCollapse-wrap'} >
                {availableoptions.map((adv) => (
                    <WbbGeneralCollapse
                        key={adv.table.ID}
                        title={makestringpresentable(adv.table.GetTrueName())}
                        initiallyOpen={false}
                        nopad={true}
                    >
                        <>
                            {adv.valid_locs.map((loc) =>
                                <>
                                    {/* Select Row */}
                                    <div
                                        key={loc.location.ID}
                                        className={`select-item ${(selectedLocation? selectedLocation.location.ID : "") === loc.location.ID ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedOptionIds([]); // reset when switching location
                                            handleLocationClick(loc);
                                        }}
                                    >
                                        <div className="item-name">
                                            {loc.location.TableValue+' - '+loc.location.GetTrueName()}
                                        </div>

                                    </div>

                                    {/* Level 1 Sub-Display when selected */}
                                    {((selectedLocation ? selectedLocation.location.ID : "") === loc.location.ID) &&
                                        <div className={'WbbGeneralCollapse-sub-1'}>

                                            {/* Location Description Text */}
                                            {(loc.location.Description != null) &&
                                                <div className={'description-wrap'}>
                                                    {
                                                        returnDescription(location, loc.location.Description)
                                                    }
                                                </div>
                                            }

                                            {/* options for selected location */}
                                            {(selectedLocation != null && selectedLocation.options.length > 0) &&
                                                <div className="">
                                                    <label className={'mb-2'}>
                                                        Select Options for {selectedLocation?.location.GetTrueName()}:
                                                    </label>

                                                    {/* options */}
                                                    {selectedLocation.options.map(opt =>
                                                        <>
                                                            {opt.selection_valid.map(choice => (
                                                                <>
                                                                    {/* option select */}
                                                                    <div
                                                                        key={opt.baseopt.RefID + choice.id}
                                                                        className={`select-item ${ (
                                                                            selectedOptionIds.find((k) => k.option_refID == opt.baseopt.RefID && k.selection_ID == choice.id)
                                                                        ) ? 'selected' : ''}`}
                                                                        onClick={() => UpdateSelectedOptionIDs({option_refID: opt.baseopt.RefID, selection_ID: choice.id})}
                                                                    >
                                                                        {choice.display_str}
                                                                    </div>

                                                                    {/* option details */}
                                                                    {(
                                                                        selectedOptionIds.find((k) => k.option_refID == opt.baseopt.RefID && k.selection_ID == choice.id)
                                                                    ) &&
                                                                        <div className={'WbbGeneralCollapse-sub-2'}>
                                                                            <div className={'description-wrap'}>
                                                                            {(choice.value.Description != null) &&
                                                                                <div className={'description-wrap'}>
                                                                                    {
                                                                                        returnDescription(choice.value, choice.value.Description)
                                                                                    }
                                                                                </div>
                                                                            }

                                                                            </div>
                                                                        </div>

                                                                    }
                                                                </>
                                                            ))}
                                                        </>)}
                                                </div>
                                            }
                                        </div>
                                    }
                                </>
                            )}
                        </>
                    </WbbGeneralCollapse>
                ))}
                </div>


            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>

                <Button variant="primary" onClick={handleSubmit} disabled={isubmitdisabled || isSubmitting}>
                    {isSubmitting ? (
                        <FontAwesomeIcon icon={faCircleNotch} className={'icon-inline-left fa-spin '} />
                    ): (
                        <FontAwesomeIcon icon={faPlus} className={'icon-inline-left'} />
                    )}
                    {'Add Location'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WbbModalAddExplorationLocation;
