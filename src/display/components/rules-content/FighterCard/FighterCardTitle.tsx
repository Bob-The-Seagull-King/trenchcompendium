import React from 'react';

interface FighterCardTitleProps {
    name?: string;
}

const FighterCardTitle: React.FC<FighterCardTitleProps> = ({ name }) => {
    return (
        <div className="fighter-card-title">
            {name}
        </div>
    );
};

export default FighterCardTitle;