import React from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import {useNavigate} from "react-router-dom";



type CMPlayerSmallProps = {
    useNav?: boolean; // should this be a navigatable element?
    player: {
        playerId: number;
        playerName: string;
        playerImageId: number;
    };
};

/**
 * The history Panel in the Campaign Manager
 */
const CMPlayerSmall: React.FC<CMPlayerSmallProps> = ({ useNav = true, player }) => {

    const { campaign } = useCampaign();
    const navigate = useNavigate();

    if( !useNav ) {
        return (
            <div className="CMPlayerSmall">
                <div
                    className={'player-image-wrap'}
                >
                    <SynodImageWithCredit
                        imageId={player.playerImageId}
                        className={''}
                    />
                </div>

                <div
                    className={'CMHistoryPlayer-name'}
                >
                    {player.playerName}
                </div>
            </div>
        )
    }

    return (
        <div className="CMPlayerSmall">
            <CustomNavLink
                classes={'player-image-wrap'}
                link={`/profile/${player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.playerId}`, {state: Date.now().toString()})
                }}>
                <SynodImageWithCredit
                    imageId={player.playerImageId}
                    className={''}
                />
            </CustomNavLink>

            <CustomNavLink
                classes={'CMHistoryPlayer-name'}
                link={`/profile/${player.playerId}`}
                runfunc={() => {
                    navigate(`/profile/${player.playerId}`, {state: Date.now().toString()})
                }}>
                {player.playerName}
            </CustomNavLink>
        </div>
    );
};

export default CMPlayerSmall;