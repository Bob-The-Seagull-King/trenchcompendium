import React from "react";
import CMHistoryGame from "../micro-components/CMHistoryGame";
import {useCampaign} from "../../../context/CampaignContext";
import CMHistoryAnnouncement from "../micro-components/CMHistoryAnnouncement";


/**
 * The history Panel in the Campaign Manager
 */
const CMHistory: React.FC = () => {

    const { campaign } = useCampaign();

    if( !campaign) {
        return null;
    }

    return (
        <div className="CMHistory">
            <h2>
                {'History'}
            </h2>

            { campaign.GetAnnouncements().map((announcement, index) => (
                <React.Fragment key={index}>
                    <CMHistoryAnnouncement
                        announcement={announcement}
                    />

                    { campaign.GetAnnouncements().length > (index + 1) &&
                        <hr className={'my-4'}/>
                    }
                </React.Fragment>
            ))}
            {/*<CMHistoryGame*/}
            {/*    game={campaign.GetDummyGame()}*/}
            {/*/>*/}

            {/*<hr className={'my-4'}/>*/}

        </div>
    );
};

export default CMHistory;