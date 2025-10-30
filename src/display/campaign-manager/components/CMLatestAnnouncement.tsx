import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import CMContextualPopover from "./CMContextualPopover";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import {useNavigate} from "react-router-dom";

const CMLatestAnnouncement: React.FC = () => {
    const { campaign } = useCampaign();

    if( !campaign) {
        return null;
    }
    const navigate = useNavigate();

    const announcement = campaign.GetLatestAnnouncement(); // CampaignAnnouncement | null

    if (!announcement) {
        return (
            <div className="CMLatestAnnouncement">
                <h3 className="CMLatestAnnouncement-headline">Latest Announcement</h3>
                <div className={'CMLatestAnnouncement-content'}>
                    <div className={'CMLatestAnnouncement-text-wrap'}>
                        <p
                            className={`CMLatestAnnouncement-text`}
                        >
                            {'No announcements'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const [expanded, setExpanded] = useState(false);

    const CHAR_LIMIT = 200;
    const isLong = announcement.MarkupHtml.length > CHAR_LIMIT;

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
                    {announcement.Title}
                </h4>
                <div className={'CMLatestAnnouncement-date'}>
                    {announcement.DateStr}
                </div>

                <div className={'CMLatestAnnouncement-author'}>
                    <CustomNavLink
                        classes={'CMLatestAnnouncement-author-link'}
                        link={`/profile/${announcement.Author.Id}`}
                        runfunc={() => {
                            navigate(`/profile/${announcement.Author.Id}`)
                        }}>
                        {announcement.Author.Name}
                    </CustomNavLink>
                </div>
                <div className={'CMLatestAnnouncement-text-wrap'}>
                    <p
                        className={`CMLatestAnnouncement-text ${isLong ? 'is-long' : ''} ${expanded ? 'is-expanded' : ''}`}
                        dangerouslySetInnerHTML={{__html: announcement.MarkupHtml}}
                    >
                    </p>

                    {!expanded && isLong && (
                        <span
                            className="show-more small"
                            onClick={() => setExpanded(true)}
                        >
                            {'Show more'}
                            <FontAwesomeIcon icon={faChevronDown} className={'ms-2'}/>
                        </span>
                    )}
                    {expanded && isLong && (
                        <span
                            className="show-less small"
                            onClick={() => setExpanded(false)}
                        >
                            {'Show less'}
                            <FontAwesomeIcon icon={faChevronUp} className={'ms-2'}/>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CMLatestAnnouncement;
