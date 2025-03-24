import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { BookRule } from '../../../../classes/feature/bookrules/BookRule';
import ContentsComponentAnchor, { ContentsLink } from '../../subcomponents/informationpanel/ContentsComponentAnchor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookRuleDisplay = (props: any) => {
    console.log(props.data)
    const ruleObject: BookRule = props.data

    function GetContents(rules : BookRule) {
        const ContentsList : ContentsLink[] = [];

        for (let i = 0; i < rules.Sections.length; i++) {
            ContentsList.push({ name: rules.Sections[i].title, route: ""+rules.Sections[i].title})
        }

        return ( <ContentsComponentAnchor title={"Contents"} showheader={true} listofcontents={ContentsList}/> )
    }

    function runToast() 
    {
        navigator.clipboard.writeText(window.location.href)

        toast.error("Link Copied!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        type: "success"
        });
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with BookRuleDisplay.tsx</div>}>
            <div>
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
                <div>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>
                {ruleObject.Sections.length > 1 &&
                    <div>
                        <div className="verticalspacermed"/>
                        {GetContents(ruleObject)}
                    </div>
                }
                {ruleObject.Sections.map((item) => (
                    <div key={item.title}>
                        <div id={item.title} className="verticalspacermed"/>
                        <div className={'size-subtitle colorBasicText font-seriftext'}>
                            <div className='centered-div width-content'>
                                {item.title || ""}
                                <div className='horizontalspacermed hovermouse'>
                                    <FontAwesomeIcon icon={faLink} onClick={() => (
                                        runToast()
                                        )}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            {returnDescription(ruleObject, item.description)}
                            <div className="verticalspacermed"/>
                            {item.content.map((valitem) => (
                                <div key={valitem.title}>
                                    <div className='size-strongtext colorBasicText'>{valitem.title}</div>
                                    {returnDescription(ruleObject, valitem.description)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
                }
            </div>
        </ErrorBoundary>
    )
}

export default BookRuleDisplay;