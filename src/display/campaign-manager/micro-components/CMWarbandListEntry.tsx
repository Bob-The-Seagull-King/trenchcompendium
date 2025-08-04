import React from 'react';

// @TODO: this is only dummy data
interface CMWarbandListEntryProps {
    warband: {
        warbandImageId: number;
        warbandImageURL: string;
        playerName: string;
        playerProfileUrl: string;
        playerId: number;
        playerImageId: number;
        playerImageURL: string;
        warbandRating: string;
    };
}

const CMWarbandListEntry: React.FC<CMWarbandListEntryProps> = ({ warband }) => {


    return (
        <div className="CMWarbandListEntry">

        </div>
    );
};

export default CMWarbandListEntry;