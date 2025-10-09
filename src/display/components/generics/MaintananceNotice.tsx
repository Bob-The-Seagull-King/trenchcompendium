import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const MaintananceNotice: React.FC = () => {
    const [show, setShow] = useState(true);

    const message =
        "We will need to shut down our servers for a short period of time. During the maintenance, you will be unable to load or save your warbands. Any edits you make during that time will be lost.";

    // Maintenance Start: fester Zeitpunkt
    const maintenanceStart = new Date(1756123200 * 1000);

    const [timeLeft, setTimeLeft] = useState<number>(
        maintenanceStart.getTime() - Date.now()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(maintenanceStart.getTime() - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [maintenanceStart]);

    const formatCountdown = (ms: number): string => {
        if (ms <= 0) return "0s";
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleClose = () => setShow(false);

    const isInMaintenance = timeLeft <= 0;

    return (
        <div className={"MaintananceNotice"}>
            <div className={"MaintananceNotice-button"}>
                <div
                    className={"btn btn-primary w-100"}
                    onClick={() => {
                        setShow(true);
                    }}
                >
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="me-3 icon-wraning"
                    />
                    Server Maintenance
                    <FontAwesomeIcon icon={faChevronUp} className="ms-1" />
                </div>
            </div>

            <Modal show={show} onHide={isInMaintenance ? undefined : handleClose} centered>
                <Modal.Header closeButton={!isInMaintenance}>
                    <Modal.Title>Maintenance Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                    <p>Thank you for your patience</p>

                    <p>
                        <strong>Maintenance starts at:</strong>{" "}
                        {maintenanceStart.toLocaleString(undefined, {
                            timeZoneName: "short",
                        })}
                    </p>

                    {!isInMaintenance && (
                        <p>
                            <strong>Maintenance starts in:</strong>{" "}
                            {formatCountdown(timeLeft)}
                        </p>
                    )}

                    {isInMaintenance && (
                        <p className="text-danger fw-bold">Maintenance in progress</p>
                    )}
                </Modal.Body>
                {!isInMaintenance && (
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            OK
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default MaintananceNotice;