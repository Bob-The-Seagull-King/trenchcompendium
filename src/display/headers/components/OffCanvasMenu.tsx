import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import RulesMenuBody from "../../components/features/rules-content/RulesMenuBody";
import logo from "../../../resources/images/trench-companion-logo-white-v2.png";

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

const OffcanvasMenu: React.FC<IControllerProp> = (prop) => {

    const handleClose = prop.closeFunc;
    const show = prop.showState

    // State
    // Navigation
    const navigate = useNavigate(); 
    
    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateHome() {
        navigate('/');
    }

    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with OffcanvasMenu.tsx</div>}>
            <Offcanvas className="offcanvas-main-menu" show={show} onHide={handleClose} responsive={prop.responseshow}>
                <Offcanvas.Header className="">
                    <Offcanvas.Title className="">
                        <div className={'logo-wrap'}>
                            <img src={logo} alt="Trench Companion Logo" className={'logo'}
                                 onClick={() => NavigateHome()}
                            />
                        </div>

                        <div className="offcanvas-close" onClick={handleClose}>
                        <FontAwesomeIcon icon={faClose} className=""/>
                        </div>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="offc">
                    {/*<MenuBody controller={prop.controller}/>*/}
                   <RulesMenuBody controller={prop.controller}/>
                </Offcanvas.Body>
            </Offcanvas>
        </ErrorBoundary>
        
      );
}

export default OffcanvasMenu

