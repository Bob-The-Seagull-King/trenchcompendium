import '../../../resources/styles/vendor/bootstrap.css'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

// Classes
import { getColour } from '../../../utility/functions';

const GenericTableItemDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const DisplayValue : string = props.d_value;
    const DisplayValueTitle : string = props.d_valuetitle;
    const DisplayType : string = props.d_type;
    const displayMethod = props.d_method
    const DefaultState = props.d_state

    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div className={'basestructurenoshadow abilityStructure borderstyler ' + DisplayType + 'border'+getColour(DisplayColour)}>
            <div onClick={() => {setOpen(!open)}} className={'titleShapeDual hovermouse titlebodyDual ' + DisplayType + 'background'+getColour(DisplayColour)}>
                {DisplayValue != null && <div className="">
                    {DisplayValueTitle + (DisplayValue.toString().length > 1? DisplayValue : "0"+DisplayValue)}
                </div>}
                <div className="titlebodyMainTitle">
                    {DisplayName || ""}
                </div>
            </div>
            <Collapse in={open}>
            <div>
                {displayMethod()}
            </div>
            </Collapse>
        </div>
    )
}

export default GenericTableItemDisplay;