import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';

interface WbbEditViewModifierProps {
    warbprop: WarbandProperty;
    index : number
}

const WbbEditViewModifier: React.FC<WbbEditViewModifierProps> = ({ warbprop, index }) => {

    const { warband, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className="WbbEditViewModifier" key={updateKey}>
            <div className={'modifier-title'}>
                <span className={'title-name'}>
                    {warbprop.GetTrueName()}
                </span>

                {/* actions */}
                <WbbContextualPopover
                    id={`modifier-${index}`}
                    type="modifier"
                    item={index}
                />
            </div>
            

                {warbprop.SelfDynamicProperty.Selections.length > 0 &&
                    <span className={'title-choice'}>
                        {warbprop.SelfDynamicProperty.Selections.map((item) => 
                            <WbbOptionSelect 
                                key={warbprop.SelfDynamicProperty.Selections.indexOf(item)}
                                choice={item}
                            />
                        )}                        
                    </span>
                }

            <div className={'modifier-body'}>
                
                {(warbprop.GetOwnDescription() != null) &&
                <>
                    {
                        returnDescription(warbprop, warbprop.GetOwnDescription())
                    }
                </>
                }
            </div>
        </div>
    );
};

export default WbbEditViewModifier;