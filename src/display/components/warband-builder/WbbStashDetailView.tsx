import React from 'react';
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

interface WbbStashDetailViewProps {
    warband: UserWarband;
    onClose: () => void;
}

const WbbStashDetailView: React.FC<WbbStashDetailViewProps> = ({ warband, onClose }) => {
    const stash = warband.GetStash();

    return (
        <div className="WbbDetailView WbbStashDetailView">
            <div className={'title'}>
                <div className={'title-back'} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} className=""/>
                </div>

                <div className={'title-text'}>
                    {'Stash'}
                </div>
            </div>

            <div className={'detail-view-content'}>
                {/* @TODO: add real Data here */}
                <div className="stash-summary mb-3">
                    <div><strong>Ducats:</strong> {stash.AmountDucats || 0}</div>
                    <div><strong>Glory Points:</strong> {stash.AmountGlory || 0}</div>
                    <div><strong>Value:</strong> {stash.ValueDucats} Ducats / {stash.ValueGlory} Glory</div>
                </div>

                <div className="stash-items">
                    <h6>Items:</h6>
                    {stash.Items && stash.Items.length > 0 ? (
                        <ul className="list-unstyled">
                            {stash.Items.map((item: any, index: number) => (
                                <li key={index} className="stash-item">
                                    <span className="item-name">{item.Name}</span>
                                    {item.ValueDucats > 0 &&
                                        <span className="item-cost"> – {item.ValueDucats} Ducats</span>}
                                    {item.ValueGlory > 0 &&
                                        <span className="item-cost"> – {item.ValueGlory} Glory</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No items in stash.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default WbbStashDetailView;
