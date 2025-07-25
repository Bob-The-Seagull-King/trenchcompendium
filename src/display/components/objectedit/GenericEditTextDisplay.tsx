import '../../../resources/styles/vendor/bootstrap.css'
import React, { useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { useGlobalState } from '../../../utility/globalstate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { EditTextType, EditTextDataDex } from './static/StaticEditText';

const GenericEditListDisplay = (props: any) => {
    const Manager = props.manager;
    const Item = props.item;
    const SubItem = props.subitem;
    const EditStaticType : EditTextType = EditTextDataDex[props.statictype]
    const UpdateFunction = props.updater;

    const refValue = EditStaticType.returnBaseValue(Item, SubItem);
    let textValue = refValue;


    const [showTextEdit, setShowTextEdit] = useState(false);
    const handleCloseTextEdit = () => setShowTextEdit(false); 
    const handleShowTextEdit = () => setShowTextEdit(true);

    const inputRefTextEdit = useRef<HTMLInputElement>(null);

    function updateText(value: string) {
        textValue = value;
    }

    function updateModel() {
        UpdateFunction(Item)
    }

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with GenericEditTextDisplay.tsx</div>}>
            <span>
            { EditStaticType.returnButton(Manager, Item, handleShowTextEdit, SubItem, textValue) }
            </span>
            
            <Modal onEnterKeyDown={() => handleCloseTextEdit()} show={showTextEdit}  contentClassName="basestructure abilityStructure borderstyler " dialogClassName="" onHide={handleCloseTextEdit} keyboard={true}  centered>
                
                <h1 className={'    '}>
                    {EditStaticType.title}
                </h1>
                <Modal.Body >
                    <div className="row  ">
                        <div className="col-10">
                            <InputGroup className="tagboxpad" >
                                <Form.Control size="lg" className="no-margins" ref={inputRefTextEdit} style={{fontSize:"1.5em", height:"0.5em", textAlign:"center"}} onChange={e => updateText(e.target.value)} aria-label="Text input" defaultValue={refValue} placeholder=""/>
                            </InputGroup>
                        </div>
                        <div className="col-2">
                            <FontAwesomeIcon icon={faSave} onClick={() => EditStaticType.updateText(Manager, Item, textValue, handleCloseTextEdit, updateModel, SubItem )} className="pageaccestextsmall " style={{fontSize:"3em"}}/>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        
        </ErrorBoundary>
    )
}

export default GenericEditListDisplay;