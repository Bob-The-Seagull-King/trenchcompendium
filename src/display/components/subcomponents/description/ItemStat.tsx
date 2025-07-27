import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemStat = (props: any) => {
    const Title = props.title;
    const Content = props.value;
    const BaseVal = props.base;
    const RawVal = props.raw;

    let modified = false;
    let modifiedPositive = false;
    let modifiedNegative = false;
    if (BaseVal == null || BaseVal == undefined) {
        modified = true;
    } else {
        modified = (BaseVal != RawVal)
    }

    if (modified) {
        modifiedNegative = BaseVal > RawVal
        modifiedPositive = RawVal > BaseVal
    }

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ItemStat.tsx</div>}>
            <div className={`fighter-card-stat
                ${modified ? 'modified' : ''}
                ${modifiedPositive ? 'modified-positive' : ''}
                ${modifiedNegative ? 'modified-negative' : ''}
              `}
            >
                <div className="stat-label">{Title}</div>
                <div className="stat-value">
                    {Content}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ItemStat;