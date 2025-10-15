

import React from 'react';
import {useNavigate} from "react-router-dom";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import CMContextualPopover from "../components/CMContextualPopover";

// @TODO: this is only dummy data
interface CMPlayerListEntryProps {
    player: {
        playerName: string;
        playerProfileUrl: string;
        playerId: number;
        playerImageId: number;
        playerStatus: string;
        playerImageURL: string;
    };
}

const CMPlayerListEntry: React.FC<CMPlayerListEntryProps> = ({ player }) => {
    const navigate = useNavigate();


    return (
        <div className="CMPlayerListEntry">
            <CustomNavLink
                classes={'user-name'}
                link={`/profile/${player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.playerId}`, {state: Date.now().toString()})
                }}>

                <div className={'pfp-wrap'}>
                    <SynodImageWithCredit
                        imageId={player.playerImageId}
                        className={'pfp'}
                    />
                </div>
            </CustomNavLink>

            <CustomNavLink
                classes={'user-name'}
                link={`/profile/${player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.playerId}`, {state: Date.now().toString()})
                }}>
                {player.playerName}
            </CustomNavLink>

            <div className={'user-status'}>
                {player.playerStatus}
            </div>

            <CMContextualPopover
                id={`player-${player.playerId}`}
                type="player"
                item={player} // this is a placeholder
            />
        </div>
    );
};

export default CMPlayerListEntry;