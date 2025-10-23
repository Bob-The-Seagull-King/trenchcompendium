import React, {useState} from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CMPlayerSmall from "./CMPlayerSmall";
import WbbContextualPopover from "../../components/warband-builder/WbbContextualPopover";
import CMContextualPopover from "../components/CMContextualPopover";
import {CampaignAnnouncement} from "../../../classes/saveitems/Campaign/CampaignAnnouncement";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

type CMHistoryAnnouncementProps = {
    announcement: CampaignAnnouncement;
};

/**
 * The history Panel in the Campaign Manager
 */
const CMHistoryAnnouncement: React.FC<CMHistoryAnnouncementProps> = ({ announcement }) => {
    const { campaign } = useCampaign();
    const [expanded, setExpanded] = useState(false);

    const CHAR_LIMIT = 200;
    const isLong = announcement.MarkupHtml.length > CHAR_LIMIT; // change this

    return (
        <div className="CMHistoryAnnouncement">
            <h3 className={'CMHistoryAnnouncement-title'}>
                {announcement.Title}

                <CMContextualPopover
                    id={`announcement-${announcement.Id}`}
                    type="announcement"
                    item={announcement}
                />
            </h3>

            <div className={'CMHistoryAnnouncement-date'}>{announcement.DateStr}</div>

            <CMPlayerSmall
                player={announcement.Author}
            />

            <div className="CMHistoryAnnouncement-message-wrap" >
                <p
                    className={`CMHistoryAnnouncement-message ${isLong ? 'is-long' : ''} ${expanded ? 'is-expanded' : ''}`}
                    dangerouslySetInnerHTML={{ __html: announcement.MarkupHtml }}></p>

                {!expanded && isLong && (
                    <span
                        className="show-more small"
                        onClick={() => setExpanded(true)}
                    >
                    {'Show more'}
                        <FontAwesomeIcon icon={faChevronDown} className={'ms-2'}/>
                    </span>
                )}
            </div>
        </div>
    );
};

export default CMHistoryAnnouncement;