import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { ViewTableItem } from '../../../../classes/viewmodel/collections/ViewTableItem'
import { Form } from 'react-bootstrap';

const ViewTableItemDisplay = (props: any) => {
    const tableItem: ViewTableItem = props.data
    const parentView = props.parent;
    const updateHost = props.statefunction;
    const position = props.positionid;

    // State
    const [_activestate, checkstate] = useState(tableItem.IsActive);

    /**
     * Updates the current state of the component
     * and triggers an update of the selected list
     * items and re-renders the ability display.
     */
    function UpdateComponent() {
        tableItem.SwitchStates();
        parentView.UpdateList();
        updateHost();
        checkstate(tableItem.IsActive);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ViewTableItemDisplay.tsx</div>}>
        <div style={{width: "100%", marginBottom: "0px", position: "relative"}} className='hovermouse' onClick={() => UpdateComponent()}>
            
            <h1 className={"titlebody " + (position() % 2 == 0? "" : "sub") + "background" + tableItem.Colour + " no-padding itemlisttext softpad"}>
            <Form.Check className="colordefault packtitlebase"
                inline
                disabled
                name="group1"
                type={"checkbox"}
                id={`inline-${"checkbox"}-1`}
                checked={_activestate}
            />
                {tableItem.HeldItem.Name}
            </h1>
        </div>
        </ErrorBoundary>
    )
}

export default ViewTableItemDisplay;