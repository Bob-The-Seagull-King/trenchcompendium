import React, {useEffect, useMemo, useState} from 'react';
import { Button, Modal, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faChevronDown,
    faChevronUp, faCircleNotch,
    faEnvelopeCircleCheck,
    faUserCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import { useCampaign } from "../../../context/CampaignContext";
import CMPlayerSmall from "../micro-components/CMPlayerSmall";
import CMContextualPopover from "./CMContextualPopover";
import {SumWarband} from "../../../classes/saveitems/Warband/WarbandManager";
import {UserFactory} from "../../../factories/synod/UserFactory";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";
import SynodFactionImage from "../../../utility/SynodFactionImage";
import {ToolsController} from "../../../classes/_high_level_controllers/ToolsController";
import {toast} from "react-toastify";

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


type PlayerWithWarbands = {
    campaign_user: CampaignUser;
    warbands: SumWarband[];
};

const CMManagePanel_AddWarband: React.FC = () => {

    // get campaign
    const { campaign, reload, reloadCampaignDisplay, updateCampaignKey } = useCampaign();
    if( !campaign) {
        return null;
    }

    // global loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // campaign.GetPlayers() will get all players objects as CampaignUser

    // Get warbands of players
    const [items, setItems] = useState<PlayerWithWarbands[]>([]);

    const players = campaign.GetPlayers();
    const playersKey = useMemo(
        () => players.map((p) => p.Id).join(","),
        [players]
    );

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setIsLoading(true);
            try {
                const result = await Promise.all(
                    players.map(async (cu) => {
                        try {
                            // get public user and load warbands
                            const pub = await UserFactory.CreatePublicUserByID(Number(cu.Id));
                            const warbands: SumWarband[] = (await pub?.GetWarbands()) ?? [];
                            return { campaign_user: cu, warbands } as PlayerWithWarbands;
                        } catch (e) {
                            console.warn("Failed to load warbands for", cu.Id, e);
                            return { campaign_user: cu, warbands: [] as SumWarband[] };
                        }
                    })
                );
                if (!cancelled) setItems(result);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [playersKey]); // refresh if player list changes

    // UI
    const [loadingActions, setLoadingActions] = useState(false); // is submitting the form
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

    const handleSelectWarband = (warbandId: number) => {
        if (campaign.IsInvitedWarband(warbandId) || campaign.IsJoinedWarband(warbandId)) {
            return; // not selectable
        }

        if( loadingActions) { // disable actions when already loading
            return;
        }


        setSelectedWarbandIds((prev) =>
            prev.includes(warbandId)
                ? prev.filter((id) => id !== warbandId) // unselect
                : [...prev, warbandId] // select
        );
    };

    const handleSubmit = async () => {
        if(!selectedWarbandIds.length) return;

        if (campaign != null ) {
            setLoadingActions(true);

            const Tools = ToolsController.getInstance();
            await Tools.UserCampaignManager.RunInit();

            for (const id of selectedWarbandIds) {
                try {
                    const res = await Tools.UserCampaignManager.CampaignWarbandCreate(
                        campaign.GetId(),
                        id
                    );
                    if (res != 400){
                        toast.success('Warband invited')
                    } else{
                        toast.error('Warband invite error')
                    }
                } catch (e) {
                    toast.error('Could not invite warband(s)')
                }
            }

            setLoadingActions(false); // reset loading state
            setShow(false);   // close Modal
            setSelectedWarbandIds([]); // reset ids
        }
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
                        {items.map((item, index) => {

                            const isExpanded = expandedPlayers.includes(item.campaign_user.Id);
                            const invitedCount = item.warbands.filter(wb =>
                                campaign.IsInvitedWarband(wb.id)
                            ).length;

                            const joinedCount = item.warbands.filter(wb =>
                                campaign.IsJoinedWarband(wb.id)
                            ).length;
                            const selectedCount = item.warbands.filter(wb =>
                                selectedWarbandIds.includes(wb.id)
                            ).length;

                            return (
                                <li key={item.campaign_user.Id} className={"player-item"}>
                                    <div
                                        className={`player-item-inner ${isExpanded ? "expanded" : ""}`}
                                        onClick={() => togglePlayer(item.campaign_user.Id)}
                                    >
                                        <div className={'player-image-wrap'}>
                                            <SynodImageWithCredit
                                                imageId={item.campaign_user.AvatarId}
                                                className={''}
                                            />
                                        </div>

                                        <div className={'player-text'}>
                                            <div className={'player-name'}>
                                                {item.campaign_user.Name}
                                            </div>

                                            {(invitedCount > 0 || joinedCount > 0 || selectedCount > 0) &&
                                                <div className="player-stats">
                                                    {invitedCount > 0 &&
                                                        <span className="invited-count">Invited: {invitedCount}</span>
                                                    }
                                                    {joinedCount > 0 &&
                                                        <span className="joined-count">Joined: {joinedCount}</span>
                                                    }
                                                    {selectedCount > 0 &&
                                                        <span
                                                            className="selected-count">Selected: {selectedCount}</span>
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
                                                {item.warbands.map((wb) => {
                                                    const isSelected = selectedWarbandIds.includes(wb.id);
                                                    const isDisabled = campaign.IsInvitedWarband(wb.id) || campaign.IsJoinedWarband(wb.id);

                                                    return (
                                                        <li
                                                            key={wb.id}
                                                            className={`warband-item ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                                                            onClick={() => handleSelectWarband(wb.id)}
                                                        >
                                                            <div className={'warband-image-wrap'}>
                                                                <SynodFactionImage
                                                                    className={'warband-image'}
                                                                    factionSlug={wb.warband_data.GetFactionSlug()}
                                                                />
                                                            </div>

                                                            <div className={'warband-text'}>
                                                                <div className="warband-name">
                                                                    {wb.warband_data.GetWarbandName()}
                                                                </div>

                                                                {campaign.IsInvitedWarband(wb.id) && (
                                                                    <div>{'Invited'}</div>
                                                                )}

                                                                {campaign.IsJoinedWarband(wb.id) && (
                                                                    <div>{'Joined'}</div>
                                                                )}
                                                            </div>

                                                            {campaign.IsInvitedWarband(wb.id) && (
                                                                <>
                                                                    {/* @TODO: use actual warband ID here*/}
                                                                    <CMContextualPopover
                                                                        id={`warband-invite-${wb.id}`}
                                                                        type="warband-invite"
                                                                        item={wb} // this is a placeholder
                                                                    />
                                                                </>

                                                            )}

                                                            {campaign.IsJoinedWarband(wb.id) && (
                                                                <FontAwesomeIcon
                                                                    icon={faUserCheck}
                                                                     className={'warband-icon warband-icon-in-campaign'}/>
                                                            )}

                                                            {isSelected &&
                                                                <FontAwesomeIcon
                                                                    icon={faCheckCircle}
                                                                    className={'warband-icon warband-icon-selected'}/>
                                                            }
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </Collapse>
                                </li>
                            )
                        })}
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>

                    { loadingActions ? (
                        <Button
                            variant="primary"
                            disabled={true}
                        >
                            <FontAwesomeIcon icon={faCircleNotch} className={'fa-spin me-2'} />
                            Sending invites
                        </Button>
                    ):(
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={selectedWarbandIds.length === 0}
                        >
                            Invite Selected {`(${selectedWarbandIds.length})`}
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CMManagePanel_AddWarband;
