import React from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";
import { useWarband  } from '../../../context/WarbandContext';
interface WbbEditViewStashProps {
    onClick?: () => void;
    isActive?: boolean;
}

const WbbEditViewStash: React.FC<WbbEditViewStashProps> = ({ onClick, isActive }) => {
    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    const stash = warband.warband_data.GetStash();


    return (
        <div className={`WbbEditViewStash warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>
                {'Stash'}
            </div>

            <div className="stash-value">
                <div className={'cost-ducats'}>{(stash.TotalDucats) + " Ducats"}</div>
                <div className={'cost-Glory'}>{(stash.TotalGlory) + " Glory"}</div>
            </div>

            <div className={'stash-contents'}>
                <div className={'contents-ducats'}><strong>{'Spare Ducats: '}</strong>{(stash.AmountDucats > 10e10? "Unlimited" : stash.AmountDucats)}</div>
                <div className={'contents-Glory'}><strong>{'Spare Glory Points: '}</strong>{(stash.AmountGlory  > 10e10? "Unlimited" : stash.AmountGlory)}</div>


                {warband?.warband_data.Equipment.length > 0 ? (
                    <div className={'stash-item-list'}>
                        {warband?.warband_data.Equipment.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {item.GetItemName()}

                                {/* Add comma if not the last item */}
                                {index < warband?.warband_data.Equipment.length -1 &&
                                    <>
                                        {', '}
                                    </>
                                }
                            </React.Fragment>
                        ))}

                    </div>

                ) : (
                    <div className={'stash-item-list'}>
                        {'No items in your stash'}
                    </div>
                )}

            </div>
        </div>
    );
};

export default WbbEditViewStash;