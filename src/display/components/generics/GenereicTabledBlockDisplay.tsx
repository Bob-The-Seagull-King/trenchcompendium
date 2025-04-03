import '../../../resources/styles/vendor/bootstrap.css'
import { Button, Collapse } from "react-bootstrap";
import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

// Classes
import { getColour } from '../../../utility/functions';

const GenericTabledBlockDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const displayMethod = props.d_method
    const DefaultState = props.d_state    
    const StyleType : number = props.bordertype;
    const ShowBorder = props.d_border != undefined? props.d_border : true;
    const BgCol = props.d_col != undefined? props.d_col : "BgBase";
    const TitleCol = props.d_title != undefined? props.d_title : "BgCard";
    const MarginSize = props.d_margin != undefined? props.d_margin : "med";
    const Content = props.d_content;


    const [open, setOpen]   = useState((DefaultState != undefined)? DefaultState : true);

    return (
        <div >
            <div onClick={() => {setOpen(!open)}} className={'align-left-right size-strongtext   hovermouse centered-div border'+getColour(DisplayColour) + " " + (StyleType == 0? "borderthin" : StyleType == 1? "borderthinnosides" : StyleType == 2? "borderthintop" : StyleType == 3? "borderthinbottom" : "borderremove") + " background"+BgCol}>
                <div className={"stat_parent totalmargin"+MarginSize}>
                    <div className={" min-width-small bordergrey borderstyler  centered-div background"+TitleCol}>
                        <div className="align-center size-strongtext totalmarginsml">
                            {Content}
                        </div>
                    </div>
                    <div className="centered-div horizontalspacermed">
                        {DisplayName || ""}
                    </div>
                </div>
                <div className={'totalmargin'+MarginSize}>
                    <FontAwesomeIcon icon={open? faChevronUp : faChevronDown} className=""/>
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

export default GenericTabledBlockDisplay;