import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";

const CMLatestAnnouncement: React.FC = () => {
    const { campaign } = useCampaign();

    const announcement = campaign.GetLatestAnnouncement();

    return (
        <div className="CMLatestAnnouncement">
            <h3 className={'CMLatestAnnouncement-headline'}>
                {'Latest Announcement'}
            </h3>

            <div className={'CMLatestAnnouncement-content'}>
                <div className={'CMLatestAnnouncement-date'}>
                    {announcement.date}
                </div>
                <p className={'CMLatestAnnouncement-text'}>
                    {announcement.text}
                </p>
            </div>

        </div>
    );
};

export default CMLatestAnnouncement;
