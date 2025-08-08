import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMContextualPopover from "./CMContextualPopover";

const CMLatestAnnouncement: React.FC = () => {
    const { campaign } = useCampaign();

    const announcement = campaign.GetLatestAnnouncement();

    return (
        <div className="CMLatestAnnouncement">
            <h3 className={'CMLatestAnnouncement-headline'}>
                {'Latest Announcement'}

                <CMContextualPopover
                    id={`announcement-latest`}
                    type="announcement"
                    item={announcement} // this is a placeholder
                />
            </h3>

            <div className={'CMLatestAnnouncement-content'}>
                <h4 className={'CMLatestAnnouncement-title'}>
                    {announcement.title}
                </h4>
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
