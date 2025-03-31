import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

const MenuOutLink = (props: any) => {
    const Title : string = props.title;
    const Link : string = props.link;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div className="hovermouse font-seriftext bordergrey borderstyler backgroundBgCard main-menu-item-small" onClick={()=>window.open(Link,'_blank', 'rel=noopener noreferrer')}>
                {Title}
            </div>
        </ErrorBoundary>
    )
}

export default MenuOutLink;