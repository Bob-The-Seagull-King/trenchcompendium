import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { StaticOption } from '../../../../classes/options/StaticOption';
import { makestringpresentable } from '../../../../utility/functions';
import { Form } from 'react-bootstrap';

const OptionSetStaticDisplay = (props: any) => {
    const OptionSet : StaticOption[] = props.data

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with OptionSetStaticDisplay.tsx</div>}>
            <div className="col">
                {OptionSet.map((item) => (
                    <>
                        
                        <div className="colordefault bodytext complextext">
                            {
                                item.Name
                            }
                        </div>
                        
                        <Form.Control className={"borderstyler subborderdefault" } as="select" aria-label="Default select example"  placeholder="Member Type" >
                            {item.Selections.map((selec) => ( 
                                <option key={"modeloption"+(item.Selections.indexOf(selec).toString())} >{makestringpresentable(selec.display_str)}</option> 
                            ))}
                        </Form.Control>
                    </>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default OptionSetStaticDisplay;