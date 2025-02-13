import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React, { useRef, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Components
import GenericPanel from '../../../components/generics/GenericPanel';
import ContentPackDisplay from '../../../components/features/contentpack/ContentPackDisplay'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport, faPerson } from '@fortawesome/free-solid-svg-icons'
import { ContentPack } from '../../../../classes/contentpacks/contentpack'
import { Item } from '../../../../classes/saveitems/item';
import { ItemManager } from '../../../../classes/saveitems/itemmanager';
import SaveItemDisplay from './SaveItemDisplay';

const SaveItemListDisplay = (prop: any) => {
    const Manager : ItemManager = prop.manager;
    const UpdaterMethod = prop.updater;

    let NewItemTitle = "";
    const inputRef = useRef<HTMLInputElement>(null);

    const [_allItems, returnstate] = useState(Manager.GetPack());
    const [_key, updateKey] = useState(0);
    // States

    
    /**
     * Activates a toast error message with
     * a provided message
     * @param text The warning to be displayed
     */
    function runToast(text: string) 
    {
        toast.error(text, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

    function NewItem() {
        const Result = Manager.NewItem(NewItemTitle);
        if (Result != "") {
            runToast(Result);
        } else {
            UpdaterMethod(Manager.GetItemByName(NewItemTitle))
        }
        ItemRecall();
        if (inputRef.current != null) {
            inputRef.current.value = "";
        }
        
    }

    function readFileOnUpload(uploadedFile: File | undefined): void {
        const fileReader = new FileReader();
        fileReader.onloadend = ()=>{
           try{
                const Msg: string = Manager.FileToContentPack((fileReader.result)? fileReader.result.toString() : "");
                if (Msg != "") {
                    runToast("Upload Error: " + Msg);
                }
                ItemRecall();
           }catch(e){
                console.log("**Not valid JSON file!**");
            }
        }
        if( uploadedFile!== undefined)
           fileReader.readAsText(uploadedFile);
    }

    function ItemRecall() {
        returnstate(Manager.GetPack())
        updateKey(_key+1)
    }

    function updateTitle(value: string) {
        NewItemTitle = value;
    }

    return(
        <div className="container textmaxwidth">
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" 
            />
            <input id="pack-upload" style={{display:"none"}} type="file" accept=".json" onChange={(e)=>readFileOnUpload(e.target.files? e.target.files[0] : undefined)} />

            <div className="row justify-content-center textmaxwidth">
                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 col-12">

                    <div className="row justify-content-center">
                        <div className="col">
                            <div className="" style={{paddingTop:"1em"}}>
                                <div className="row justify-content-center filterbox">
                                    <div className="col-md-6 col-12">
                                        <InputGroup className="tagboxpad" style={{height:"4em"}}>
                                            <Form.Control ref={inputRef} className="tallcentertext" onChange={e => updateTitle(e.target.value)} aria-label="Text input" defaultValue={NewItemTitle} placeholder="Item Name"/>
                                        </InputGroup>
                                    </div>
                                    <div className="col-md-2 col-6">
                                        <div className="basestructure generalbuttonbox" style={{width:"100%",alignItems:"center",height:"4em"}}>
                                            <div style={{display:"flex",width:"fit-content",alignItems:"flex-end"}} onClick={() => NewItem()} className="hovermouse ">
                                                <FontAwesomeIcon icon={faPerson} className="pageaccestext"/>
                                                <h1 className="pageaccestext" style={{whiteSpace:"nowrap"}}>
                                                    Create
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 col-6">
                                    <div className="basestructure generalbuttonbox" style={{width:"100%",alignItems:"center",height:"4em"}}>
                                            
                                            <label htmlFor="pack-upload" style={{display:"flex",width:"fit-content",alignItems:"flex-end"}}>
                                                <FontAwesomeIcon icon={faFileImport} className="pageaccestext"/>
                                                <h1 className="pageaccestext">
                                                    Upload
                                                </h1>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col'>
                            <br/>
                        </div>
                    </div>

                    <div style={{padding:"0.5em"}}>
                        <div className='row row-cols-1 subborderstyler subborderdefault '>
                                {_allItems.length < 1 &&
                                    <div className="col p-0" key={"packdisplaynone"}>
                                        <div className='filterbox contentpackbasecontainer contentpackcontainer subborderstyler subborderdefault' style={{justifyContent:"center",alignItems:"center"}}>
                                            <h1 className="subtletext tagboxpad" >No Items Available</h1>
                                        </div>
                                    </div>
                                }
                                {_allItems.map((item: Item) => (
                                    <div className="col p-0" key={"packdisplay"+item.ID}>
                                        <SaveItemDisplay  data={item} parent={Manager} statefunction={ItemRecall} updater={UpdaterMethod}/>
                                    </div>
                                ))}
                        </div>  
                    </div>
                </div>
            </div>

        </div>
    )
    // -------------------------------------------
}

export default SaveItemListDisplay