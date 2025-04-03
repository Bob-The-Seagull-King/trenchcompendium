import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'


import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// Classes
import { useGlobalState } from '../../../utility/globalstate'
import { getColour } from '../../../utility/functions';
import { Popover } from 'react-bootstrap';

const GenericHover = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const DisplayType : string = props.d_type;
    const displayMethod = props.d_method

    const ruleName = props.titlename

    return (
      <OverlayTrigger placement={'auto'} 
        overlay={
        <Popover.Body bsPrefix="empty" className="popover rules-popover-element" id="tooltip">
          <div className='width-content  '>
            <div className={DisplayType}>
                <div className="popover-headline">
                    {ruleName || ""}
                </div>
                <div className="popover-content">
                  {displayMethod()}
                </div>
            </div>
          </div>
        </Popover.Body>
        }>
        <span className='rules-popover-link'>{DisplayName}</span>
      </OverlayTrigger>
    )
}

export default GenericHover;