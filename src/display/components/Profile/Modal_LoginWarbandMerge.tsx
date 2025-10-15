import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faXmark} from "@fortawesome/free-solid-svg-icons";
import AlertCustom from "../generics/AlertCustom";

interface ModalLoginWarbandMergeProps {
    show: boolean;       // controlled: visible or not
    onClose: () => void; // controlled: close handler
}

/**
 * Bootstrap modal shell for "Login Warband Merge".
 * The content body is intentionally empty; fill it in where used.
 */
const Modal_LoginWarbandMerge: React.FC<ModalLoginWarbandMergeProps> = ({
        show,
        onClose,
    }) => {

    const uploadLocalWarbands = () => {
        alert('Do upload here');
        alert('Remove local warbands from local storage');
    }


    return (
        <Modal show={show}
               onHide={onClose}
               className="Modal_LoginWarbandMerge"
               centered
        >
            <Modal.Header closeButton={false}>
                <Modal.Title>{'Upload Warbands'}</Modal.Title>

                <FontAwesomeIcon
                    icon={faXmark}
                    className="modal-close-icon"
                    role="button"
                    onClick={onClose}
                />
            </Modal.Header>

            <Modal.Body>
                <AlertCustom
                    type={'warning'}
                    className={'mb-3'}
                >
                    <h5>{'Upload warbands from this device?'}</h5>
                    <p>
                        {'You have saved warbands on this device, that are not uploaded to the cloud. Do you want to save your local warbands to your user profile?'}
                        <br/><br/>
                        {'If you do not upload these warbands, they will only be available on this device when you log out.'}
                    </p>

                    <div className={'fw-bold'}>
                        {'Your local Warbands:'}
                    </div>
                    {/* Show list of names of local warbands here*/}
                    <ul>
                        <li>{'Lorem Warband Name'}</li>
                    </ul>
                </AlertCustom>

                <button
                    className={'btn btn-primary w-100 mb-3'}
                    onClick={() => {
                        uploadLocalWarbands();
                    }}
                >
                    <FontAwesomeIcon icon={faFloppyDisk} className={'me-2'}/>
                    {'Upload warbands'}
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default Modal_LoginWarbandMerge;


