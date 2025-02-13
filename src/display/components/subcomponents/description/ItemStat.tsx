import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const ItemStat = (props: any) => {
    const Title = props.title;
    const Content = props.value;

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ItemStat.tsx</div>}>
            <div className="col">
                <div className="colorgrey stattitle">{Title}</div>
                <div className="statbody">{Content}</div>
                <div className="verticalspacerbig"/>
            </div>
        </ErrorBoundary>
    )
}

export default ItemStat;