import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faFloppyDisk, faXmark} from "@fortawesome/free-solid-svg-icons";
import AlertCustom from "../generics/AlertCustom";
import { ToolsController } from "../../../classes/_high_level_controllers/ToolsController";
import { SumWarband, WarbandManager } from "../../../classes/saveitems/Warband/WarbandManager";

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

        
    const [manager, setmanager] = useState<null | WarbandManager>();
    const [locals, setlocals] = useState<SumWarband[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        async function HandleManager() {
            const Manager : ToolsController = ToolsController.getInstance();
            setlocals(await Manager.UserWarbandManager.GrabLocalItems())
            setmanager(Manager.UserWarbandManager)
            
        }

        HandleManager()
    }, [])

    const uploadLocalWarbands = () => {

        setIsLoading(true);

        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UploadWarbands().then(() => {onClose()})
        
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
                        {'You have saved warbands on this device, that are not uploaded to the cloud. Do you want to remove them from your device and save your local warbands to your user profile?'}
                        <br/><br/>
                        {'If you do not upload these warbands, they will only be available on this device when you log out.'}
                    </p>

                    <div className={'fw-bold'}>
                        {'Your local Warbands:'}
                    </div>
                    {/* Show list of names of local warbands here*/}
                    <ul>
                        {locals.map((item, index) => 
                        <li key={index}>{item.warband_data.GetTrueName()}</li>)}
                    </ul>
                </AlertCustom>

                {isLoading ? (
                    <button
                        className={'btn btn-primary w-100 mb-3'}
                        disabled={true}
                    >
                        <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'}/>
                        {'Uploading'}
                    </button>
                ):(
                    <button
                        className={'btn btn-primary w-100 mb-3'}
                        onClick={() => {
                            uploadLocalWarbands();
                        }}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} className={'me-2'}/>
                        {'Upload warbands'}
                    </button>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default Modal_LoginWarbandMerge;


