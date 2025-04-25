import React from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";

interface WbbCampaignDetailViewProps {
    onClose: () => void;
}

const WbbCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ onClose }) => {
    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className="WbbDetailView WbbCampaignDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Campaign'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* @TODO: add real Data here */}
                <h4>Campaign Values</h4>

                <div>
                    Victory Points
                </div>

                <div>
                    Notes Textarea
                </div>

                <div>
                    Patron Display
                </div>

                <h4>Campaign Link</h4>

                <div>
                    Connect to campaign here
                </div>


                <h4>Campaign Summary</h4>

                <div>
                    Campaign Cycle
                </div>

                <div>
                    Battle Count
                </div>

                <div className={''}>
                    Leaderboard
                </div>


            </div>
        </div>
    );
};

export default WbbCampaignDetailView;
