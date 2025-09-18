import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from 'react-router-dom';

// Classes
import { getTagValue, getTagSetValue} from '../../../../utility/functions'
import { ConvertContentWithGlossary } from '../../../../utility/util'
import { AdvancedDescription} from '../../../../classes/AdvancedDescription'
import { TableBody } from '../../../../classes/feature/table/tablebody'
import { TableFactory } from '../../../../factories/features/TableFactory'
import { StaticContextObject } from '../../../../classes/contextevent/staticcontextobject'

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
import { Model } from '../../../../classes/feature/model/Model';
import { ModelFactory } from '../../../../factories/features/ModelFactory';
import ModelDisplay from '../../../components/features/model/ModelDisplay';
import RulesEquipmentEntry from "../../rules-content/RulesEquipmentEntry";
import RulesEquipmentMain from '../../../components/rules-content/RulesEquipmentMain';
import RulesEquipmentStats from '../../../components/rules-content/RulesEquipmentStats';
import RulesOverlay from '../../../components/rules-content/RulesOverlay';
import { useGlobalState } from '../../../../utility/globalstate';
import CustomNavLink from '../interactables/CustomNavLink';
import { Skill } from '../../../../classes/feature/ability/Skill';
import SkillDisplay from '../../../components/features/skill/SkillDisplay';
import RulesBannerText from '../../../components/rules-content/RulesBannerText';
import RulesModelDisplay from "../../rules-content/RulesModelDisplay";
import { GloriousDeed } from '../../../../classes/feature/scenario/GloriousDeed';
import GloriousDeedDisplay from '../../../components/features/scenario/GloriousDeedDisplay';
import RulesGloriousDeed from '../../../components/rules-content/RulesGloriousDeed';

