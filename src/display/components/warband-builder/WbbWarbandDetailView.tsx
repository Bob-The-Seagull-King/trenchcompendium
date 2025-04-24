import React from 'react';
import { UserWarband } from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

interface WbbWarbandDetailViewProps {
    warband: UserWarband;
    onClose: () => void;
}

const WbbWarbandDetailView: React.FC<WbbWarbandDetailViewProps> = ({ warband, onClose }) => {

    return (
        <div className="WbbDetailView WbbWarbandDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Warband Details'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* @TODO: add real Data here */}

                Warband Details go here
            </div>
        </div>
    );
};

export default WbbWarbandDetailView;
