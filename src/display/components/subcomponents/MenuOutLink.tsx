import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import CustomNavLink from './interactables/CustomNavLink';

const MenuOutLink = (props: any) => {
    const Title : string = props.title;
    const Link : string = props.link;

    return (
        <ErrorBoundary fallback={<div>Something went wrong with MenuDisplay.tsx</div>}>
            <CustomNavLink link={Link} runfunc={()=>window.open(Link,'_blank', 'rel=noopener noreferrer')}>
                <div className=" font-seriftext bordergrey borderstyler backgroundBgCard main-menu-item-small" >
                    {Title}
                </div>
            </CustomNavLink>
        </ErrorBoundary>
    )
}

export default MenuOutLink;