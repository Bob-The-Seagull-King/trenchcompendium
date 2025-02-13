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
    const [theme] = useGlobalState('theme');


    return (
      <>
        <OverlayTrigger placement={'auto'} 
          overlay={
          <Popover.Body className="fit-to-content overcomeTooltip" id="tooltip">
            <div data-theme={theme} className='fit-to-content popupBody'>
              <div className={' fit-to-content modelStructure borderstyler ' + DisplayType + 'border'+getColour(DisplayColour)}>
                  <h1 className={'titleShape titlebody titlestyler ' + DisplayType + 'background'+getColour(DisplayColour)}>
                      {ruleName || ""}
                  </h1>
                  {displayMethod()}
              </div>
            </div>
          </Popover.Body>
          }>
          <span className='glossaryMain hovermouse'>{DisplayName}</span>
        </OverlayTrigger>
      </>
    )
}

export default GenericHover;