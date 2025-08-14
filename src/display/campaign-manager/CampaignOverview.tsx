import React, {useState} from 'react';
import {CampaignProvider} from "../../context/CampaignContext";
import WarbandListEntry from "../components/Profile/WarbandListEntry";
import CMCampaignListItem from "./components/CMCampaignListItem";
import {Campaign} from "../../classes/saveitems/Campaign/Campaign";
import {useAuth} from "../../utility/AuthContext";
import {PopoverProvider} from "../../context/PopoverContext";
import CampaignManagerContent from "./CampaignManagerContent";
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

const CampaignOverview: React.FC = () => {



    // Dummy-Data
    const dummyCampaigns: Campaign[] = [
        new Campaign({
            id: "1",
            name: "The Iron Crusade",
            players: [
                {
                    playerName: "Iron Lord",
                    playerProfileUrl: "profile/ironlord",
                    playerId: 10,
                    playerImageId: 3001,
                    playerStatus: "Free Member",
                    playerImageURL:
                        "https://synod.trench-companion.com/wp-content/uploads/2025/07/Chorister-Profile-Picture.jpg",
                },
            ],
            warbands: [],
            created: new Date("2025-06-01"),
        }),
        new Campaign({
            id: "2",
            name: "Shadows of New Antioch",
            players: [
                {
                    playerName: "Shadowmaster",
                    playerProfileUrl: "profile/shadowmaster",
                    playerId: 11,
                    playerImageId: 3002,
                    playerStatus: "Supporter",
                    playerImageURL:
                        "https://synod.trench-companion.com/wp-content/uploads/2025/07/Yuzbasi-Captain-Profile-Picture-300x300.jpg",
                },
            ],
            warbands: [],
            created: new Date("2025-07-15"),
        }),
    ];

    const navigate = useNavigate();

    return (
        <div className="CampaignOverview">
            <div className={'container'}>
                <h1 className="">{'Your Campaigns'}</h1>

                <div className={'row'}>
                    {dummyCampaigns.map((campaign) => (
                        <CampaignProvider key={campaign.id} >
                            <PopoverProvider>
                                <CMCampaignListItem campaign={campaign} />
                            </PopoverProvider>
                        </CampaignProvider>
                    ))}

                    <div className={'col'}>
                        <CustomNavLink
                            classes={'CampaignOverview-new-link'}
                            link={`/campaigns/new`}
                            runfunc={() => {
                                navigate(`/campaigns/new`, {state: Date.now().toString()})
                            }}>
                            <FontAwesomeIcon icon={faPlus} className={'icon-inline-left-l'} />

                            {'Create new campaign '}
                        </CustomNavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignOverview;
