import React from "react";
import CMHistoryGame from "../micro-components/CMHistoryGame";
import {useCampaign} from "../../../context/CampaignContext";
import CMHistoryAnnouncement from "../micro-components/CMHistoryAnnouncement";


/**
 * The history Panel in the Campaign Manager
 */
const CMHistory: React.FC = () => {

    const { campaign } = useCampaign();

    return (
        <div className="CMHistory">
            <h2>
                {'History'}
            </h2>

            <CMHistoryGame
                game={campaign.GetDummyGame()}
            />

            <hr className={'my-4'}/>

            <CMHistoryGame
                game={campaign.GetDummyGame()}
            />

            <hr className={'my-4'}/>

            <CMHistoryAnnouncement
                announcement={
                    {
                        title: 'Let the games begin',
                        date: '25.08.2025',
                        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        playerName: 'Bob the Seagull King',
                        playerId: 3,
                        playerImageId: 2818,
                    }
                }
            />

        </div>
    );
};

export default CMHistory;