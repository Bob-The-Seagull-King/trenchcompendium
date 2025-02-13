import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ErrorBoundary } from "react-error-boundary";

// Resources
import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'

// Classes
import { ContentPack } from '../../../../classes/contentpacks/contentpack'
import { useGlobalState } from '../../../../utility/globalstate'
import { makestringpresentable } from '../../../../utility/functions'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faBookOpen, faSquareCaretUp, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUnlock } from '@fortawesome/free-solid-svg-icons'
import { returnDescription } from '../../../../utility/util';

const ContentPackDisplay = (props: any) => {
    const PackItem: ContentPack = props.data;
    const parentView = props.parent;
    const updateHost = props.statefunction;

    // States
    const [theme] = useGlobalState('theme');
    const [stateWidth, setWidth] = useState(window.innerWidth);
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const ref = useRef<HTMLDivElement>(null);

    /**
     * Delete the Content Pack from local storage
     */
    function removeContentPack() {
        parentView.DeletePack(PackItem);
        updateHost();
    }

    /**
     * Turn a Content Pack on/off
     */
    function switchContentPackState() {
        PackItem.IsActive = !PackItem.IsActive;
        parentView.SetStorage();
        updateHost();
    }

    // Move a unit up or down in the list
    function SwapUnits(direction : boolean) {
        parentView.ShufflePack(PackItem, direction);
        updateHost();
    }
    
    /**
     * Detect the current size of the screen to adjust
     * presentation mode
     */
    useEffect(() => {
        const setContentPackWidth = () => {
            if(ref.current) {
                setWidth(ref.current.clientWidth);
            }
        }
        window.addEventListener("load", setContentPackWidth, false);
        window.addEventListener("resize", setContentPackWidth, false);
        setContentPackWidth();
    }, [stateWidth])

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ContentPackDisplay.tsx</div>}>
            <div className='' ref={ref}>
                {stateWidth > 700 &&
                    <div className="filterbox contentpackbasecontainer subborderstyler subborderdefault" >
                        <span className="packvrbox">
                            <Button className="no-padding" variant="" onClick={() => handleShow()}>
                                <FontAwesomeIcon icon={faBookOpen} className="colordefault contentpacklabel no-margin"/>
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => switchContentPackState()}>
                                {PackItem.IsActive &&
                                    <FontAwesomeIcon icon={faUnlock} className="colorgreen contentpacklabel no-margin"/>
                                }
                                {!PackItem.IsActive &&
                                    <FontAwesomeIcon icon={faLock} className="colorred contentpacklabel no-margin"/>
                                }
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                        </span>
                        <span className="packvrbox">
                            <Button className="no-padding" variant="" onClick={() => SwapUnits(true)}>
                                <FontAwesomeIcon icon={faSquareCaretUp} className="colordefault contentpacklabel no-margin"/>
                            </Button>
                            <Button className="no-padding" variant="" onClick={() => SwapUnits(false)}>
                                <FontAwesomeIcon icon={faSquareCaretDown} className="colordefault contentpacklabel no-margin"/>
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                        </span>
                        <span className="contentsubnamecontainer">
                            <span/>
                            <h1 className="colordefault packtitlebase packtitlelarge">
                                {PackItem.Name}
                            </h1>
                            <div className="vr packvr small-side-margin"></div>
                            <h3 className="colordefault packtitlebase packtitlesmall">
                                {PackItem.Author}
                            </h3>
                            <span/>
                        </span>
                        <span className="packvrbox">
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => removeContentPack()}>
                                <FontAwesomeIcon icon={faTrash} className="colorred contentpacklabel no-margin"/>
                            </Button>
                        </span>
                    </div>
                }
                {stateWidth <= 700 &&
                    <div className="filterbox contentpackbasecontainer subborderstyler subborderdefault" >
                        
                        <div className="row textmaxwidth" >
                            <div className="col-12 smallcontentpackrow flex-with-space">
                                <span/>
                                <h1 className="colordefault packtitlebase packtitlelarge fit-to-content">
                                    {PackItem.Name}
                                </h1>
                                <span/>
                            </div>
                        </div>
                        <div className="row textmaxwidth">
                            <div className="col-12 smallcontentpackrow flex-with-space">
                                <span/>
                                <h3 className="colordefault packtitlebase packtitlesmall fit-to-content">
                                    {PackItem.Author}
                                </h3>
                                <span/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 smallcontentpackrow flex-with-space" >
                                <span/>
                                <Button className="no-padding" variant="" onClick={() => handleShow()}>
                                    <FontAwesomeIcon icon={faBookOpen} className="colordefault contentpacklabel no-margin"/>
                                </Button>
                                <div className="vr packvr small-side-margin"></div>
                                <Button className="no-padding" variant="" onClick={() => switchContentPackState()}>
                                    {PackItem.IsActive &&
                                        <FontAwesomeIcon icon={faUnlock} className="colorgreen contentpacklabel no-margin"/>
                                    }
                                    {!PackItem.IsActive &&
                                        <FontAwesomeIcon icon={faLock} className="colorred contentpacklabel no-margin"/>
                                    }
                                </Button>
                                <div className="vr packvr small-side-margin"></div>
                                <Button className="no-padding" variant="" onClick={() => SwapUnits(true)}>
                                    <FontAwesomeIcon icon={faSquareCaretUp} className="colordefault contentpacklabel no-margin"/>
                                </Button>
                                <Button className="no-padding" variant="" onClick={() => SwapUnits(false)}>
                                    <FontAwesomeIcon icon={faSquareCaretDown} className="colordefault contentpacklabel no-margin"/>
                                </Button>
                                <div className="vr packvr small-side-margin"></div>
                                <Button className="no-padding" variant="" onClick={() => removeContentPack()}>
                                    <FontAwesomeIcon icon={faTrash} className="colorred contentpacklabel no-margin"/>
                                </Button>
                                <span/>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <Modal data-theme={theme}  size="lg" show={show}  contentClassName="overcomeBackground" dialogClassName="" onHide={handleClose} keyboard={true}  centered>    
                
                <Modal.Body >
                <div className={'basestructure abilityStructure subborderstyler borderdefault'}>
                    <h1 className={'titleShape titlebody backgrounddefault'}>
                    {PackItem.Name}
                        
                        <div className="row float-end">
                            <div className='col-12 float-end'>
                                <Button className="no-padding" variant="" onClick={() => handleClose()}>
                                    <FontAwesomeIcon icon={faCircleXmark} className="colorWhite contentpacklabel no-margin"/>
                                </Button>
                            </div>
                        </div>
                    </h1>
                    
                    <div className='abilityInternalStructure'>
                        <div className="row overflow-auto flex-grow-1 m-0 p-0">
                            <div className="height70">
                                <div className="separator" style={{marginTop:"0em"}}><h5>By {PackItem.Author}</h5></div>
                                <div className="col-12 bodytext">
                                    {returnDescription(PackItem, PackItem.Description)}
                                </div>
                                <div className="separator" style={{marginTop:"0em"}}><h5>Content</h5></div>
                                <div className="filterbox">
                                    {PackItem.Tags.map((item: any) => (
                                        <div className=" quartermargin borderstyler basestructure filterbuttonitem bordergrey backgroundgrey" key={"packdisplay"}>
                                            {makestringpresentable(item.name)} - {item.count.toString()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </ErrorBoundary>
    )
}

export default ContentPackDisplay;