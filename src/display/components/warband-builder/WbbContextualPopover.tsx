import React, { useState } from 'react';
import { OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { usePopover } from '../../../context/PopoverContext';
import { useWarband } from '../../../context/WarbandContext';

interface ActionPopoverProps {
    id: string;
    type: 'fighter' | 'advancement' | 'injury';
    item: any;
}

const WbbContextualPopover: React.FC<ActionPopoverProps> = ({ id, type, item }) => {
    const { activePopoverId, setActivePopoverId } = usePopover();

    const [showConfirm, setShowConfirm] = useState(false);
    const isActive = activePopoverId === id;

    const handleToggle = () => {
        setActivePopoverId(isActive ? null : id);
    };

    const handleCopy = () => {
        alert(`Copy ${type}: ${item.FighterName || item.Name}`);
        setActivePopoverId(null);
    };

    const handleDelete = () => {

        setShowConfirm(false);
        setActivePopoverId(null);
    };

    return (
        <>
            <OverlayTrigger
                trigger="click"
                placement="left"
                show={isActive}
                onToggle={handleToggle}
                rootClose={true}
                overlay={
                    <Popover.Body className="popover Wbb-item-actions-popover">
                        <div className="actions">
                            <div className="action action-copy" onClick={handleCopy}>
                                <FontAwesomeIcon icon={faCopy} className="icon-inline-left-l" />
                                {'Copy'}
                            </div>
                            <div className="action action-delete" onClick={() => setShowConfirm(true)}>
                                <FontAwesomeIcon icon={faTrash} className="icon-inline-left-l" />
                                {'Delete'}
                            </div>
                        </div>
                    </Popover.Body>
                }>
                <div className="Wbb-item-actions" onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
            </OverlayTrigger>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {type}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{item.FighterName || item.Name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WbbContextualPopover;
