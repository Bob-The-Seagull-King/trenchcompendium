import { IChoice } from "../../../../classes/options/StaticOption";
import { ContextObject } from "../../../../classes/contextevent/contextobject";
import { WarbandConsumable } from "../../../../classes/saveitems/Warband/WarbandConsumable";
import { useWarband } from "../../../../context/WarbandContext";
import React, {Fragment, useEffect, useState} from "react";
import { ToolsController } from "../../../../classes/_high_level_controllers/ToolsController";
import { EventRunner } from "../../../../classes/contextevent/contexteventhandler";
import WbbConsumableSelect from "../modals/warband/WbbConsumableSelect";
import WbbExploration_Selection_SmallList from "./WbbExploration_Selection_SmallListEquipment";
import WbbExploration_Selection_SingleEquipment from "./WbbExploration_Selection_SingleEquipment";
import WbbExploration_Selection_MultiEquipment from "./WbbExploration_Selection_MultiEquipment";
import WbbExploration_Selection_GloryPurchase from "./WbbExploration_Selection_GloryPurchase";

interface WbbExploration_Selection_Parent_Props {
    property : WarbandConsumable;
    doshow : boolean;
    dochange : boolean;
}

const WbbExploration_Selection_Parent: React.FC<
    WbbExploration_Selection_Parent_Props
> = ({property, doshow, dochange}) => {
    
    
        const { warband, reloadDisplay, updateKey } = useWarband();

        const [selecttype, setselecttype] = useState(0);
        const [keyvar, setkeyvar] = useState(0);
        
        useEffect(() => {
            async function GetMessage() {
                
                const Events : EventRunner = new EventRunner();
                const Type = await Events.runEvent(
                    "getConsumableSelectType",
                    property,
                    [warband?.warband_data],
                    0,
                    null
                )
                setselecttype(Type)
                setkeyvar(keyvar + 1)
            }

            GetMessage();
        }, [updateKey]);
        
        return (
            <React.Fragment key={keyvar}>
                {selecttype == 0 &&
                    <WbbConsumableSelect
                        property={property}
                        dochange={dochange}
                        />
                }

                {selecttype == 1 &&
                    <WbbExploration_Selection_SmallList
                        property={property}
                        doshow={doshow}
                    />
                }

                {selecttype == 2 &&
                    <WbbExploration_Selection_SingleEquipment
                            property={property}
                            dochange={dochange}
                    />
                }


                {selecttype == 3 &&
                        <WbbExploration_Selection_MultiEquipment
                        property={property}
                            dochange={dochange}
                        />
                }

                {selecttype == 4 &&
                    <>
                        <WbbExploration_Selection_GloryPurchase
                            property={property}
                            dochange={dochange}
                        />
                    </>
                }
            </React.Fragment>
        );
};

export default WbbExploration_Selection_Parent;
