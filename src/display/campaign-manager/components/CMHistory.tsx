import React from "react";
import CMHistoryGame from "../micro-components/CMHistoryGame";
import {useCampaign} from "../../../context/CampaignContext";


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

        </div>
    );
};

export default CMHistory;