const AdvancedDescriptionItemDisplay = (props: any) => {
    const description: AdvancedDescription = props.data
    const parentItem = description.Parent;
    
    const [loreshow] = useGlobalState('loreshow');

    let colour = getParentValue('Team');
    if (colour == null) { colour = "default"}
    
    const navigate = useNavigate();

    function NavigateOut(url: string) {
        navigate(url, {state: Date.now().toString()});
    }

    /**
     * Takes a description and combines all tags, subcomponents,
     * and glossary items into a DOM element.
     * @param item The base description body
     * @returns Full DOM element containing the rendered description
     */
    function returnFullItem(item: AdvancedDescription) {
        if ((getTagSetValue(item.Tags, "lore") == true) && (loreshow == 'false')) {
            return <></>
        }
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
            case "subheader": {
                return (
                    <p>
                        <h2>
                            {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")}
                        </h2>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </p>
                )

            }
            case "break": {
                return (
                    <p>
                        <hr/>
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
                    <table className="table_headed table_headed-highlight">
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
            case "table_item_wrap": {
                return (
                    <td className="table_item text-nowrap">
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
                    <th>
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
            case "glorious_deed": {
                return (
                    <div className="">
                        <span>
                            {getGloriousDeedDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </div>
                )
            }
            case "equipmentslim": {
                return (
                    <span>
                        <span>
                            {getEquipmentSlimDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
            case "skillslim": {
                return (
                    <span>
                        <span>
                            {getSkillSlimDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
            case "model": {
                return (
                    <div className="">
                        <span>
                            {getModelDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </div>
                )
            }
            case "modelslim": {
                return (
                    <span className="">
                        <span>
                            {getModelSlimDisplay(item.Content?.toString() || "")}
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
            case "link": {
                return (
                    <span>
                        <span>
                            <CustomNavLink
                                classes={'font-normal'}
                                external={
                                    (getTagSetValue(item.Tags, "external") == true)? true : false
                                }
                                link={getTagSetValue(item.Tags, "url")}
                                runfunc={() => {
                                    if (getTagSetValue(item.Tags, "external")) {
                                        const w = window.open(getTagSetValue(item.Tags, "url"), '_blank');
                                        if (w) {
                                            w.focus();
                                        }
                                    } else {
                                        NavigateOut(getTagSetValue(item.Tags, "url"))
                                    }
                                }}>
                                {ConvertContentWithGlossary((item.Glossary), item.Content?.toString() || "")} 
                            </CustomNavLink>
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
                )
            }
            case "rulesbanner": {
                return (
                    <span>
                        <span>
                            <RulesBannerText
                                link={getTagSetValue(item.Tags, "url")}
                                title={item.Content?.toString() || "" }
                                type={'inline'} />
                        </span>
                        <span>
                            {item.SubContent?.map((subitem) => (
                               <AdvancedDescriptionItemDisplay key="descriptionsubitem" data={subitem} parent={parentItem}/>
                            ))}
                        </span>
                    </span>
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

    function getGloriousDeedDisplay(val : string) {
        
        const [component, setcomponent] = useState<null | GloriousDeed>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {                
                const EquipmentModule = await import("../../../../factories/features/GloriousDeedFactory");
                const item = await EquipmentModule.GloriousDeedFactory.CreateNewGloriousDeed(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay-getEquipmentDisplay'} key={keyvar}>
                {component !== null &&
                    <RulesGloriousDeed
                                data={component}
                            />
                
                }
            </span>
        );
    }

    function getEquipmentDisplay(val : string) {
        
        const [component, setcomponent] = useState<null | Equipment>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {                
                const EquipmentModule = await import("../../../../factories/features/EquipmentFactory");
                const item = await EquipmentModule.EquipmentFactory.CreateNewEquipment(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay-getEquipmentDisplay'} key={keyvar}>
                {component !== null &&
                    
                    <RulesEquipmentEntry
                    equipment={component}
                />
                }
            </span>
        );
    }
    
    function getEquipmentSlimDisplay(val : string) {
        
        const [component, setcomponent] = useState<null | Equipment>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {                
                const EquipmentModule = await import("../../../../factories/features/EquipmentFactory");
                const item = await EquipmentModule.EquipmentFactory.CreateNewEquipment(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay-getEquipmentDisplay'} key={keyvar}>
                {component !== null &&
                    <>
                        <RulesOverlay
                            titlename={component.Name}
                            d_method={() =>
                                
                                <div className={'rules-equipment-main'}>                    
                                    {/* Stats */}
                                    <RulesEquipmentStats
                                        facrelObject={undefined}
                                        baseobject={component}
                                    />
                                    <RulesEquipmentMain data={component}/>
                                </div>
                                }/>
                </>
                }
            </span>
        );
    }
    
    function getSkillSlimDisplay(val : string) {
        
        const [component, setcomponent] = useState<null | Skill>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {                
                const SkillModile = await import("../../../../factories/features/SkillFactory");
                const item = await SkillModile.SkillFactory.CreateNewSkill(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay-getEquipmentDisplay'} key={keyvar}>
                {component !== null &&
                    <>
                        <RulesOverlay
                            titlename={component.Name}
                            d_method={() =>
                                
                                <div className={'skill-description'}>
                                    <SkillDisplay data={component}/>
                                </div>
                                }/>
                </>
                }
            </span>
        );
    }

    function getModelDisplay(val : string) {
        const [component, setcomponent] = useState<null | Model>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {
                
                const ModelModule = await import("../../../../factories/features/ModelFactory");
                const item = await ModelModule.ModelFactory.CreateNewModel(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay'} key={keyvar}>
                {component !== null &&
                    <ModelDisplay data={component} />
                }
            </span>
        );
    }

    function getModelSlimDisplay(val : string) {
        const [component, setcomponent] = useState<null | Model>(null);
        const [keyvar, setkeyvar] = useState(0);

        useEffect(() => {
            async function getItem() {
                
                const ModelModule = await import("../../../../factories/features/ModelFactory");
                const item = await ModelModule.ModelFactory.CreateNewModel(val, null)
                setcomponent(item);
                setkeyvar(keyvar + 1);
            }

            getItem();
        }, []);


        return (
            <span className={'AdvancedDescriptionItemDisplay'} key={keyvar}>
                {component !== null &&
                    <RulesOverlay
                        titlename={component.Name}
                        d_method={() =>
                        <ModelDisplay data={component} />
                    }/>
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