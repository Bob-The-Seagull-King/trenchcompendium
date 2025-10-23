
import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faCircleNotch,
    faEnvelopeCircleCheck,
    faUserCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useCampaign} from "../../../context/CampaignContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CMContextualPopover from "./CMContextualPopover";
import AlertCustom from "../../components/generics/AlertCustom";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";


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


    if( !campaign) {
        return null;
    }

    const [show, setShow] = useState<boolean>(false);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const toggleSelect = (id: number) => {
        setSelectedPlayerIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!selectedPlayerIds.length) return;

        if (campaign != null ) {
            setLoading(true);

            const Tools = ToolsController.getInstance();
            await Tools.UserCampaignManager.RunInit();

            for (const id of selectedPlayerIds) {
                try {
                    const res = await Tools.UserCampaignManager.CampaignInviteCreate(
                        campaign.GetId(),
                        id
                    );
                    if (res != 400){
                        toast.success('Player invited')
                    } else{
                        toast.error('Player invite error')
                    }
                } catch (e) {
                    toast.error('Could not invite player(s)')
                }
            }

            setLoading(false); // reset loading state
            setShow(false);   // close Modal
            setSelectedPlayerIds([]); // reset ids
        }
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
                    {(campaign.GetInvitablePlayers_full())? (
                        <ul className="player-list">

                        {(campaign?.GetInvitablePlayers_full() ?? []).map((player) => (
                            <li
                                key={player.Id}
                                className={`player-item 
                                ${selectedPlayerIds.includes(player.Id) ? 'selected' : ''} 
                                ${campaign.IsJoined(player.Id) ? 'already-in' : ''}
                                ${campaign.IsInvited(player.Id) ? 'invited' : ''}
                                `}
                                onClick={() => {
                                    if (!campaign.IsJoined(player.Id) && !campaign.IsInvited(player.Id)) {
                                        toggleSelect(player.Id);
                                    }
                                }}
                            >
                                <div className={'player-image-wrap'}>
                                    <SynodImageWithCredit
                                        imageId={player.AvatarId}
                                        className={'player-image'}
                                    />
                                </div>

                                <div className={'player-text'}>
                                    <div className={'player-name'}>
                                        {player.Nickname}
                                    </div>
                                    {campaign.IsJoined(player.Id) && // If player is already in campaign
                                        <div className={'player-status'}>
                                            {'Joined'}
                                        </div>
                                    }
                                    {(campaign.IsInvited(player.Id)) && // @TODO: If player is invited
                                        <div className={'player-status'}>
                                            {'Invited'}
                                        </div>
                                    }
                                </div>

                                {/* @TODO: use actual player data*/}
                                {campaign.IsInvited(player.Id) &&
                                    <CMContextualPopover
                                        key={`invite-modal-playercontext-${player.Id}`}
                                        id={`player-invite-${player.Id}`}
                                        type="player-invite"
                                        item={player} // this is a placeholder
                                    />
                                }

                                {campaign.IsJoined(player.Id) &&
                                    <FontAwesomeIcon icon={faUserCheck}
                                                     className={'player-icon player-icon-in-campaign'}/>
                                }

                                {selectedPlayerIds.includes(player.Id) &&
                                    <FontAwesomeIcon icon={faCheckCircle}
                                                     className={'player-icon player-icon-selected'}/>
                                }
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <AlertCustom
                        type={'info'}>
                            <h4>
                                {'No friends to invite'}
                            </h4>
                            <p>
                                {'You can only invite your friends. Add your friends first and then add them to your campaign'}
                            </p>
                        </AlertCustom>
                    )
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>

                {!loading ? (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={selectedPlayerIds.length === 0}
                    >
                        Invite Selected {`(${selectedPlayerIds.length})`}
                    </Button>
                ):(
                    <Button
                        variant="primary"
                        disabled={true}
                    >
                        <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'} />
                        {'Inviting Players'}
                    </Button>
                )}

            </Modal.Footer>
        </Modal>
    </>
    );
};

export default CMManagePanel_InvitePlayer;
