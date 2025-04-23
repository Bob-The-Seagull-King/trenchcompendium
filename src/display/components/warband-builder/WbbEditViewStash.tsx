import React from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";

interface WbbEditViewStashProps {
    warband: any;
    onClick?: () => void;
    isActive?: boolean;
}

const WbbEditViewStash: React.FC<WbbEditViewStashProps> = ({ warband, onClick, isActive }) => {
    const stash = warband.GetStash();


    return (
        <div className={`WbbEditViewStash warband-meta ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className={'meta-headline'}>
                {'Stash'}
            </div>

            <div className="stash-value">
                <div className={'cost-ducats'}>{stash.ValueDucats + " Ducats"}</div>
                <div className={'cost-Glory'}>{stash.ValueGlory + " Glory"}</div>
            </div>

            <div className={'stash-contents'}>
                {stash.ValueDucats > 0 &&
                    <div className={'contents-ducats'}><strong>{'Ducats: '}</strong>{stash.AmountDucats}</div>
                }
                {stash.ValueGlory > 0 &&
                    <div className={'contents-Glory'}><strong>{'Glory Points: '}</strong>{stash.AmountGlory}</div>
                }


                {stash.Items.length > 0 ? (
                    <div className={'stash-item-list'}>
                        {stash.Items.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {item.Name}

                                {/* Add comma if not the last item */}
                                {index < stash.Items.length - 1 &&
                                    <>
                                        {', '}
                                    </>
                                }
                            </React.Fragment>
                        ))}

                    </div>

                ) : (
                    <div className={'stash-item-list'}>
                        {'No items in you stash'}
                    </div>
                )}

            </div>
        </div>
    );
};

export default WbbEditViewStash;