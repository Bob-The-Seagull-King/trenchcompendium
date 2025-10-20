import React from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMContextualPopover from "./CMContextualPopover";

const CMLatestAnnouncement: React.FC = () => {
    const { campaign } = useCampaign();

    if( !campaign) {
        return null;
    }

    const announcement = campaign.GetLatestAnnouncement(); // CampaignAnnouncement | null

    if (!announcement) {
        // @TODO create better empty state
        return (
            <div className="CMLatestAnnouncement">
                <h3 className="CMLatestAnnouncement-headline">Latest Announcement</h3>
                <p className="text-muted">No announcements yet.</p>
            </div>
        );
    }

    // Format the date from the Date getter
    const dateStr = new Intl.DateTimeFormat(navigator.language, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(announcement.Date);

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
                    {announcement.Author.Nickname}
                </h4>
                <div className={'CMLatestAnnouncement-date'}>
                    {dateStr}
                </div>
                <div className={'CMLatestAnnouncement-text'}
                     dangerouslySetInnerHTML={{ __html: announcement.Html }}
                >
                </div>
            </div>

        </div>
    );
};

export default CMLatestAnnouncement;
