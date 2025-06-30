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
                <div className={'cost-ducats'}>{stash.AmountDucats + " Ducats"}</div>
                <div className={'cost-Glory'}>{stash.AmountGlory + " Glory"}</div>
            </div>

            <div className={'stash-contents'}>
                {stash.ValueDucats > 0 &&
                    <div className={'contents-ducats'}><strong>{'Ducats: '}</strong>{stash.ValueDucats}</div>
                }
                {stash.ValueGlory > 0 &&
                    <div className={'contents-Glory'}><strong>{'Glory Points: '}</strong>{stash.ValueGlory}</div>
                }


                {warband?.warband_data.Equipment.length > 0 ? (
                    <div className={'stash-item-list'}>
                        {warband?.warband_data.Equipment.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {item.GetItemName()}

                                {/* Add comma if not the last item */}
                                {index < stash.Items.length &&
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