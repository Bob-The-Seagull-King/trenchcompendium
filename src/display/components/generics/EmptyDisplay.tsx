import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'

// Classes
import { getColour } from '../../../utility/functions';

const EmptyDisplay = (props: any) => {
    const DisplayColour : string = props.d_colour;
    const DisplayName : string = props.d_name;
    const DisplayType : string = props.d_type;
    const displayMethod = props.d_method

    return (
        <div className={' basestructure abilityStructure borderstyler ' + DisplayType + 'border'+getColour(DisplayColour)}>
            {displayMethod()}
        </div>
    )
}

export default EmptyDisplay;