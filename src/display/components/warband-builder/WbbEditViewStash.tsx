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

    return (
        <div className={`WbbEditViewStash warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>
                {'Stash'}
            </div>

            <div className="stash-value">
                <div className={'cost-ducats'}>{(warband.warband_data.GetStashValueDucats()) + " Ducats"}</div>
                <div className={'cost-Glory'}>{(warband.warband_data.GetStashValueGlory()) + " Glory"}</div>
            </div>

            <div className={'stash-contents'}>
                <div className={'contents-ducats'}>
                    <strong>{'Spare Ducats: '}</strong>{(warband.warband_data.GetStashedDucats() > 10e10 ? "Unlimited" : warband.warband_data.GetStashedDucats())}
                </div>
                <div className={'contents-Glory'}>
                    <strong>{'Spare Glory Points: '}</strong>{(warband.warband_data.GetStashedGlory() > 10e10 ? "Unlimited" : warband.warband_data.GetStashedGlory())}
                </div>

                {warband?.warband_data.Equipment.length > 0 ? (
                    <div className={'stash-item-list'}>
                        {warband?.warband_data.Equipment.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {item.GetItemName()}

                                {/* Add comma if not the last item */}
                                {index < warband?.warband_data.Equipment.length - 1 &&
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