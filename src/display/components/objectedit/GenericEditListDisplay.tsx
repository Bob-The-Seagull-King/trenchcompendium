import '../../../resources/styles/vendor/bootstrap.css'
import React, { useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { useGlobalState } from '../../../utility/globalstate'

import { EditListType, EditListDataDex } from './static/StaticEditList';

const GenericEditListDisplay = (props: any) => {
    const Manager = props.manager;
    const Item = props.item;
    const SubItem = props.subitem;
    const EditStaticType : EditListType = EditListDataDex[props.statictype]
    const UpdateFunction = props.updater;

    const refValue = EditStaticType.returnBaseValue(Item, SubItem);

    function updateModel() {
        UpdateFunction(Item)
    }

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with GenericEditListDisplay.tsx</div>}>
            <div className={"col-md-" + EditStaticType.smallwidth + " col-" + EditStaticType.widewidth} >
                <InputGroup className={"tagboxpad"}  style={{height:"100%"}}>
                    <Form.Select className=" borderstyler tallcentertext" defaultValue={EditStaticType.baseValue(Manager, Item)} aria-label="Default select example" onChange={e => { EditStaticType.updateValue(Manager, Item, e.target.value, updateModel, SubItem)} } >
                            {
                                EditStaticType.returnOptions(Manager, Item, SubItem)
                            }
                    </Form.Select>
                </InputGroup>
            </div>
        </ErrorBoundary>
    )
}

export default GenericEditListDisplay;