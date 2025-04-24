import React from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

interface WbbCampaignDetailViewProps {
    warband: UserWarband;
    onClose: () => void;
}

const WbbCampaignDetailView: React.FC<WbbCampaignDetailViewProps> = ({ warband, onClose }) => {


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

                Campaign details go here
            </div>
        </div>
    );
};

export default WbbCampaignDetailView;
