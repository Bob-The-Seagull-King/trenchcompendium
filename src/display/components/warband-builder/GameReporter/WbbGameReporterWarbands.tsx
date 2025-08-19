import React, { useState } from "react";
import {useWbbGameReportDetailView} from "../../../../context/WbbGameReportDetailViewContext";
import {Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {returnDescription} from "../../../../utility/util";
import WbbOptionSelect from "../modals/warband/WbbOptionSelect";

const availableWarbands = [
    { id: "w1", name: "Iron Fists" },
    { id: "w2", name: "Shadow Stalkers" },
    { id: "w3", name: "Silver Blades" },
];

const WbbGameReporterWarbands: React.FC = () => {
    const { state, addWarband, removeWarband } = useWbbGameReportDetailView();
    const [showWarbandsModal, setShowWarbandsModal] = useState(false);

    const handleAddWarband = (id: string) => {
        const warband = availableWarbands.find((w) => w.id === id);
        if (warband) {
            addWarband(warband.id, warband.name);
            setShowWarbandsModal(false);
        }
    };

    return (
        <div className="WbbGameReporterWarbands my-3">
            <h3 className="mb-3">{"Select Warbands"}</h3>

            {/* Liste ausgewählter Warbands */}
            <ul className="list-group">
                {state.warbands.map((w) => (
                    <li key={w.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {w.name}
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeWarband(w.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-primary w-100 my-3" onClick={() => setShowWarbandsModal(true)}>
                {"Add Warband"}
            </button>

            {/* Modal for Warband Selection */}
            <Modal show={showWarbandsModal} onHide={() => setShowWarbandsModal(false)} centered>
                <Modal.Header>
                    <Modal.Title>{"Select Warband"}</Modal.Title>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="ms-auto"
                        role="button"
                        onClick={() => setShowWarbandsModal(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        {availableWarbands.map((w) => (
                            <li
                                key={w.id}
                                className="list-group-item list-group-item-action"
                                role="button"
                                onClick={() => handleAddWarband(w.id)}
                            >
                                {w.name}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default WbbGameReporterWarbands;
