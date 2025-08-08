import React, { useState } from 'react';
import { Button, Modal, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faChevronDown,
    faChevronUp,
    faEnvelopeCircleCheck,
    faUserCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import { useCampaign } from "../../../context/CampaignContext";
import CMPlayerSmall from "../micro-components/CMPlayerSmall";

interface DummyWarband {
    warbandImageId: number;
    warbandName: string;
    warbandId: number;
    isInvited: boolean;
    isInCampaign: boolean;
}

interface DummyPlayer {
    id: number;
    name: string;
    imageId: number;
    warbands: DummyWarband[];
}

const dummyPlayers: DummyPlayer[] = [
    {
        id: 1,
        name: 'Alice',
        imageId: 2828,
        warbands: [
            { warbandImageId: 2818, warbandName: 'Iron Crusaders', warbandId: 100, isInvited: false, isInCampaign: true },
            { warbandImageId: 2819, warbandName: 'Ashen Blades', warbandId: 101, isInvited: false, isInCampaign: false },
            { warbandImageId: 2820, warbandName: 'Storm Heralds', warbandId: 102, isInvited: false, isInCampaign: false },
            { warbandImageId: 2821, warbandName: 'Grim Sentinels', warbandId: 103, isInvited: true, isInCampaign: false }
        ]
    },
    {
        id: 2,
        name: 'Bob',
        imageId: 2818,
        warbands: [
            { warbandImageId: 2822, warbandName: 'Night Howlers', warbandId: 200, isInvited: false, isInCampaign: true },
            { warbandImageId: 2823, warbandName: 'Bone Reapers', warbandId: 201, isInvited: false, isInCampaign: false },
            { warbandImageId: 2824, warbandName: 'Cinder Wolves', warbandId: 202, isInvited: false, isInCampaign: false },
            { warbandImageId: 2825, warbandName: 'Frost Hounds', warbandId: 203, isInvited: false, isInCampaign: false },
            { warbandImageId: 2826, warbandName: 'Ironfang Marauders', warbandId: 204, isInvited: false, isInCampaign: false }
        ]
    },
    {
        id: 3,
        name: 'Charlie',
        imageId: 2818,
        warbands: [
            { warbandImageId: 2827, warbandName: 'Blood Ravens', warbandId: 300, isInvited: false, isInCampaign: false },
            { warbandImageId: 2828, warbandName: 'Void Stalkers', warbandId: 301, isInvited: false, isInCampaign: false },
            { warbandImageId: 2829, warbandName: 'Steel Vultures', warbandId: 302, isInvited: false, isInCampaign: true },
            { warbandImageId: 2830, warbandName: 'Ember Fangs', warbandId: 303, isInvited: false, isInCampaign: false },
            { warbandImageId: 2831, warbandName: 'Shattered Spears', warbandId: 304, isInvited: false, isInCampaign: false },
            { warbandImageId: 2832, warbandName: 'Crimson Jackals', warbandId: 305, isInvited: true, isInCampaign: false }
        ]
    },
    {
        id: 4,
        name: 'Diana',
        imageId: 2828,
        warbands: [
            { warbandImageId: 2833, warbandName: 'Gloom Reavers', warbandId: 400, isInvited: false, isInCampaign: false },
            { warbandImageId: 2834, warbandName: 'Wraith Blades', warbandId: 401, isInvited: false, isInCampaign: true },
            { warbandImageId: 2835, warbandName: 'Silver Fangs', warbandId: 402, isInvited: false, isInCampaign: false },
            { warbandImageId: 2836, warbandName: 'Plague Hounds', warbandId: 403, isInvited: false, isInCampaign: false }
        ]
    }
];

const CMManagePanel_AddWarband: React.FC = () => {
    const { campaign } = useCampaign();

    const [show, setShow] = useState<boolean>(false);
    const [expandedPlayers, setExpandedPlayers] = useState<number[]>([]);
    const [selectedWarbandIds, setSelectedWarbandIds] = useState<number[]>([]);

    const togglePlayer = (playerId: number) => {
        setExpandedPlayers((prev) =>
            prev.includes(playerId)
                ? prev.filter((id) => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleSelectWarband = (warbandId: number, isInvited: boolean, isInCampaign: boolean) => {
        if (isInvited || isInCampaign) {
            return; // nicht auswählbar
        }
        setSelectedWarbandIds((prev) =>
            prev.includes(warbandId)
                ? prev.filter((id) => id !== warbandId) // abwählen
                : [...prev, warbandId] // auswählen
        );
    };

    const handleSubmit = () => {
        alert("Selected Warbands: " + selectedWarbandIds.join(", "));
        setShow(false);
    };

    return (
        <>
            <div
                className="CMManagePanel_AddWarband CMManagePanel-action"
                onClick={() => setShow(true)}
            >
                {"Add Warband"}
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                className="CMManagePanel_AddWarband_Modal"
                centered
            >
                <Modal.Header closeButton={false}>
                    <Modal.Title>Add Warbands</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setShow(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div>{"Add new warbands to this campaign"}</div>
                    <ul className="player-list">
                        {dummyPlayers.map((player) => {
                            const isExpanded = expandedPlayers.includes(player.id);
                            const invitedCount = player.warbands.filter(wb => wb.isInvited).length;
                            const joinedCount = player.warbands.filter(wb => wb.isInCampaign).length;
                            const selectedCount = player.warbands.filter(wb => selectedWarbandIds.includes(wb.warbandId)).length;

                            return (
                                <li key={player.id} className={"player-item"}>
                                    <div
                                        className={`player-item-inner ${isExpanded ? "expanded" : ""}`}
                                        onClick={() => togglePlayer(player.id)}
                                    >
                                        <div className={'player-image-wrap'}>
                                            <SynodImageWithCredit
                                                imageId={player.imageId}
                                                className={''}
                                            />
                                        </div>

                                        <div className={'player-text'}>
                                            <div className={'player-name'}>
                                                {player.name}
                                            </div>

                                            {(invitedCount || joinedCount || selectedCount) &&
                                                <div className="player-stats">
                                                    {invitedCount > 0&&
                                                        <span className="invited-count">Invited: {invitedCount}</span>
                                                    }
                                                    {joinedCount  > 0 &&
                                                        <span className="joined-count">Joined: {joinedCount}</span>
                                                    }
                                                    {selectedCount  > 0 &&
                                                        <span className="selected-count">Selected: {selectedCount}</span>
                                                    }
                                                </div>
                                            }
                                        </div>


                                        {isExpanded ? (
                                            <FontAwesomeIcon icon={faChevronUp} className={'player-expanded-icon'}/>
                                        ) : (
                                            <FontAwesomeIcon icon={faChevronDown} className={'player-expanded-icon'}/>
                                        )}
                                    </div>

                                    <Collapse in={isExpanded}>
                                        <div>
                                            <ul className="warband-list">
                                                {player.warbands.map((wb) => {
                                                    const isSelected = selectedWarbandIds.includes(wb.warbandId);
                                                    const isDisabled = wb.isInvited || wb.isInCampaign;

                                                    return (
                                                        <li
                                                            key={wb.warbandId}
                                                            className={`warband-item ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                                                            onClick={() => handleSelectWarband(wb.warbandId, wb.isInvited, wb.isInCampaign)}
                                                        >
                                                            <div className={'warband-image-wrap'}>
                                                                <SynodImageWithCredit
                                                                    imageId={wb.warbandImageId}
                                                                    className={"warband-image"}
                                                                />
                                                            </div>

                                                            <div className={'warband-text'}>
                                                                <div className="warband-name">
                                                                    {wb.warbandName}
                                                                </div>

                                                                {wb.isInvited && (
                                                                    <div>{'Invited'}</div>
                                                                )}

                                                                {wb.isInCampaign && (
                                                                    <div>{'Joined'}</div>
                                                                )}
                                                            </div>
                                                            {wb.isInvited && (
                                                                <FontAwesomeIcon icon={faEnvelopeCircleCheck} className={'warband-icon'}/>
                                                            )}

                                                            {wb.isInCampaign && (
                                                                <FontAwesomeIcon icon={faUserCheck} className={'warband-icon warband-icon-in-campaign'}/>
                                                            )}

                                                            {isSelected &&
                                                                <FontAwesomeIcon icon={faCheckCircle} className={'warband-icon warband-icon-selected'}/>
                                                            }

                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </Collapse>
                                </li>
                            );
                        })}
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={selectedWarbandIds.length === 0}
                    >
                        Invite Selected
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CMManagePanel_AddWarband;
