import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { getTagValue, getTagSetValue} from '../../../../utility/functions'
import { ConvertContentWithGlossary } from '../../../../utility/util'
import { AdvancedDescription} from '../../../../classes/AdvancedDescription'
import { TableBody } from '../../../../classes/feature/table/tablebody'
import { TableFactory } from '../../../../factories/features/TableFactory'

// Components
import GenericDisplay from '../../../../display/components/generics/GenericDisplay'
import TableDisplay from '../../../../display/components/features/table/TableDisplay'
import GenericHover from '../../../../display/components/generics/GenericHover'
import EmptyDisplay from '../../../../display/components/generics/EmptyDisplay'
import GenericPopup from '../../../../display/components/generics/GenericPopup'
import { ObjectTag } from '../../../../classes/CompendiumItem';

const AdvancedDescriptionItemDisplay = (props: any) => {
    const description: AdvancedDescription = props.data
    const parentItem = description.Parent;

    let colour = getParentValue('Class');
    if (colour == null) { colour = "default"}

    /**
     * Takes a description and combines all tags, subcomponents,
     * and glossary items into a DOM element.
     * @param item The base description body
     * @returns Full DOM element containing the rendered description
     */
    function returnFullItem(item: AdvancedDescription) {
        switch (getTagSetValue(item.Tags, "desc_type")) {
            case "paragraph": {
                return (
                    <div className="textmaxwidth">
                        <span className="textmaxwidth">
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </div>
                )

            }
            case "bold": {
                return (
                    <span>
                        <span>
                            <b>
                                {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")} 
                            </b>
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
            case "italic": {
                return (
                    <span>
                        <span>
                            <i>
                                {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")} 
                            </i>
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                        <span>{" "}</span>
                    </span>
                )
            }
            case "default": {
                return (
                    <span>
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                        <span>{" "}</span>
                    </span>
                )
            }
            case "table": {
                return (
                    <div className="textmaxwidth">
                        <div className='addonbox'><EmptyDisplay d_colour={colour} d_name={item.DisplayData? item.DisplayData.Name : ""} d_type={"sub"} d_method={() => <TableDisplay d_colour={colour} d_type={"sub"} data={item.DisplayData} />}/></div>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                        <span>{" "}</span>
                    </div>
                )
            }
            case "gap": {
                return (
                    <div className="textmaxwidth">
                        <div><br/></div>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                        <span>{" "}</span>
                    </div>
                )
            }
            case "list": {
                return (
                    <div className="textmaxwidth">
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            <ul>
                                {item.SubContent?.map((subitem) => (
                                    <li  key="descriptionsubitem">
                                        <AdvancedDescriptionItemDisplay data={subitem} parent={parentItem}/>
                                    </li>
                                ))}
                            </ul>
                        </span>
                    </div>
                )
            }
            case "question": {
                return (
                    <span>
                        {item.DisplayData}
                    </span>
                )
            }
            default: {
                return (
                    <span>
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                                <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
        }
    }

    function getParentValue(val : string) {
        if (parentItem) {
            if (val in parentItem) {
                return parentItem[val as keyof (typeof parentItem)];
            }
        }
        return null;
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AdvancedDescriptionItemDisplay.tsx</div>}>
            <span>
                {returnFullItem(description)}
            </span>
        </ErrorBoundary>
    )
}

export default AdvancedDescriptionItemDisplay;