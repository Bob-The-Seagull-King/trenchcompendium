import React from 'react';
import {Model} from "../../../classes/feature/model/Model";

export interface FighterStlListProps {
    /** Pass `fighter.CurModel` from the parent component */
    curModel: Model;
}

const FighterStlList: React.FC<FighterStlListProps> = ({ curModel }) => {
    // TODO: implement UI/logic for listing STLs of the current fighter model
    return (
        <div className="FighterStlList">
            {/* empty for now */}
        </div>
    );
};

export default FighterStlList;