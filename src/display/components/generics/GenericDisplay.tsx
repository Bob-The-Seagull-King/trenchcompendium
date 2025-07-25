import '../../../resources/styles/vendor/bootstrap.css'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

// Classes
import { getColour } from '../../../utility/functions';

const GenericDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const DisplayType : string = props.d_type;
    const displayMethod = props.d_method
    const DefaultState = props.d_state

    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div className={'basestructure abilityStructure borderstyler ' + DisplayType + 'border'+getColour(DisplayColour)}>
            <div onClick={() => {setOpen(!open)}} className={'   ' + DisplayType + 'background'+getColour(DisplayColour)}>{DisplayName || ""}</div>
            <Collapse in={open}>
            <div>
                {displayMethod()}
            </div>
            </Collapse>
        </div>
    )
}

export default GenericDisplay;