import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemStat = (props: any) => {
    const Title = props.title;
    const Content = props.value;


    // @TODO: set modified values here
    const modified = false; // if at all modified
    const modifiedPositive = false; // if modified positvely (optional)
    const modifiedNegative = false; // if modified negatively (optional)

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