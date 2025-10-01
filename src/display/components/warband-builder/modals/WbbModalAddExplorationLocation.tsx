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
    onSubmit: (options : FilteredLocation ) => void;
}

const WbbModalAddExplorationLocation: React.FC<WbbModalAddExplorationLocationProps> = ({ show, onClose, onSubmit }) => {
    const { warband, updateKey, reloadDisplay } = useWarband();

    const [selectedLocation, setSelectedLocation] = useState<FilteredLocation | null>(null);
    const [openedLocation, setOpenedLocation] = useState<FilteredLocation | null>(null);
    const [availableLocations, setavailableLocations] = useState<ExplorationTableSuite[]>([]);

    const [isubmitdisabled, setisubmitdisabled] = useState<boolean>(true);
    const [keyvar, setkeyvar] = useState(0);

    // handlesubmit in this callback for delayed submission with loading state
    const { handleSubmit, isSubmitting } = useModalSubmitWithLoading(() => {
        if (selectedLocation) {
            const expl : ExplorationTableSuite = availableLocations.filter((item) => item.valid_locs.filter((sub) => sub.location.ID == selectedLocation.location.ID).length > 0)[0]
            const filteredop : FilteredLocation = expl.valid_locs.filter((item) => item.location.ID == selectedLocation.location.ID)[0]
            onSubmit(filteredop);
            setSelectedLocation(null);
            onClose();
        }
    });

    useEffect(() => {
        async function RunGetLocations() {
            const availableLocations : ExplorationTableSuite[] | undefined = await warband?.warband_data.GetAvailableLocations();
            if (availableLocations != undefined) {
                setavailableLocations(availableLocations);
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
    }, [updateKey, selectedLocation]);

    function RedoSubmitDisabled() {
        setisubmitdisabled(!selectedLocation?.location.GetID());
    }

    // Returns bool if location be selected
    function canSelectLocation (loc : FilteredLocation) {
        return true; //@TODO: add check here
    }

    // will select and deselect a location on click
    function handleLocationClick(loc : FilteredLocation) {

        if(openedLocation == loc) { // click on opened location
            setOpenedLocation(null);
            setSelectedLocation(null);
        } else { // click on an unselected location
            setOpenedLocation(loc); // open clicked location

            if( canSelectLocation(loc) ) { // only select location if can be selected
                setSelectedLocation(loc);
            } else {
                setSelectedLocation(null); // reset selection
            }
        }
    }

    return (
        <Modal show={show} onHide={onClose} className="WbbModal WbbModalSelect WbbModalSelect_Exploration WbbModalAddExplorationLocation" centered>
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
                {availableLocations.map((adv) => (
                    <WbbGeneralCollapse
                        key={adv.table.ID}
                        title={makestringpresentable(adv.table.GetTrueName())}
                        initiallyOpen={false}
                        nopad={true}
                    >
                        <>
                            {/* @TODO: show all locations here - not only available ones*/}
                            {adv.valid_locs.map((loc) =>
                                <>
                                    {/* Select Row */}
                                    <div
                                        key={loc.location.ID}
                                        className={`select-item 
                                            ${(openedLocation? openedLocation.location.ID : "") === loc.location.ID ? 'selected details-open' : ''}
                                            ${ canSelectLocation(loc) ? '' : 'disabled'}
                                        `}
                                        onClick={() => {
                                            handleLocationClick(loc);
                                        }}
                                    >
                                        <div className="item-name">
                                            {loc.location.TableValue+' - '+loc.location.GetTrueName()}
                                        </div>

                                    </div>

                                    {/* Level 1 Sub-Display when selected */}
                                    {((openedLocation ? openedLocation.location.ID : "") === loc.location.ID) &&
                                        <div className={'select-item-details'}>

                                            {/* Location Description Text */}
                                            {(loc.location.Description != null) &&
                                                <div className={'exploration-description'}>
                                                    {
                                                        returnDescription(location, loc.location.Description)
                                                    }
                                                </div>
                                            }

                                            {/* options for selected location */}
                                            {(openedLocation != null && openedLocation.location.MyOptions.length > 0) &&
                                                <ul className="exploration-description-options">
                                                    {/* options */}
                                                    {openedLocation.location.MyOptions.map(opt =>

                                                        <>
                                                            {opt.Selections.map(choice => (
                                                                <>
                                                                    {/* @TODO: Show all option (even unavailable ones) here */}
                                                                    <li className={'exploration-description-option'}>
                                                                        <span className={'option-name'}>
                                                                            {choice.display_str}
                                                                        </span>
                                                                        <span className={'option-description'}>
                                                                            {returnDescription(choice.value, choice.value.Description)}
                                                                        </span>
                                                                    </li>
                                                                </>
                                                            ))}
                                                        </>)}
                                                </ul>
                                            }
                                        </div>
                                    }
                                </>
                            )}
                        </>
                    </WbbGeneralCollapse>
                ))}
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
