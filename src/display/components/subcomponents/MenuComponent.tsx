import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';

const MenuComponent = (props: any) => {
    const Title : string = props.title;
    const Route : string = props.route;

    // Navigation
    const navigate = useNavigate(); 

    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome() {
        navigate('/' + Route, {state: Date.now().toString()});
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <div className="hovermouse font-seriftext bordergrey borderstyler backgroundBgCard main-menu-item-big" onClick={()=>NavigateHome()}>
                {Title}
            </div>
        </ErrorBoundary>
    )
}

export default MenuComponent;