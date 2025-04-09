import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';
import CustomNavLink from './interactables/CustomNavLink';
import SynodImage from "../../../utility/SynodImage";


interface MenuComponentProps {
    Title: string;
    Route: string;
    bgImageID?: number; // optional bg image
}

const MenuComponent: React.FC<MenuComponentProps> = ({ Title, Route, bgImageID = 0 }) => {

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
            <CustomNavLink link={Route} runfunc={NavigateHome} classes={'home-link-primary'}>
                <span className={'title'}>
                    {Title}
                </span>

                {/* only if bgImageID is defined*/}
                {bgImageID > 0 &&
                    <SynodImage
                        imageId={bgImageID}
                        className={''}
                        size={'large'}
                    />
                }
            </CustomNavLink>
        </ErrorBoundary>
    )
}

export default MenuComponent;