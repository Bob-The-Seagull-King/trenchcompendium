import React, {useEffect, useState} from 'react';
import { OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsisVertical,
    faTrash,
    faCopy,
    faArrowUp,
    faArrowLeft,
    faCoins,
    faEdit, faPen, faFileExport, faDice, faSignature, faPrint, faArrowRotateLeft, faSackDollar, faXmark, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { usePopover } from '../../../context/PopoverContext';
import { useWarband } from '../../../context/WarbandContext';
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";
import {useGlobalState} from "../../../utility/globalstate";
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandMember } from '../../../classes/saveitems/Warband/Purchases/WarbandMember';
import WbbMoveEquipmentToFighterModal from './modals/warband/WbbMoveEquipmentToFighterModal';
import { UserWarband } from '../../../classes/saveitems/Warband/UserWarband';
import {SumWarband, WarbandManager} from "../../../classes/saveitems/Warband/WarbandManager";
import { useNavigate } from 'react-router-dom';

interface WbbContextualPopoverProps {
    id: string;
    type: 'fighter' | 'injury' | 'advancement' | 'modifier' | 'exploration' | 'equipment' | 'equipment_model' | 'warband';
    item: any;
    context?: RealWarbandPurchaseModel | null;
    contextuallimit?: boolean;
}

const WbbContextualPopover: React.FC<WbbContextualPopoverProps> = ({ id, type, item, context = null, contextuallimit = false }) => {

    if (type == 'equipment_model' && (context == undefined || context == null)) {
        return (
            <>
                {"Model context not found."}
            </>
        )
    }

    const navigate = useNavigate(); 

    // Wrapper function to stop event propagation from this popover
    const withStopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        fn();
    };

    const { activePopoverId, setActivePopoverId } = usePopover();
    const { warband, reloadDisplay } = useWarband();
    const { playMode, togglePlayMode } = usePlayMode();
    const { setPrintMode } = usePrintMode();
    const [newname, setName] = useState("")
    const [exportFull, setExportFull] = useState<boolean>(true); // export options
    const [exportCopySuccess, setExportCopySuccess] = useState<boolean>(false); // export copied to clipboard
    const isActive = activePopoverId === id;

    const handleToggle = () => {
        setActivePopoverId(isActive ? null : id);
    };


    /** Fighter Actions */
    const [fighterName, setFighterName] = React.useState(
        type === 'fighter' && item?.model ? item.model.GetFighterName() : ''
    );

    const [showConfirmDeleteFighterModal, setshowConfirmDeleteFighterModal] = useState(false);
    const [showConfirmRenameFighterModal, setshowConfirmRenameFighterModal] = useState(false);
    const [showConfirmRefundFighterModal, setshowConfirmRefundFighterModal] = useState(false);
    const showConfirmRenameFighter = () => {
        setshowConfirmRenameFighterModal(true);
    }

    const handleRenameFighter = () => {
        setshowConfirmRenameFighterModal(false);
        (item).model.RenameSelf(fighterName);
        warband?.warband_data.RebuildProperties().then(() => {
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
            () => reloadDisplay())})
    }

    const handleCopyFighter = () => {

        warband?.warband_data.DuplicateFighter(item).then((result : string) => {
            if (result.includes(" Sucessfully Duplicated") == false) {
                toast.error(result);
            } else { 
                warband?.warband_data.RebuildProperties().then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())})
                
            }
        })
    }


    const showConfirmRefundFighter = () => {
        setshowConfirmRefundFighterModal(true);
    }
    const handleRefundFighter = () => {
        setshowConfirmRefundFighterModal(true);


        warband?.warband_data.DeleteFighter(item).then(() =>
            warband?.warband_data.RebuildProperties().then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())}))
    }

    const showConfirmDeleteFighter = () => {
        setshowConfirmDeleteFighterModal(true);
    }
    const handleDeleteFighter = () => {
        setshowConfirmDeleteFighterModal(false);

        warband?.warband_data.DeleteFighterWithDebt(item, 1).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        })
    }


    /** Modifier Actions */
    const [showConfirmDeleteModifierModal, setshowConfirmDeleteModifierModal] = useState(false);

    const showConfirmDeleteModifier = () => {
        setshowConfirmDeleteModifierModal(true);
    }
    const handleDeleteModifier = () => {
        setshowConfirmDeleteModifierModal(false);

        warband?.warband_data.Deletemod(item).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        })
    }

    /** Exploration Actions */
    const [showConfirmDeleteExplorationModal, setshowConfirmDeleteExplorationModal] = useState(false);

    const showConfirmDeleteExploration = () => {
        setshowConfirmDeleteExplorationModal(true);
    }
    const handleDeleteExploration = () => {
        setshowConfirmDeleteExplorationModal(false);

        warband?.warband_data.DeleteLocation(item).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        })
    }

    /** Equipment Actions */
    const [showConfirmDeleteEquipmentModal, setshowConfirmDeleteEquipmentModal] = useState(false);
    const [showConfirmRefundEquipmentModal, setshowConfirmRefundEquipmentModal] = useState(false);
    const [showConfirmSellEquipmentModal, setshowConfirmSellEquipmentModal] = useState(false);
    const [showConfirmMoveEquipmentModal, setshowConfirmMoveEquipmentModal] = useState(false);


    const handleMoveEquipmentToStash = () => {
        if (!(context == undefined || context == null )) {
            context.model.DeleteStash(item).then(() => {
                warband?.warband_data.DirectAddStash(item).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
                })
            })
            
        }
    }

    const showConfirmMoveEquipment = () => {
        setshowConfirmMoveEquipmentModal(true);
    }

    const handleMoveEquipment = (selectedFighter : WarbandPurchase) => {
        if (selectedFighter != null) {
            if (context == undefined || context == null) {
                warband?.warband_data.DeleteStash(item).then(() => {
                    (selectedFighter.HeldObject as WarbandMember).DirectAddStash(item).then(() => {
                    const Manager : ToolsController = ToolsController.getInstance();
                    Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                        () => reloadDisplay())
                    })
                })
            } else {
                context.model.DeleteStash(item).then(() => {
                    (selectedFighter.HeldObject as WarbandMember).DirectAddStash(item).then(() => {
                    const Manager : ToolsController = ToolsController.getInstance();
                    Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                        () => reloadDisplay())
                    })
                })
            }
            setshowConfirmMoveEquipmentModal(false)
        }
    }

    const showConfirmSellEquipment = () => {
        setshowConfirmSellEquipmentModal(true);
    }

    const handleSellEquipment = () => {
        if (context == undefined || context == null) {
            warband?.warband_data.DeleteStashWithDebt(item, 0.5).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        } else {
            context.model.DeleteStashWithDebt(item, 0.5).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        }
        setshowConfirmSellEquipmentModal(false);
    }

    const handleCopyEquipment = () => {

        if (context == undefined || context == null) {
            warband?.warband_data.CopyStash(item).then((result : string) => {
                if (result.includes(" Sucessfully Duplicated") == false) {
                    toast.error(result);
                } else { 
                    const Manager : ToolsController = ToolsController.getInstance();
                    Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                        () => reloadDisplay())
                    
                }
            })
        } else {
            context.model.CopyStash(item).then((result : string) => {
                if (result.includes(" Sucessfully Duplicated") == false) {
                    toast.error(result);
                } else { 
                    const Manager : ToolsController = ToolsController.getInstance();
                    Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                        () => reloadDisplay())
                    
                }
            })
        }
    }

    const showConfirmRefundEquipment = () => {
        setshowConfirmRefundEquipmentModal(true);
    }

    const handleRefundEquipment = () => {
        setshowConfirmRefundEquipmentModal(false);
        
        if (context == undefined || context == null ) {
            warband?.warband_data.DeleteStash(item).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        } else {
            context.model.DeleteStash(item).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        }
    }

    const showConfirmDeleteEquipment = () => {
        setshowConfirmDeleteEquipmentModal(true);
    }
    const handleDeleteEquipment = () => {
        setshowConfirmDeleteEquipmentModal(false);
        
        if (context == undefined || context == null) {
            warband?.warband_data.DeleteStashWithDebt(item, 1).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        } else {
            context.model.DeleteStashWithDebt(item, 1).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        }
    }

    /** Advancement Actions */
    const [showConfirmDeleteAdvancementModal, setshowConfirmDeleteAdvancementModal] = useState(false);

    const showConfirmDeleteAdvancement = () => {
        setshowConfirmDeleteAdvancementModal(true);
    }
    const handleDeleteAdvancement = () => {
        setshowConfirmDeleteAdvancementModal(false);
        
        if (context != undefined && context != null ) {
            context.model.DeleteSkill(item).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        } 
    }

    /** Injury Actions */
    const [showConfirmDeleteInjuryModal, setshowConfirmDeleteInjuryModal] = useState(false);
    const showConfirmDeleteInjury = () => {
        setshowConfirmDeleteInjuryModal(true);
    }
    const handleDeleteInjury = () => {
        setshowConfirmDeleteInjuryModal(false);
        
        if (context != undefined && context != null ) {
            context.model.DeleteInjury(item).then(() => {
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        } 
    }

    /** Warband Actions */
    const [showConfirmRenameWarbandModal, setshowConfirmRenameWarbandModal] = useState(false);
    const [showConfirmExportWarbandModal, setshowConfirmExportWarbandModal] = useState(false);
    const [showConfirmDeleteWarbandModal, setshowConfirmDeleteWarbandModal] = useState(false);
    const showConfirmRenameWarband = () => {
        setshowConfirmRenameWarbandModal(true);
    }
    const handleRenameWarband = () => {
        setshowConfirmRenameWarbandModal(false);
        warband?.warband_data.SetWarbandName(newname)
        const Manager : ToolsController = ToolsController.getInstance();
        Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
            () => reloadDisplay())

    }
    const showConfirmExportWarband = () => {
        setshowConfirmExportWarbandModal(true);
    }

    /** Delete a warband  **/
    const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

    // deletes the warband
    const handleDeleteWarband = () => {
        if( deleteConfirmInput == 'confirm') {
            
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.DeletePack(item.id).then(() =>
                    navigate("./warband", {state: Date.now().toString()}));
            
        }
    }


    /** Print Mode */
    const handlePrintWarband = () => {

        setPrintMode(true);

        // Switch to print theme
        document.body.setAttribute('data-theme', 'light');
        document.body.setAttribute('data-print', 'print');

        setTimeout(() => {
            window.print();
        }, 200);
    };

    // Listen to print ending (using window events)
    const [theme, setTheme] = useGlobalState('theme');
    useEffect(() => {
        const handleAfterPrint = () => {

            setPrintMode(false);
            document.body.setAttribute('data-theme', theme);
            document.body.setAttribute('data-print', '');

        };

        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    /** Hides popover when a modal is opened */
    useEffect(() => {
        if (showConfirmDeleteFighterModal
            || showConfirmRenameFighterModal
            || showConfirmRefundFighterModal
            || showConfirmDeleteModifierModal
            || showConfirmDeleteExplorationModal
            || showConfirmDeleteEquipmentModal
            || showConfirmSellEquipmentModal
            || showConfirmRefundEquipmentModal
            || showConfirmMoveEquipmentModal
            || showConfirmDeleteAdvancementModal
            || showConfirmDeleteInjuryModal
            || showConfirmRenameWarbandModal
            || showConfirmExportWarbandModal
        ) {
            setActivePopoverId(null);
        }
    }, [
        showConfirmDeleteFighterModal,
        showConfirmRenameFighterModal,
        showConfirmRefundFighterModal,
        showConfirmDeleteModifierModal,
        showConfirmDeleteExplorationModal,
        showConfirmDeleteEquipmentModal,
        showConfirmSellEquipmentModal,
        showConfirmRefundEquipmentModal,
        showConfirmMoveEquipmentModal,
        showConfirmDeleteAdvancementModal,
        showConfirmDeleteInjuryModal,
        showConfirmRenameWarbandModal,
        showConfirmExportWarbandModal
    ]);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <OverlayTrigger
                trigger="click"
                placement="left"
                show={isActive}
                onToggle={handleToggle}
                rootClose={true}
                overlay={
                    <Popover.Body className="popover Wbb-item-actions-popover">
                        <div className="actions">
                            {type === 'fighter' &&
                                <>
                                    <div className="action action-rename"
                                         onClick={withStopPropagation(showConfirmRenameFighter)}>
                                        <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                        {'Rename Fighter'}
                                    </div>
                                    <div className="action action-copy"
                                         onClick={withStopPropagation(handleCopyFighter)}>
                                        <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                        {'Copy Fighter'}
                                    </div>
                                    <div className="action action-refund"
                                         onClick={withStopPropagation(showConfirmRefundFighter)}>
                                        <FontAwesomeIcon icon={faArrowRotateLeft} className="icon-inline-left-l"/>
                                        {'Refund Fighter'}
                                    </div>
                                    <div className="action action-delete"
                                         onClick={withStopPropagation(showConfirmDeleteFighter)}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Fighter'}
                                    </div>
                                </>
                            }

                            {type === 'modifier' &&
                                <>
                                    <div className="action action-delete" onClick={showConfirmDeleteModifier}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Modifier'}
                                    </div>
                                </>
                            }

                            {type === 'exploration' &&
                                <>
                                    <div className="action action-delete" onClick={showConfirmDeleteExploration}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Exploration'}
                                    </div>
                                </>
                            }

                            {(type === 'equipment' || type === 'equipment_model') &&
                                <>
                                {(item.purchase as WarbandPurchase).ModelPurchase == false && <>
                                {contextuallimit != true &&
                                    <>
                                    
                                    <div
                                    className={'action action-move-to-fighter'} onClick={withStopPropagation(showConfirmMoveEquipment)}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="icon-inline-left-l"/>
                                        {'Move to Fighter'}
                                    </div>
                                    {type === 'equipment_model' &&

                                        <div
                                            className={'action action-move-to-stash'} onClick={withStopPropagation(handleMoveEquipmentToStash)}
                                        >
                                            <FontAwesomeIcon icon={faArrowUp} className="icon-inline-left-l"/>
                                            {'Move to Stash'}
                                        </div>
                                    }</>}
                                    </>
                                }

                                    <div
                                        className={'action action-sell'} onClick={withStopPropagation(showConfirmSellEquipment)}
                                    >
                                        <FontAwesomeIcon icon={faCoins} className="icon-inline-left-l"/>
                                        {'Sell Item'}
                                    </div>

                                    {((item.purchase as WarbandPurchase).ModelPurchase == false) &&
                                        <>
                                    <div
                                        className={'action action-copy'} onClick={withStopPropagation(handleCopyEquipment)}
                                    >
                                        <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                        {'Copy Item'}
                                    </div>

                                    <div className="action action-refund" onClick={withStopPropagation(showConfirmRefundEquipment)}>
                                        <FontAwesomeIcon icon={faArrowRotateLeft} className="icon-inline-left-l"/>
                                        {'Refund Item'}
                                    </div>

                                    <div className="action action-delete" onClick={withStopPropagation(showConfirmDeleteEquipment)}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Item'}
                                    </div>
                                    </>
                                    }
                                </>
                            }

                            {type === 'advancement' &&
                                <>
                                    <div className="action action-delete" onClick={showConfirmDeleteAdvancement}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Advancement'}
                                    </div>
                                </>
                            }

                            {type === 'injury' &&
                                <>
                                    <div className="action action-delete" onClick={showConfirmDeleteInjury}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Remove Injury'}
                                    </div>
                                </>
                            }

                            {type === 'warband' &&
                                <>
                                    {playMode &&
                                        <div className="action action-rename" onClick={() => {
                                            setActivePopoverId(null);
                                            togglePlayMode();
                                        }}>
                                            <FontAwesomeIcon icon={faPen} className="icon-inline-left-l"/>
                                            {'Enter Edit Mode'}
                                        </div>
                                    }

                                    {!playMode &&
                                        <div className="action action-rename" onClick={() => {
                                            setActivePopoverId(null);
                                            togglePlayMode();
                                        }}>
                                            <FontAwesomeIcon icon={faDice} className="icon-inline-left-l"/>
                                            {'Enter Play Mode'}
                                        </div>
                                    }

                                    <div className="action" onClick={showConfirmRenameWarband}>
                                        <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                        {'Rename Warband'}
                                    </div>
                                    <div className="action" onClick={showConfirmExportWarband}>
                                        <FontAwesomeIcon icon={faFileExport} className="icon-inline-left-l"/>
                                        {'Export Warband'}
                                    </div>
                                    <div className="action" onClick={() => {
                                        setActivePopoverId(null);
                                        handlePrintWarband();
                                    }}>
                                        <FontAwesomeIcon icon={faPrint} className="icon-inline-left-l"/>
                                        {'Print Warband'}
                                    </div>

                                    <div className="action" onClick={() => setshowConfirmDeleteWarbandModal(true)}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l"/>
                                        {'Delete Warband'}
                                    </div>
                                </>
                            }
                        </div>
                    </Popover.Body>
                }>

                <div className="Wbb-item-actions" onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical}/>
                </div>
            </OverlayTrigger>

            {/* Fighter interactions */}
            {/** Delete Fighter Confirm Modal */}
            <Modal show={showConfirmDeleteFighterModal} onHide={() => setshowConfirmDeleteFighterModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Fighter`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmDeleteFighterModal(false);
                            }
                        }
                    />
                </Modal.Header>


                <Modal.Body>
                    {'Are you sure you want to delete '}
                    {(item as RealWarbandPurchaseModel).model != undefined &&

                        <strong>
                            {(item as RealWarbandPurchaseModel).model.CurModel.GetTrueName() + ' - ' + (item as RealWarbandPurchaseModel).model.GetTrueName()}
                        </strong>
                    }
                    {"?"}

                    <p className={'mt-4 small'}>
                        <i>
                            {'This will remove the fighter from your roster.'}

                            <ul>
                                <li>
                                    {'All Equipment will be removed.'}
                                </li>
                                <li>
                                    {'The costs will not be refunded'}
                                </li>
                                <li>
                                    {'You will not be able to recover this fighter.'}
                                </li>
                            </ul>
                        </i>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmDeleteFighterModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleDeleteFighter)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Refund Fighter Confirm Modal */}
            <Modal show={showConfirmRefundFighterModal} onHide={() => setshowConfirmRefundFighterModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Refund Fighter`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmRefundFighterModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to refund '}
                    {(item as RealWarbandPurchaseModel).model != undefined &&

                    <strong>
                        {(item as RealWarbandPurchaseModel).model.CurModel.GetTrueName() + ' - ' + (item as RealWarbandPurchaseModel).model.GetTrueName()}
                    </strong>
                    }

                    <p className={'mt-4 small'}>
                        <i>
                            {'This will remove the fighter from your roster and refund all costs for the fighter and its equipment.'}
                        </i>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmRefundFighterModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleRefundFighter)}>
                        Refund
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Rename Fighter Confirm Modal */}
            <Modal show={showConfirmRenameFighterModal} onHide={() => setshowConfirmRenameFighterModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Rename Fighter`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmRenameFighterModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Fighter Name</label>
                        <input type="text" className="form-control"
                               placeholder="Fighter Name"
                               value={fighterName}
                               onChange={(e) => setFighterName(e.target.value)}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmRenameFighterModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={withStopPropagation(handleRenameFighter)}>
                        Rename
                    </Button>
                </Modal.Footer>
            </Modal>


            {/** Delete Modifier Confirm Modal */}
            <Modal show={showConfirmDeleteModifierModal} onHide={() => setshowConfirmDeleteModifierModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Modifier`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmDeleteModifierModal(false)}
                    />
                </Modal.Header>


                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this modifier?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteModifierModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteModifier}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Exploration Confirm Modal */}
            <Modal show={showConfirmDeleteExplorationModal} onHide={() => setshowConfirmDeleteExplorationModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Exploration Location`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmDeleteExplorationModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this Exploration?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteExplorationModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteExploration}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Refund Equipment Confirm Modal */}
            <Modal show={showConfirmRefundEquipmentModal} onHide={() => setshowConfirmRefundEquipmentModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Refund Equipment`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmRefundEquipmentModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to refund this Equipment?'}
                    </div>
                    {item.equipment &&
                        <div >
                            <strong>{item.equipment.Name }</strong>?
                        </div>
                    }
                    <br/>
                    <p>
                        <i>
                            {'This will remove the equipment and refund its costs.'}
                        </i>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmRefundEquipmentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRefundEquipment}>
                        Refund
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Equipment Confirm Modal */}
            <Modal show={showConfirmDeleteEquipmentModal} onHide={() => setshowConfirmDeleteEquipmentModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Equipment`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmDeleteEquipmentModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this Equipment?'}
                    </div>
                    {item.equipment &&
                        <div >
                            <strong>{item.equipment.Name }</strong>?
                        </div>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteEquipmentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteEquipment}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Sell Equipment Confirm Modal */}
            <Modal show={showConfirmSellEquipmentModal} onHide={() => setshowConfirmSellEquipmentModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Sell Equipment`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmSellEquipmentModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to sell this Equipment?'}
                    </div>

                    <p>
                        {((item as RealWarbandPurchaseEquipment).purchase != undefined) &&
                        <i>
                            {'This will remove this item from your roster and refund half its cost rounded up.'}
                            <br/>
                            {'You will receive: '}
                            {(item as RealWarbandPurchaseEquipment).purchase.GetTotalDucats() + " Ducats and " + (item as RealWarbandPurchaseEquipment).purchase.GetTotalGlory() + " Glory"}
                        </i>
                        }
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmSellEquipmentModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={withStopPropagation(handleSellEquipment)}>
                        Sell Equipment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Move Equipment to Fighter Confirm Modal */}
            <WbbMoveEquipmentToFighterModal 
                show={showConfirmMoveEquipmentModal}
                onClose={() => setshowConfirmMoveEquipmentModal(false)}
                onSubmit={handleMoveEquipment}
                warband={warband? warband.warband_data : null}
                contextItem={item}
            />

            {/** Delete Advancement Confirm Modal */}
            <Modal show={showConfirmDeleteAdvancementModal} onHide={() => setshowConfirmDeleteAdvancementModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Advancement`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                setshowConfirmDeleteAdvancementModal(false);
                            }
                        }
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this Advancement?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={
                        (e) => {
                            e.stopPropagation();
                            setshowConfirmDeleteAdvancementModal(false);
                        }
                    }>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={withStopPropagation(handleDeleteAdvancement)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Injury Confirm Modal */}
            <Modal show={showConfirmDeleteInjuryModal} onHide={() => setshowConfirmDeleteInjuryModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Injury`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmDeleteInjuryModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this Injury?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteInjuryModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteInjury}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Rename Warband Modal */}
            <Modal show={showConfirmRenameWarbandModal} onHide={() => setshowConfirmRenameWarbandModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Rename Warband`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmRenameWarbandModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Warband Name</label>
                        <input type="text" className="form-control"
                               placeholder="Warband Name"
                               defaultValue={warband?.warband_data.GetWarbandName()}
                               onChange={(e) => {setName(e.target.value)}}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmRenameWarbandModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRenameWarband}>
                        Rename
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Warband Modal */}
            <Modal show={showConfirmDeleteWarbandModal} onHide={() => setshowConfirmDeleteWarbandModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Delete Warband`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmDeleteWarbandModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <p >
                        {'Do you really want to delete this warband?'}
                    </p>

                    <div className={'mb-3'}>
                        <label className="form-label small" htmlFor={'delete-warband-confirm'}>
                            {"Type 'confirm' to delete your warband."}
                        </label>
                        <input
                            type="text" id={'delete-warband-confirm'}
                            className="form-control"
                            placeholder=""
                            value={deleteConfirmInput}
                            onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        />

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteWarbandModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary"
                            onClick={handleDeleteWarband}
                            disabled={deleteConfirmInput !== 'confirm'}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Export Warband Modal */}
            <Modal show={showConfirmExportWarbandModal} onHide={() => setshowConfirmExportWarbandModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>{`Export Warband`}</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setshowConfirmExportWarbandModal(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div className={'WbbExportWarband'}>


                        <div className={'mb-1'}>
                            <label>
                                {'Export Style'}
                            </label>
                        </div>

                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                className={`btn btn-secondary ${exportFull ? 'active' : ''}`}
                                onClick={() => setExportFull(true)}
                            >
                                Full
                            </button>
                            <button
                                type="button"
                                className={`btn btn-secondary ${!exportFull ? 'active' : ''}`}
                                onClick={() => setExportFull(false)}
                            >
                                Compact
                            </button>
                        </div>


                        <hr/>

                        <button
                            className={`btn btn-primary btn-copy mb-3 w-100 ${exportCopySuccess ? 'copy-success' : ''}`}
                            onClick={() => {
                                const exportText = (item as SumWarband).warband_data.BuildExport(exportFull).join('\n');
                                navigator.clipboard.writeText(exportText);
                                setExportCopySuccess(true);
                                setTimeout(() => setExportCopySuccess(false), 4000);
                            }}
                        >

                            {exportCopySuccess ? (
                                <>
                                    <FontAwesomeIcon icon={faCheck} className={'icon-inline-left-l'}/>
                                    {'Copied'}
                                </>
                            ): (
                                <>
                                    <FontAwesomeIcon icon={faCopy} className={'icon-inline-left-l'}/>
                                    {'Copy to Clipboard'}
                                </>
                            )}
                        </button>

                        <div className={'export-wrap'}>
                            {(item as SumWarband).warband_data &&
                                <pre style={{
                                    margin: 0,
                                    padding: 0,
                                    lineHeight: '1',
                                    width: "100%",
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {(item as SumWarband).warband_data.BuildExport(exportFull).map((line, index) => (
                                        <div key={index}>
                                            {line}
                                        </div>
                                    ))}
                            </pre>

                            }
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => setshowConfirmExportWarbandModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WbbContextualPopover;