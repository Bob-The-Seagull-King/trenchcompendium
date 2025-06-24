import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { useLocation, useNavigate } from 'react-router-dom';


const ScrollToTop = () => {
    const {pathname} = useLocation();
    
    useEffect(() => {
        window.scrollTo(0,0);
    }, [pathname])

    return (
        <div/>        
      );
}

export default ScrollToTop

