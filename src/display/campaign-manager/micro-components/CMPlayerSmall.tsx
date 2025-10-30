import React from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import {useNavigate} from "react-router-dom";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";



interface CMPlayerSmallProps {
    player: CampaignUser;
    useNav?: boolean; // should this be a navigatable element?
}

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
                        imageId={player.AvatarId}
                        className={''}
                    />
                </div>

                <div
                    className={'CMHistoryPlayer-name'}
                >
                    {player.Name}
                </div>
            </div>
        )
    }

    return (
        <div className="CMPlayerSmall">
            <CustomNavLink
                classes={'player-image-wrap'}
                link={`/profile/${player.Id}`}
                runfunc={() => {
                    navigate(`/profile/${player.Id}`, {state: Date.now().toString()})
                }}>
                <SynodImageWithCredit
                    imageId={player.AvatarId}
                    className={''}
                />
            </CustomNavLink>

            <CustomNavLink
                classes={'CMHistoryPlayer-name'}
                link={`/profile/${player.Id}`}
                runfunc={() => {
                    navigate(`/profile/${player.Id}`, {state: Date.now().toString()})
                }}>
                {player.Name}
            </CustomNavLink>
        </div>
    );
};

export default CMPlayerSmall;