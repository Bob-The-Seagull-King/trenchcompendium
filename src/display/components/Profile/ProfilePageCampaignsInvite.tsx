import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faCircleNotch,
    faEnvelope,
    faEnvelopeOpenText,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";

type Player = {
    profilePictureId: number;
    playerName: string;
};

type ProfilePageCampaignsInviteProps = {
    campaignName: string;
    campaignId: number;
    players: Player[];
};

const ProfilePageCampaignsInvite: React.FC<ProfilePageCampaignsInviteProps> = ({
                                                                                   campaignName,
                                                                                   campaignId,
                                                                                   players
                                                                               }) => {
    const navigate = useNavigate();
    const [loadingButton, setLoadingButton] = useState<'accept' | 'decline' | null>(null);

    // placeholder
    const [hasInvites] = useState<boolean>(false);


    const handleDeclineInvite = async () => {
        setLoadingButton('decline');
        try {
            console.log("Decline invite clicked");
            // TODO: API call or logic to decline invite
            await new Promise(res => setTimeout(res, 2000)); // Fake delay
        } finally {
            setLoadingButton(null);
        }
    };

    const handleAcceptInvite = async () => {
        setLoadingButton('accept');
        try {
            console.log("Accept invite clicked");
            // TODO: API call or logic to accept invite
            await new Promise(res => setTimeout(res, 2000)); // Fake delay
        } finally {
            setLoadingButton(null);
        }
    };

    if( !hasInvites ) {
        return null
    }

    return (
        <div className="ProfilePageCampaignsInvite">
            <h3>
                <FontAwesomeIcon icon={faEnvelope} className={'icon-inline-left-l'}/>
                {'Campaign Invite'}
            </h3>

            <CustomNavLink
                link={`/campaigns/${campaignId}`}
                runfunc={() => {
                    navigate(`/campaigns/${campaignId}`)
                }}
               classes={'ProfilePageCampaignsInvite-Name'}
            >
                {campaignName}
            </CustomNavLink>


            <div className={'ProfilePageCampaignsInvite-admin'}>
                {/* @TODO: hook up actual admin name*/}
                <strong>{'Admin: '}</strong>

                <CustomNavLink
                    link={`/profile/${3}`}
                    runfunc={() => {
                        navigate(`/profile/${3}`)
                    }}
                    classes={'player-item-link'}
                >
                    {/* @TODO: add admin name here */}
                    {'Emitoo'}
                </CustomNavLink>
            </div>

            <ul className="players-list">
            <strong>{'Players: '}</strong>
                {players.length > 0 ? (
                    <>
                        {players.map((player, index) => (
                            <>
                                <li key={index} className="player-item">
                                    <CustomNavLink
                                        link={`/profile/${player.profilePictureId}`}
                                        runfunc={() => {
                                            navigate(`/profile/${player.profilePictureId}`)
                                        }}
                                        classes={'player-item-link'}
                                    >
                                        {player.playerName}


                                    </CustomNavLink>
                                </li>

                                {index < players.length &&
                                    <>{'|'}</>
                                }
                            </>

                        ))}
                    </>
                ) : (
                    <>
                        No Players
                    </>
                )}

            </ul>

            <div className={'ProfilePageCampaignsInvite-actions'}>
                <button
                    className="btn btn-secondary me-2"
                    onClick={handleDeclineInvite}
                    disabled={loadingButton !== null}
                >
                    {loadingButton === 'decline' ? (
                        <FontAwesomeIcon icon={faCircleNotch} spin className="me-1"/>
                    ) : (
                        <FontAwesomeIcon icon={faTimes} className="me-1"/>
                    )}
                    Decline Invite
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleAcceptInvite}
                    disabled={loadingButton !== null}
                >
                    {loadingButton === 'accept' ? (
                        <FontAwesomeIcon icon={faCircleNotch} spin className="me-1"/>
                    ) : (
                        <FontAwesomeIcon icon={faEnvelopeOpenText} className="me-1"/>
                    )}
                    Accept Invite
                </button>
            </div>
        </div>
    );
};

export default ProfilePageCampaignsInvite;