import React, {useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CMPlayerSmall from "./CMPlayerSmall";
import WbbContextualPopover from "../../components/warband-builder/WbbContextualPopover";
import CMContextualPopover from "../components/CMContextualPopover";

type CMHistoryAnnouncementProps = {
    announcement: {
        title: string;
        date: string;
        message: string;
        playerName: string;
        playerId: number;
        playerImageId: number;
    };
};

/**
 * The history Panel in the Campaign Manager
 */
const CMHistoryAnnouncement: React.FC<CMHistoryAnnouncementProps> = ({ announcement }) => {
    const { campaign } = useCampaign();
    const [expanded, setExpanded] = useState(false);

    const CHAR_LIMIT = 200;
    const isLong = announcement.message.length > CHAR_LIMIT;
    const displayText = expanded
        ? announcement.message
        : isLong
            ? announcement.message.slice(0, CHAR_LIMIT) + "... "
            : announcement.message;

    return (
        <div className="CMHistoryAnnouncement">
            <h3 className={'CMHistoryAnnouncement-title'}>
                {announcement.title}

                <CMContextualPopover
                    id={`announcement-${announcement.title}`}
                    type="announcement"
                    item={announcement} // this is a placeholder
                />
            </h3>
            <div className={'CMHistoryAnnouncement-date'}>{announcement.date}</div>

            <CMPlayerSmall
                player={{
                    playerId: 3,
                    playerName: 'Emitoo',
                    playerImageId: 2818
                }}
            />

            <p className="CMHistoryAnnouncement-message">
                {displayText}
                {!expanded && isLong && (
                    <span
                        className="show-more"
                        onClick={() => setExpanded(true)}
                    >
                    {'more'}
                    </span>
                )}
            </p>
        </div>
    );
};

export default CMHistoryAnnouncement;