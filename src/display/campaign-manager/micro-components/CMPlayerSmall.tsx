import React from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import {useNavigate} from "react-router-dom";



type CMPlayerSmallProps = {
    player: {
        playerId: number;
        playerName: string;
        playerImageId: number;
    };
};

/**
 * The history Panel in the Campaign Manager
 */
const CMPlayerSmall: React.FC<CMPlayerSmallProps> = ( player) => {

    const { campaign } = useCampaign();
    const navigate = useNavigate();

    return (
        <div className="CMPlayerSmall">
            <CustomNavLink
                classes={'player-image-wrap'}
                link={`/profile/${player.player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.player.playerId}`, {state: Date.now().toString()})
                }}>
                <SynodImageWithCredit
                    imageId={player.player.playerImageId}
                    className={''}
                />
            </CustomNavLink>

            <CustomNavLink
                classes={'CMHistoryPlayer-name'}
                link={`/profile/${player.player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.player.playerId}`, {state: Date.now().toString()})
                }}>
                {player.player.playerName}
            </CustomNavLink>
        </div>
    );
};

export default CMPlayerSmall;