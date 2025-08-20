import React from 'react';
import {toRoman} from "../../../utility/functions";


interface CMRoundNumberProps {
    round: number;
}

const CMRoundNumber: React.FC<CMRoundNumberProps> = ({ round }) => {

    // Add or remove the class "smaller" for sizing
    return (
        <div className="CMRoundNumber smaller">
            {toRoman(round)}
        </div>
    );
};

export default CMRoundNumber;