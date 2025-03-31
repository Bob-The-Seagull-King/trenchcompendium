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

    // State
    const [theme, setTheme] = useGlobalState('theme');

    if ((theme == "" ) || (theme == null)) { // Default theme to light
        setTheme('dark');
    }

    return (
      <OverlayTrigger placement={'auto'} 
        overlay={
        <Popover.Body bsPrefix="empty" className="popover" id="tooltip">
          <div data-theme={theme} className='width-content font-default'>
            <div className={'col-12 backgroundBgCard borderstyler ' + DisplayType + 'border'+getColour(DisplayColour)}>
                <h1 className={'size-strongtext font-default hovermouse centered-div background'+getColour(DisplayColour)}>
                    {ruleName || ""}
                </h1>
                <div className="backgroundBgCard size-default">
                  {displayMethod()}
                </div>
            </div>
          </div>
        </Popover.Body>
        }>
        <span className='colordefault width-content hovermouse'>{DisplayName}</span>
      </OverlayTrigger>
    )
}

export default GenericHover;