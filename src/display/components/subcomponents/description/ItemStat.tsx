import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemStat = (props: any) => {
    const Title = props.title;
    const Content = props.value;
    const SizeRatio = (props.ratio != undefined? props.ratio : "square")

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ItemStat.tsx</div>}>
            <div className="fighter-card-stat">
                <div className="stat-label">{Title}</div>
                <div className="stat-value">
                    {Content}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ItemStat;