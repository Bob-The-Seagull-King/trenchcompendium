import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
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
import { Equipment } from '../../../../classes/feature/equipment/Equipment';
import EquipmentDisplay from '../../../components/features/equipment/EquipmentDisplay';
import { EquipmentFactory } from '../../../../factories/features/EquipmentFactory';

const AdvancedDescriptionItemDisplay = (props: any) => {
    const description: AdvancedDescription = props.data
    const parentItem = description.Parent;

    let colour = getParentValue('Team');
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
                    <p>
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </p>
                )

            }
            case "infobox": {
                return (
                    <div className="infobox">
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </div>
                )

            }
            case "headless_table": {
                return (
                    <table className="table_headless">
                        {item.SubContent?.map((subitem) => (
                            <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                        ))}
                    </table>
                )

            }
            case "headed_table": {
                return (
                    <table className="table_headed">
                        {item.SubContent?.map((subitem) => (
                            <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                        ))}
                    </table>
                )

            }
            case "table_row": {
                return (
                    <tr className="table_row">
                        {item.SubContent?.map((subitem) => (
                            <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                        ))}
                    </tr>
                )

            }
            case "table_headrow": {
                return (
                    <tr className="table_headrow">
                        {item.SubContent?.map((subitem) => (
                            <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                        ))}
                    </tr>
                )

            }
            case "table_item": {
                return (
                    <td className="table_item">
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </td>
                )

            }
            case "table_headitem": {
                return (
                    <th className="table_headitem">
                        <span>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </th>
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
                    <div className="">
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
                    <div className="">
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
                    <div className="">
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
            case "equipment": {
                return (
                    <div className="">
                        <span>
                            {getEquipmentDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
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

    function getEquipmentDisplay(val : string) {
        const [component, setcomponent] = useState<null | Equipment>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {
                const item = await EquipmentFactory.CreateNewEquipment(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            };

            getItem();
        }, []);


        return (
            <span key={keyvar}>
                {component !== null &&
                    <EquipmentDisplay data={component} />
                }   
            </span>
        );
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AdvancedDescriptionItemDisplay.tsx</div>}>
                {returnFullItem(description)}
        </ErrorBoundary>
    )
}

export default AdvancedDescriptionItemDisplay;