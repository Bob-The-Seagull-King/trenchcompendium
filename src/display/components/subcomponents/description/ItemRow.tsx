import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemRow = (props: any) => {
    const Title = props.title;
    const Content = props.value;
    const ShowBorder = (props.s_border != undefined? props.s_border : true)

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ItemStat.tsx</div>}>
            <div className="itemrow_container">
                <div className={" itemrow_box " + (ShowBorder == true? " borderthin borderstyler bordergrey" : "")}>
                    <div className="totalmarginsml centered-div">
                        <div className="colorBasicText wordbreak">{Title}</div>
                    </div>
                </div>
                <div className={" itemrow_box " + (ShowBorder? " borderthin borderstyler bordergrey" : "")}>
                    <div className="totalmarginsml maxwidth">
                        <div className="colorBasicText">{Content()}</div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ItemRow;