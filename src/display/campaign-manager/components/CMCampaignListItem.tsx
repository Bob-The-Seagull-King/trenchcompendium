import React from "react";
import {Campaign} from "../../../classes/saveitems/Campaign/Campaign";
import {useAuth} from "../../../utility/AuthContext";
import CMPlayerSmall from "../micro-components/CMPlayerSmall";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";

type CMCampaignListItemProps = {
    campaign: Campaign;
};

const CMCampaignListItem: React.FC<CMCampaignListItemProps> = ({ campaign }) => {

    const { userId, isLoggedIn } = useAuth()

    const dummyPlayers = [
        {
            playerId: 1,
            playerName: "Alice Ironhand",
            playerImageId: 101
        },
        {
            playerId: 2,
            playerName: "Bjorn the Brave",
            playerImageId: 102
        },
        {
            playerId: 3,
            playerName: "Cassandra Stormborn",
            playerImageId: 103
        },
        {
            playerId: 4,
            playerName: "Darius the Swift",
            playerImageId: 2780
        },
        {
            playerId: 5,
            playerName: "Elara the Wise",
            playerImageId: 2776
        },
        {
            playerId: 6,
            playerName: "Fenric Ironfist",
            playerImageId: 2756
        },
        {
            playerId: 7,
            playerName: "Gwendolyn Nightshade",
            playerImageId: 2791
        },
        {
            playerId: 8,
            playerName: "Hector the Bold",
            playerImageId: 2792
        }
    ];

    const navigate = useNavigate();


    return (

        <CustomNavLink
            classes={'CMCampaignListItem-outer'}
            link={`/campaigns/${campaign.GetID()}`}
            runfunc={() => {
                navigate(`/campaigns/${campaign.GetID()}`,
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


                    {dummyPlayers.length > 0 ? (
                        <div className={'row CMCampaignListItem-player-list'}>
                            <h4>{'Players'}</h4>

                            {dummyPlayers.map((player, index) => (
                                <div className={'CMCampaignListItem-player-col col-12 col-sm-6 col-md-4'} key={index}>
                                    <CMPlayerSmall
                                        useNav={false}
                                        player={{
                                            playerId: player.playerId,
                                            playerName: player.playerName,
                                            playerImageId: player.playerImageId
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