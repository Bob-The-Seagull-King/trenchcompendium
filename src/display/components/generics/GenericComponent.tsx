import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'

// Classes
import { returnDescription } from '../../../utility/util';

const GenericComponentDisplay = (props: any) => {
    const TraitObject = props.data

    return (
        <div className='abilityInternalStructure'>
            <div>
                {returnDescription(TraitObject, TraitObject.Description)}
            </div>
        </div>
    )
}

export default GenericComponentDisplay;