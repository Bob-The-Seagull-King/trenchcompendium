import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import GenericPanel from '../components/generics/GenericPanel';
import ContentPackDisplay from '../components/features/contentpack/ContentPackDisplay'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'
import { ContentPack } from '../../classes/contentpacks/contentpack'

const ToolsContentManager = (prop: any) => {
    const Manager = prop.manager;

    // States
    const [_allcontentpacks, returnstate] = useState(Manager.GetPack());
    const [_key, updateKey] = useState(0);

    /**
     * Reads a user-selected file and attempt to create
     * a content pack from that file.
     * @param uploadedFile The file to convert to a Content Pack
     */
    function readFileOnUpload(uploadedFile: File | undefined): void {
        const fileReader = new FileReader();
        fileReader.onloadend = ()=>{
           try{
                const Msg: string = Manager.FileToContentPack(fileReader.result);
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

    /**
     * Updates the page states and forces
     * a re-render of the page
     */
    function ItemRecall() {
        returnstate(Manager.GetPack())
        updateKey(_key+1)
    }

    // Return result -----------------------------
    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with ToolsContentManager.tsx</div>}>
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
                       
            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 col-12">
                    
                    <div className='row'>
                        <div className='col'>
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 justify-content-center filterbox">
                            <label htmlFor="pack-upload" className="basestructure generalbuttonbox borderstyler subborderdefault hovermouse">
                                <FontAwesomeIcon icon={faFileImport} className="pageaccestext"/>
                                <h1 className="pageaccestext">
                                    UPLOAD CONTENT PACK
                                </h1>
                            </label>
                            <div className="addonbox"/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <br/>
                        </div>
                    </div>
                    <div className="tagboxpad softpad">
                        <div className='row row-cols-1 subborderstyler subborderdefault '>
                                {_allcontentpacks.length < 1 &&
                                    <div className="col p-0" key={"packdisplaynone"}>
                                        <div className='filterbox contentpackbasecontainer contentpackcontainer subborderstyler subborderdefault' style={{justifyContent:"center",alignItems:"center"}}>
                                            <h1 className="subtletext tagboxpad" >No Packages Selected</h1>
                                        </div>
                                    </div>
                                }
                                {_allcontentpacks.map((item: ContentPack) => (
                                    <div className="col p-0" key={"packdisplay"+item.ID}>
                                        <ContentPackDisplay data={item} parent={Manager} statefunction={ItemRecall}/>
                                    </div>
                                ))}
                        </div>  
                    </div>
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsContentManager