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
    faEdit, faPen, faFileExport, faDice, faSignature, faPrint, faArrowRotateLeft, faSackDollar
} from '@fortawesome/free-solid-svg-icons';
import { usePopover } from '../../../context/PopoverContext';
import { useWarband } from '../../../context/WarbandContext';
import {usePlayMode} from "../../../context/PlayModeContext";
import {usePrintMode} from "../../../context/PrintModeContext";
import {useGlobalState} from "../../../utility/globalstate";
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import { RealWarbandPurchaseEquipment, RealWarbandPurchaseModel, WarbandPurchase } from '../../../classes/saveitems/Warband/Purchases/WarbandPurchase';
import { WarbandMember } from '../../../classes/saveitems/Warband/Purchases/WarbandMember';

interface WbbContextualPopoverProps {
    id: string;
    type: 'fighter' | 'injury' | 'advancement' | 'modifier' | 'exploration' | 'equipment' | 'equipment_model' | 'warband';
    item: any;
    context?: RealWarbandPurchaseModel | null;
}

const WbbContextualPopover: React.FC<WbbContextualPopoverProps> = ({ id, type, item, context = null }) => {

    if (type == 'equipment_model' && (context == undefined || context == null)) {
        return (
            <>
                {"Model context not found."}
            </>
        )
    }

    const [selectedFighter, setSelectedFighter] = useState<WarbandPurchase | null>(null);

    const { activePopoverId, setActivePopoverId } = usePopover();
    const { warband, reloadDisplay } = useWarband();
    const { playMode, togglePlayMode } = usePlayMode();
    const { setPrintMode } = usePrintMode();
    const [newname, setName] = useState("")

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

    const handleMoveEquipment = () => {
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
        <>
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
                                    <div className="action action-rename" onClick={showConfirmRenameFighter}>
                                        <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                        {'Rename Fighter'}
                                    </div>
                                    <div className="action action-copy" onClick={handleCopyFighter}>
                                        <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                        {'Copy Fighter'}
                                    </div>
                                    <div className="action action-refund" onClick={showConfirmRefundFighter}>
                                        <FontAwesomeIcon icon={faArrowRotateLeft} className="icon-inline-left-l"/>
                                        {'Refund Fighter'}
                                    </div>
                                    <div className="action action-delete" onClick={showConfirmDeleteFighter}>
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
                                    <div
                                    className={'action action-move-to-fighter'} onClick={showConfirmMoveEquipment}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="icon-inline-left-l"/>
                                        {'Move to Fighter'}
                                    </div>
                                    {type === 'equipment_model' &&

                                        <div
                                            className={'action action-move-to-stash'} onClick={handleMoveEquipmentToStash}
                                        >
                                            <FontAwesomeIcon icon={faArrowUp} className="icon-inline-left-l"/>
                                            {'Move to Stash'}
                                        </div>
                                    }</>}
                                    

                                    <div
                                        className={'action action-sell'} onClick={showConfirmSellEquipment}
                                    >
                                        <FontAwesomeIcon icon={faCoins} className="icon-inline-left-l"/>
                                        {'Sell Item'}
                                    </div>

                                    {((item.purchase as WarbandPurchase).ModelPurchase == false) &&
                                        <>
                                    <div
                                        className={'action action-copy'} onClick={handleCopyEquipment}
                                    >
                                        <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l"/>
                                        {'Copy Item'}
                                    </div>

                                    <div className="action action-refund" onClick={showConfirmRefundEquipment}>
                                        <FontAwesomeIcon icon={faArrowRotateLeft} className="icon-inline-left-l"/>
                                        {'Refund Item'}
                                    </div>

                                    <div className="action action-delete" onClick={showConfirmDeleteEquipment}>
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
                                        {'Delete Injury'}
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

                                    <div className="action action-rename" onClick={showConfirmRenameWarband}>
                                        <FontAwesomeIcon icon={faEdit} className="icon-inline-left-l"/>
                                        {'Rename Warband'}
                                    </div>
                                    <div className="action action-rename" onClick={showConfirmExportWarband}>
                                        <FontAwesomeIcon icon={faFileExport} className="icon-inline-left-l"/>
                                        {'Export Warband'}
                                    </div>
                                    <div className="action action-rename" onClick={() => {
                                        setActivePopoverId(null);
                                        handlePrintWarband();
                                    }}>
                                        <FontAwesomeIcon icon={faPrint} className="icon-inline-left-l"/>
                                        {'Print Warband'}
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Fighter`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to delete '}
                    {(item as RealWarbandPurchaseModel).model != undefined &&

                    <strong>
                        {(item as RealWarbandPurchaseModel).model.CurModel.GetTrueName() + ' - ' + (item as RealWarbandPurchaseModel).model.GetTrueName()}
                    </strong>
                    }
                    {"?"}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteFighterModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteFighter}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Fighter Confirm Modal */}
            <Modal show={showConfirmRefundFighterModal} onHide={() => setshowConfirmRefundFighterModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Refund Fighter`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {'Are you sure you want to refund '}
                    <strong>{item.ModelName + ' - ' + item.FighterName}</strong>?

                    <br/>
                    <br/>
                    <p>
                        <i>
                            {'This will remove the fighter from your roster and refund all costs for the fighter and its equipment.'}
                        </i>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmRefundFighterModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRefundFighter}>
                        Refund
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Rename Fighter Confirm Modal */}
            <Modal show={showConfirmRenameFighterModal} onHide={() => setshowConfirmRenameFighterModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Rename Fighter`}</Modal.Title>
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
                    <Button variant="secondary" onClick={() => setshowConfirmRenameFighterModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRenameFighter}>
                        Rename
                    </Button>
                </Modal.Footer>
            </Modal>


            {/** Delete Modifier Confirm Modal */}
            <Modal show={showConfirmDeleteModifierModal} onHide={() => setshowConfirmDeleteModifierModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Modifier`}</Modal.Title>
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Exploration`}</Modal.Title>
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Refund Equipment`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to refund this Equipment?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Equipment`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        {'Are you sure you want to delete this Equipment?'}
                    </div>
                    <div >
                        <strong>{item.Name }</strong>?
                    </div>
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Sell Equipment`}</Modal.Title>
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
                            {(item as RealWarbandPurchaseEquipment).purchase.GetTotalDucats() + "Ducats and " + (item as RealWarbandPurchaseEquipment).purchase.GetTotalGlory() + " Glory"}
                        </i>
                        }
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmSellEquipmentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSellEquipment}>
                        Sell Equipment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Move Equipment to Fighter Confirm Modal */}
            <Modal className="WbbEditGoeticSelectionModal" show={showConfirmMoveEquipmentModal} onHide={() => setshowConfirmMoveEquipmentModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Move Equipment to Fighter`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={'mb-3'}>
                        <div className={'goetic-selection-wrap'}>
                            {warband?.warband_data.Models.map((discipline) => (
                            <div
                                key={discipline.HeldObject.ID + discipline.HeldObject.ID}
                                className={`select-item ${selectedFighter === discipline ? 'selected' : ''}`}
                                onClick={() => setSelectedFighter(discipline)}
                            >
                                {(discipline.HeldObject as WarbandMember).GetFighterName()}
                            </div>
                            ))}
                        </div>
                    </div>
                    <div >
                        <strong>{(item.equipment != undefined)? item.equipment.GetTrueName() : ""}</strong>?
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowConfirmMoveEquipmentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleMoveEquipment}>
                        Move Equipment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Advancement Confirm Modal */}
            <Modal show={showConfirmDeleteAdvancementModal} onHide={() => setshowConfirmDeleteAdvancementModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Advancement`}</Modal.Title>
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
                    <Button variant="secondary" onClick={() => setshowConfirmDeleteAdvancementModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAdvancement}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Delete Injury Confirm Modal */}
            <Modal show={showConfirmDeleteInjuryModal} onHide={() => setshowConfirmDeleteInjuryModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Injury`}</Modal.Title>
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
                <Modal.Header closeButton>
                    <Modal.Title>{`Rename Warband`}</Modal.Title>
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

            {/** Export Warband Modal */}
            <Modal show={showConfirmExportWarbandModal} onHide={() => setshowConfirmExportWarbandModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Export Warband`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                    {/* @TODO: add warband Export here */}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => setshowConfirmExportWarbandModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WbbContextualPopover;