import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

// Classes
import { getColour } from '../../../utility/functions';

const GenericLinkedCollapsableBlockDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const displayMethod = props.d_method
    const DefaultState = props.d_state    
    const StyleType : number = props.bordertype;
    const ShowBorder = props.d_border != undefined? props.d_border : true;
    const BgCol = props.d_col != undefined? props.d_col : "BgBase";
    const MarginSize = props.d_margin != undefined? props.d_margin : "med";
    const LinkOut =  props.d_link != undefined? props.d_link : "";

    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);
        
    // Navigation
    const navigate = useNavigate(); 

    function SpecificNavigtateOut(item : any) {
        navigate(item, {state: Date.now().toString()});
    }

    return (
        <div >
            <div  className={'align-left-right size-strongtext font-default  colorBasicText centered-div border'+getColour(DisplayColour) + " " + (StyleType == 0? "borderthin" : StyleType == 1? "borderthinnosides" : StyleType == 2? "borderthintop" : StyleType == 3? "borderthinbottom" : "borderremove") + " background"+BgCol}>
                <div onClick={() => {SpecificNavigtateOut(LinkOut)}} className={'hovermouse totalmargin'+MarginSize}>
                    {DisplayName || ""}
                </div>
                <div onClick={() => {setOpen(!open)}} className={'hovermouse totalmargin'+MarginSize}>
                    <FontAwesomeIcon icon={open? faChevronUp : faChevronDown} className="colorBasicText"/>
                </div>
            </div>
            <Collapse in={open}>
                <div className={'container border'+getColour(DisplayColour)}>
                    {ShowBorder == true && <div className={"bar background"+getColour(DisplayColour)} />}
                    <div className="content">                    
                        {displayMethod()}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default GenericLinkedCollapsableBlockDisplay;