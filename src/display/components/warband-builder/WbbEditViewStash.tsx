import React from 'react';
import WbbEditViewFighter from "./WbbEditViewFighter";

interface WbbEditViewStashProps {
    warband: any;
}

const WbbEditViewStash: React.FC<WbbEditViewStashProps> = ({ warband }) => {

    // Testing Data for the stash
    const stash = {
        ValueDucats: 122,
        ValueGlory: 4,
        AmountDucats: 15,
        AmountGlory: 1,
        Items: [
            {
                Name: 'Jezzail',
                Id: 'fc-jezzail',
                ValueDucats: 17,
                ValueGlory: 0
            },
            {
                Name: 'Jezzail',
                Id: 'fc-jezzail',
                ValueDucats: 17,
                ValueGlory: 0
            },
            {
                Name: 'Trench Knife',
                Id: 'fc-trench-knife',
                ValueDucats: 17,
                ValueGlory: 0
            },
            {
                Name: 'Gas Mask',
                Id: 'fc-gas-mask',
                ValueDucats: 5,
                ValueGlory: 0
            },
            {
                Name: 'Machine Gun',
                Id: 'fc-machine-gun',
                ValueDucats: 0,
                ValueGlory: 2
            }
        ]
    }

    return (
        <div className="WbbEditViewStash warband-meta">
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
                        {stash.Items.map(item => item.Name).join(', ')}
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