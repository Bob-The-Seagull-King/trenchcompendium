import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Components
import GenericPanel from '../../../components/generics/GenericPanel';
import ContentPackDisplay from '../../../components/features/contentpack/ContentPackDisplay'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faDownload, faEye, faSquareCaretUp, faSquareCaretDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Item } from '../../../../classes/saveitems/item';
import { ItemManager } from '../../../../classes/saveitems/itemmanager';
import { Button } from 'react-bootstrap';

const SaveItemDisplay = (prop: any) => {
    const Manager : ItemManager = prop.parent;
    const ItemItem: Item = prop.data;
    const updateHost = prop.statefunction;
    const UpdateFunction = prop.updater;
    
    const [stateWidth, setWidth] = useState(window.innerWidth);
    const ref = useRef<HTMLDivElement>(null);

    function ViewContentPack() {
        UpdateFunction(ItemItem, true)
    }
    
    // Move a unit up or down in the list
    function SwapUnits(direction : boolean) {
        Manager.ShufflePack(ItemItem, direction);
        updateHost();
    }

    function removeContentPack() {
        Manager.DeletePack(ItemItem);
        updateHost();
    }

    function copyContentPack() {
        Manager.DuplicateItem(ItemItem);
        updateHost();
    }

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(ItemItem.ConvertToInterface(), null, 4)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = ItemItem.Title + ".json";
    
        link.click();
      };
      

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
        
        <ErrorBoundary fallback={<div>Something went wrong with SaveItemDisplay.tsx</div>}>
            <div className='' ref={ref} >
                {stateWidth > 700 &&
                    <div className="filterbox contentpackbasecontainer contentpackcontainer subborderstyler subborderdefault" >
                        <span className="contentsubnamecontainer">
                            <span/>
                            <h1 className="colordefault packtitlebase packtitlelarge">
                                {ItemItem.Title}
                            </h1>
                            <span/>
                            <span className="packvrbox">
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => ViewContentPack()}>
                                <FontAwesomeIcon icon={faEye} className="contentpacklabel no-margin" />
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => copyContentPack()}>
                                <FontAwesomeIcon icon={faClone} className="contentpacklabel no-margin" />
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => exportData()}>
                                <FontAwesomeIcon icon={faDownload} className="contentpacklabel no-margin" />
                            </Button>
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() =>  SwapUnits(true)}>
                                <FontAwesomeIcon icon={faSquareCaretUp} className="contentpacklabel no-margin" />
                            </Button>
                            <Button className="no-padding" variant="" onClick={() => SwapUnits(false)}>
                                <FontAwesomeIcon icon={faSquareCaretDown} className="contentpacklabel no-margin" />
                            </Button>
                            </span>
                        </span>
                        <span className="packvrbox">
                            <div className="vr packvr small-side-margin"></div>
                            <Button className="no-padding" variant="" onClick={() => removeContentPack()}>
                                <FontAwesomeIcon icon={faTrash} className="colorred contentpacklabel no-margin" />
                            </Button>
                        </span>
                    </div>
                }
                {stateWidth <= 700 &&
                    <div className="filterbox contentpackbasecontainer subborderstyler subborderdefault" >
                        
                        <div className="row textmaxwidth">
                                <h1 className="colordefault packtitlebase packtitlelarge widecentertext" >
                                    {ItemItem.Title}
                                </h1>
                        </div>
                        <div className="row">
                            <div className="col-12 smallcontentpackrow flex-with-space">
                                <span/>
                                    <Button className="no-padding" variant="" onClick={() => ViewContentPack()}>
                                        <FontAwesomeIcon icon={faEye} className="contentpacklabel no-margin" />
                                    </Button>
                                    <span className="packvrbox">
                                        <div className="vr packvr small-side-margin"/>
                                    </span>
                                    <Button className="no-padding" variant="" onClick={() => copyContentPack()}>
                                        <FontAwesomeIcon icon={faClone} className="contentpacklabel no-margin" />
                                    </Button>
                                    <span className="packvrbox">
                                        <div className="vr packvr small-side-margin"/>
                                    </span>
                                    <Button className="no-padding" variant="" onClick={() => exportData()}>
                                        <FontAwesomeIcon icon={faDownload} className="contentpacklabel no-margin" />
                                    </Button>
                                    <span className="packvrbox">
                                        <div className="vr packvr small-side-margin"/>
                                    </span>
                                    <Button className="no-padding" variant="" onClick={() =>  SwapUnits(true)}>
                                        <FontAwesomeIcon icon={faSquareCaretUp} className="contentpacklabel no-margin" />
                                    </Button>
                                    <Button className="no-padding" variant="" onClick={() => SwapUnits(false)}>
                                        <FontAwesomeIcon icon={faSquareCaretDown} className="contentpacklabel no-margin" />
                                    </Button>
                                    <span className="packvrbox">
                                        <div className="vr packvr small-side-margin"/>
                                    </span>
                                    <Button className="no-padding" variant="" onClick={() => removeContentPack()}>
                                        <FontAwesomeIcon icon={faTrash} className="colorred contentpacklabel no-margin" />
                                    </Button>
                                <span/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default SaveItemDisplay