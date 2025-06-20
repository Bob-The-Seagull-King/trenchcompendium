import React from 'react';

interface WbbSpecialRuleProps {
    Title: string;
    Description: string;
}

const WbbSpecialRule: React.FC<WbbSpecialRuleProps> = ({ Title, Description }) => {
    return (
        <div className="WbbSpecialRule">
            <div className={'WbbSpecialRule-title'}>
                {Title}

            </div>

            <div className={'WbbSpecialRule-content'}>
                    {Description}
            </div>
        </div>
    );
};

export default WbbSpecialRule;