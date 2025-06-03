// FighterCardMetaEntry.tsx
import React, {ReactNode} from 'react';

interface FighterCardMetaEntryProps {
    className: string;
    label: string;
    value: string | number | ReactNode;
}

const FighterCardMetaEntry: React.FC<FighterCardMetaEntryProps> = ({ className, label, value }) => {
    return (
        <div className={`fighter-meta-entry-simple ${className}`}>
            <span className="fighter-meta-label">
                {label}:
            </span>
            <span className="fighter-meta-value">
                {value}
            </span>
        </div>
    );
};

export default FighterCardMetaEntry;
