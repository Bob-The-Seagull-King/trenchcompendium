import React from "react";
import {Campaign} from "../../../classes/saveitems/Campaign/Campaign";
import {useAuth} from "../../../utility/AuthContext";
import CMPlayerSmall from "../micro-components/CMPlayerSmall";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {useCampaign} from "../../../context/CampaignContext";
import LoadingOverlay from "../../components/generics/Loading-Overlay";


const CMCampaignListItem: React.FC = () => {

    const { userId, isLoggedIn } = useAuth()
    const { campaign, loading, error, reload } = useCampaign();

    const navigate = useNavigate();


    if( loading || !campaign ) {
        return (
            <div className={'CMCampaignListItem-outer'}>
                <div className="CMCampaignListItem">
                    <LoadingOverlay />
                </div>
            </div>
        );
    }

    return (

        <CustomNavLink
            classes={'CMCampaignListItem-outer'}
            link={`/campaigns/${campaign.GetId()}`}
            runfunc={() => {
                navigate(`/campaigns/${campaign.GetId()}`,
                    {state: Date.now().toString()})
            }}>
            <div className="CMCampaignListItem">
                <h3>{campaign.GetName()}</h3>

                {campaign.GetDescription() && (
                    <p className={'CMCampaignListItem-description'}>
                        {campaign.GetDescription()}
                    </p>
                )}

                <div className={'CMCampaignListItem-players'}>
                    {campaign.GetPlayers().length > 0 ? (
                        <div className={'row CMCampaignListItem-player-list'}>
                            <h4>{'Players'}</h4>

                            {campaign.GetPlayers().map((player, index) => (
                                <div className={'CMCampaignListItem-player-col col-12 col-sm-6 col-md-4'} key={index}>
                                    <CMPlayerSmall
                                        useNav={false}
                                        player={{
                                            playerId: player.Id,
                                            playerName: player.Nickname,
                                            playerImageId: player.AvatarId
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={'CMCampaignListItem-players-none'}>
                            {'This campaign does not have any players.'}
                        </div>
                    )}

                </div>
            </div>
        </CustomNavLink>

    );
};

export default CMCampaignListItem;