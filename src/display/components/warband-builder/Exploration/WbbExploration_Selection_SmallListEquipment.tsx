import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { IChoice } from "../../../../classes/options/StaticOption";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import React, { useState } from "react";
import { useWarband } from "../../../../context/WarbandContext";

interface WbbExploration_Selection_SmallList_Props {
    property : WarbandConsumable;
    doshow: boolean;
}

const WbbExploration_Selection_SmallList: React.FC<
    WbbExploration_Selection_SmallList_Props
> = ({ property, doshow }) => {

    const { warband, reloadDisplay, updateKey } = useWarband();
    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);

    const [_keyvar, setkeyvar] = useState(0);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (!doshow) {return;}
        if (foundOption != null) {
            property.OnSelect(foundOption).then(() => {
                setSelectedoption(property.SelectItem)
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                 () => reloadDisplay())
            })
        }
    };

    return (
        <div className="WbbExploration_Selection_Fallen_Knight mb-3">
            <div className="fw-bold mb-2">Choose weapon to loot</div>

            {property.Options.map((opt) => (
                <div className="form-check" key={opt.id}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="fallen-knight-option"
                        value={opt.id}
                        checked={selectedoption === opt.value}
                        onClick={() => handleSubmit(opt)}
                        readOnly
                    />
                    <label
                        className={`form-check-label `}
                        onClick={() => handleSubmit(opt)}
                    >
                        {opt.display_str}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default WbbExploration_Selection_SmallList;
