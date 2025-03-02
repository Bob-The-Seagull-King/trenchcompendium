import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { StaticOption } from '../../../../classes/options/StaticOption';
import { makestringpresentable } from '../../../../utility/functions';
import { Form } from 'react-bootstrap';
import SingleOptionSetDisplay from './SingleOptionSetDisplay';

const OptionSetStaticDisplay = (props: any) => {
    const OptionSet : StaticOption[] = props.data

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with OptionSetStaticDisplay.tsx</div>}>
            <div className="col">
                {OptionSet.map((item) => (
                    <SingleOptionSetDisplay key={item.RefID} data={item} />
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default OptionSetStaticDisplay;