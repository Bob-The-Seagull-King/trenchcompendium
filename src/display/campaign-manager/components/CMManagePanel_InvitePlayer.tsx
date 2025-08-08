
import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faEnvelopeCircleCheck, faUserCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useCampaign} from "../../../context/CampaignContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";

interface DummyPlayer {
    id: string;
    name: string;
    isInCampaign: boolean;
    imageId: number;
    isInvited: boolean;
}

const dummyPlayers: DummyPlayer[] = [
    { id: '1', name: 'Alice', isInCampaign: true, imageId: 2828, isInvited: false },
    { id: '2', name: 'Bob', isInCampaign: false, imageId: 2818, isInvited: true },
    { id: '3', name: 'Charlie', isInCampaign: false, imageId: 2818, isInvited: false },
    { id: '4', name: 'Diana', isInCampaign: true, imageId: 2828, isInvited: false },
];

const CMManagePanel_InvitePlayer: React.FC = () => {
    const { campaign } = useCampaign();

    const [show, setShow] = useState<boolean>(false);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedPlayerIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        campaign.InvitePlayers(selectedPlayerIds);
        alert('TODO: Invite players here');
        setShow(false);

        // @TODO: refresh state for UI here
    };

    return (
        <>
            <div
                className="CMManagePanel_InvitePlayer CMManagePanel-action"
                onClick={() => setShow(true)}
            >
                {'Invite Player'}
            </div>

            <Modal show={show} onHide={() => setShow(false)} className="CMManagePanel_InvitePlayer_Modal" centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Invite Players</Modal.Title>

                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                        role="button"
                        onClick={() => setShow(false)}
                    />
                </Modal.Header>

                <Modal.Body>
                    <div>{'Invite your friends to this campaign'}</div>
                    <ul className="player-list">
                        {dummyPlayers.map(player => (
                            <li
                                key={player.id}
                                className={`player-item ${selectedPlayerIds.includes(player.id) ? 'selected' : ''} ${player.isInCampaign ? 'already-in' : ''}`}
                                onClick={() => {
                                    if(!player.isInCampaign && !player.isInvited) {
                                        toggleSelect(player.id);
                                    }
                                }}
                            >
                                <div className={'player-image-wrap'}>
                                    <SynodImageWithCredit
                                        imageId={player.imageId}
                                        className={'player-image'}
                                    />
                                </div>

                                <div className={'player-text'}>
                                    <div className={'player-name'}>
                                        {player.name}
                                    </div>
                                    {player.isInCampaign && // If player is already in campaign
                                        <div className={'player-status'}>
                                            {'Joined'}
                                        </div>
                                    }
                                    {(player.isInvited ) && // @TODO: If player is invited
                                        <div className={'player-status'}>
                                            {'Invited'}
                                        </div>
                                    }
                            </div>



                                {player.isInvited &&
                                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} className={'player-icon'}/>
                                }

                                {player.isInCampaign &&
                                    <FontAwesomeIcon icon={faUserCheck} className={'player-icon player-icon-in-campaign'}/>
                                }

                                {selectedPlayerIds.includes(player.id) &&
                                    <FontAwesomeIcon icon={faCheckCircle} className={'player-icon player-icon-selected'}/>
                                }
                            </li>
                        ))}
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={selectedPlayerIds.length === 0}
                    >
                        Invite Selected
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CMManagePanel_InvitePlayer;
