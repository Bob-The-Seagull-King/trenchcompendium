import { useWarband } from "../../../../context/WarbandContext";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import React, { useState } from "react";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { IChoice } from "../../../../classes/options/StaticOption";
import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";

interface WbbExploration_Selection_DieRollResult_Props {
    property : WarbandConsumable;
    dochange: boolean;
}

const WbbExploration_Selection_DieRollResult: React.FC<
    WbbExploration_Selection_DieRollResult_Props
> = ({ property,  dochange }) => {

    const [result, setResult] = useState<number | undefined>(GetCur());
    const [isvalid, setisvalid] = useState<boolean>(IsValidAnswer(result));
    const [keyvar, setkeyvar] = useState(0);

    const { warband, reloadDisplay, updateKey } = useWarband();
    const [showModal, setshowModal] = useState(false);

    const [selectedoption, setSelectedoption] = useState<ContextObject | null>(property.SelectItem);
    const [curval, setcurval] = useState(0);


    const handleSubmit = (foundOption : IChoice | null) => {
        if (foundOption != null) {
            property.OnSelect(foundOption).then(() => {
                setSelectedoption(property.SelectItem)
                setcurval(parseInt(foundOption.value))
                setisvalid(true);
                setResult(parseInt(foundOption.value))
                setkeyvar(keyvar + 1)
                const Manager : ToolsController = ToolsController.getInstance();
                Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                    () => reloadDisplay())
            })
        }
    };

    function GetMin() {
        let CurMin = property.Options[0].value;
        for (let i = 0; i < property.Options.length; i++) {
            if (parseInt(property.Options[i].value) < CurMin) {
                CurMin = parseInt(property.Options[i].value);
            }
        }
        return CurMin
    }


    function GetCur() {
        if (property.SelectData != null) {
            return property.SelectData
        }
        return undefined;
    }

    function TrySubmit(val : any) {
        let IsFound = false;
        for (let i = 0; i < property.Options.length; i++) {
            if (parseInt(property.Options[i].value) == parseInt(val)) {
                IsFound = true;
                handleSubmit(property.Options[i]);
            }
        }
        if (IsFound == false) {
            setResult(parseInt(val))
            setisvalid(IsValidAnswer(val));
            setkeyvar(keyvar + 1)
        }
    }

    function IsValidAnswer(val : any) {
        for (let i = 0; i < property.Options.length; i++) {
            if (parseInt(property.Options[i].value) == parseInt(val)) {
                return true;
            }
        }
        return false;
    }


    return (
        <div className="WbbExploration_Selection_DieRollResult mb-3">
            <div className="fw-bold mb-2">{(property.Tags["item_name"] != undefined)? property.Tags["item_name"]: "Die Result"}</div>

            <input
                type="number"
                className={`form-control ${!isvalid ? 'is-invalid' : ''}`}
                min={GetMin()}
                disabled={!dochange}
                value={result  ?? ''}
                onChange={(e) => {
                    TrySubmit(e.target.value)
                }}
                onFocus={(e) => e.target.select()}
            />
        </div>
    );
};

export default WbbExploration_Selection_DieRollResult;
