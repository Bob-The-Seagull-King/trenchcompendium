import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemRow = (props: any) => {
    const Title = props.title;
    const Content = props.value;

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ItemStat.tsx</div>}>
            <div className="itemrow_container">
                <div className="borderstyler bordergrey borderthin itemrow_box">
                    <div className="totalmarginsml">
                        <div className="colorBasicText">{Title}</div>
                    </div>
                </div>
                <div className="borderstyler bordergrey borderthin itemrow_box">
                    <div className="totalmarginsml">
                        <div className="colorBasicText">{Content()}</div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ItemRow;