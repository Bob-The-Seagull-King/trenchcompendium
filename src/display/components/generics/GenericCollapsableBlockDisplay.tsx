import '../../../resources/styles/vendor/bootstrap.css'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// Classes
import { getColour } from '../../../utility/functions';

const GenericCollapsableBlockDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const displayMethod = props.d_method
    const DefaultState = props.d_state    
    const StyleType : number = props.bordertype;
    const ShowBorder = props.d_border != undefined? props.d_border : true;
    const BgCol = props.d_col != undefined? props.d_col : "BgBase";
    const MarginSize = props.d_margin != undefined? props.d_margin : "med";


    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div >
            <div onClick={() => {setOpen(!open)}} className={'      border'+getColour(DisplayColour) + " " + (StyleType == 0? "borderthin" : StyleType == 1? "borderthinnosides" : StyleType == 2? "borderthintop" : StyleType == 3? "borderthinbottom" : "borderremove") + " background"+BgCol}>
                <div className={'totalmargin'+MarginSize}>
                    {DisplayName || ""}
                </div>
                <div className={'totalmargin'+MarginSize}>
                    <FontAwesomeIcon icon={open? faChevronUp : faChevronDown} className=""/>
                </div>
            </div>
            <Collapse in={open}>
                <div className={'container border'+getColour(DisplayColour)}>
                    {ShowBorder == true && <div className={"background"+getColour(DisplayColour)} />}
                    <div className="content">                    
                        {displayMethod()}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default GenericCollapsableBlockDisplay;