import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'

// Classes
import { makestringpresentable } from '../../../../utility/functions'

const FilterDisplay = (prop: any) => {
    const title = prop.title
    const value = prop.value    
    const exists = prop.state

    // Return result -----------------------------
    return (
        <div className="">
            <div className="centerPosition">
                <div className={"quartermargin borderstyler basestructure filterbuttonitem" + (exists == "" ? " bordergrey backgroundgrey" : exists == "positive" ? " subbordergreen subbackgroundgreen" : " subborderred subbackgroundred")}>
                    {makestringpresentable(title)}{(value.toString().trim().length == 0)? ": " : ": "}{makestringpresentable(value)}
                </div>
            </div>
        </div>
    )
    // -------------------------------------------
}

export default FilterDisplay