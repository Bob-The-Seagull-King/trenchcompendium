import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { BookRule } from '../../../../classes/feature/bookrules/BookRule';

const BookRuleDisplay = (props: any) => {
    const ruleObject: BookRule = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with BookRuleDisplay.tsx</div>}>
            <div>
                <div className='abilityInternalStructure'>
                    <div>
                        {returnDescription(ruleObject, ruleObject.Description)}
                    </div>
                </div>
                {ruleObject.Sections.map((item) => (
                    <div key={item.title}>
                        <div className={'titleShape hovermouse titlebody backgrounddefault'}>{item.title || ""}</div>
                        <div className='abilityInternalStructure'>
                            {returnDescription(ruleObject, item.description)}
                            {item.content.map((valitem) => (
                                <div key={valitem.title} className='row'>
                                    <div className="verticalspacerbig"/>
                                    <div className='separator bodytext tagboxpad colordefault'>{valitem.title}</div>
                                    <div className="verticalspacerbig"/>
                                    {returnDescription(ruleObject, valitem.description)}
                                </div>
                            ))

                            }
                        </div>
                    </div>
                ))
                }
            </div>
        </ErrorBoundary>
    )
}

export default BookRuleDisplay;