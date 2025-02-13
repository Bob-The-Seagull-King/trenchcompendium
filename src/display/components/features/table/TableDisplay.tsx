import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Table from 'react-bootstrap/Table';

// Classes
import { returnTags, returnDescription } from '../../../../utility/util';
import { TableBody } from '../../../../classes/feature/table/tablebody';
import { getColour } from '../../../../utility/functions';

const TableDisplay = (props: any) => {
    const TableObject: TableBody = props.data
    const DisplayColour : string = props.d_colour;
    const DisplayType : string = props.d_type;

    const BackgroundClass = DisplayType+"background"+getColour(DisplayColour)

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with TableDisplay.tsx</div>}>
            <Table className={BackgroundClass + "textmaxwidth no-margin"}>                
                <thead className={"packtitlelarge " + BackgroundClass} >
                    <tr className={BackgroundClass}>
                        {TableObject.ColNames.map((item) => 
                            (<th style={{paddingBottom:"0em"}} className={BackgroundClass} key={"headtabledesc"}>
                                <p className={BackgroundClass + " colorWhite"} style={{marginBottom:"0.5em"}}>
                                    {item}
                                </p>
                            </th>))
                        }
                    </tr>
                </thead>
                <tbody>
                    {TableObject.Items.map((item) => (
                    <tr key={"rowtabledesc"}>
                        {item.Description.map((val) => (
                            <td key={"itemtabledesc"} className="tableText">
                                <div className="tablecontent">
                                    {returnDescription(TableObject, [val])}
                                </div>
                            </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </Table >
        </ErrorBoundary>
    )
}

export default TableDisplay;