import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';

interface WbbEditViewModifierProps {
    warbprop: WarbandProperty;
    index : number
}

const WbbEditViewModifier: React.FC<WbbEditViewModifierProps> = ({ warbprop, index }) => {

    const { warband } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <div className="WbbEditViewModifier">
            <div className={'modifier-title'}>
                <span className={'title-name'}>
                    {warbprop.GetTrueName()}
                </span>

                {/* @TODO: Add condition if choices need to be displayed */}
                {warbprop.SelfDynamicProperty.Selections.length > 0 &&
                    <span className={'title-choice'}>
                        {warbprop.SelfDynamicProperty.Selections.map((item) => 
                            <>
                            {
                                item.Option.Name
                            }
                            </>
                        )}                        
                    </span>
                }

                {/* actions */}
                <WbbContextualPopover
                    id={`modifier-${index}`}
                    type="modifier"
                    item={index}
                />
            </div>

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