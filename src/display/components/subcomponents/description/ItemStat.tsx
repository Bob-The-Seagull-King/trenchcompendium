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
            <div>
                <div className="totalmarginxsm">
                    <div className="colorBasicText ">{Title}</div>
                    <div className={"maxwidth bordergrey borderstyler backgroundBgBase centered-div"}>
                        <div className="maxwidth align-center size-strongtext totalmarginsml">
                            {Content}
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ItemStat;