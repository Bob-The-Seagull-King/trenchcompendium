import '../../../../resources/styles/vendor/bootstrap.css'
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
import RulesArmouryElementDisplay from "../../rules-content/RulesArmouryElement";
import RulesAnchorLinks from "../../rules-content/RulesAnchorLinks";
import RulesHeadlineDisplay from "../../rules-content/RulesHeadlineDisplay";

const BookRuleDisplay = (props: any) => {
    const ruleObject: BookRule = props.data

    function GetContents(rules : BookRule) {
        const ContentsList : ContentsLink[] = [];

        for (let i = 0; i < rules.Sections.length; i++) {
            ContentsList.push({ name: rules.Sections[i].title, route: ""+rules.Sections[i].title})
        }

        return ( <RulesAnchorLinks title={"Contents"} listofcontents={ContentsList}/> )
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
            type: "success"
        });
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with BookRuleDisplay.tsx</div>}>
            <div className={'book-rule-wrap'}>
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
                            />

                {/* Rules Introduction / Description */}
                {/* @TODO: Is this necessary? Can the data be stored differently?*/}
                <div className={'rules-introduction'}>
                    {returnDescription(ruleObject, ruleObject.Description)}
                </div>

                { ruleObject.Sections != undefined && ruleObject.Sections?.length > 0 && (
                    <>
                        {/* Page Anchors */}
                        {ruleObject.Sections.length > 1 &&
                            GetContents(ruleObject)
                        }

                        {/* Rules Items */}
                        {ruleObject.Sections.map((item) => (
                            <div key={item.title} className={'rules-text-item'}>
                                <RulesHeadlineDisplay
                                    content={item.title}
                                    level={2}
                                />

                                {returnDescription(ruleObject, item.description)}

                                {item.content.map((valitem) => (
                                    <div key={valitem.title || ""}>
                                        <RulesHeadlineDisplay
                                            content={valitem.title}
                                            level={3}
                                        />

                                        {returnDescription(ruleObject, valitem.description)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </ErrorBoundary>
    )
}

export default BookRuleDisplay;