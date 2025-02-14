import 'bootstrap/dist/css/bootstrap.css'
import '../../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import { Model } from '../../../../classes/feature/model/Model';
import GenericDisplay from '../../generics/GenericDisplay';
import AbilityDisplay from '../ability/AbilityDisplay';
import GenericHover from '../../generics/GenericHover';
import KeywordDisplay from '../glossary/KeywordDisplay';
import ItemStat from '../../subcomponents/description/ItemStat';
import { ModelStatistics } from '../../../../classes/feature/model/ModelStats';
import { getBaseSize, getMoveType, getPotential } from '../../../../utility/functions';

const ModelDisplay = (props: any) => {
    const modelcollectionObject: Model = props.data



    function ReturnStats(statlist : ModelStatistics) {
        return (
            <div>
                <div className="verticalspacerbig"/>
                <div className="row row-cols-sm-7 row-cols-xs-4 justify-content-center">
                    {statlist.movement != undefined &&
                        <ItemStat title={"Movement"} value={(statlist.movement?.toString() || "") + "\""}/>
                    }
                    {statlist.movetype != undefined &&
                        <ItemStat title={"Move Type"} value={statlist.movetype? getMoveType(statlist.movetype) : "Infantry"}/>
                    }
                    {statlist.melee != undefined &&
                        <ItemStat title={"Melee"} value={(statlist.melee? (statlist.melee > 0? "+": "") : "") + (statlist.melee?.toString() || "")}/>
                    }
                    {statlist.ranged != undefined &&
                        <ItemStat title={"Ranged"} value={(statlist.ranged? (statlist.ranged > 0? "+": "") : "") + (statlist.ranged?.toString() || "")}/>
                    }
                    {statlist.armor != undefined &&
                        <ItemStat title={"Armor"} value={statlist.armor?.toString() || ""}/>
                    }
                    {statlist.potential != undefined &&
                        <ItemStat title={"Potential"} value={statlist.potential? getPotential(statlist.potential) : "Standard"}/>
                    }
                    {statlist.base != undefined &&
                        <ItemStat title={"Base"} value={statlist.base? getBaseSize(statlist.base) : "25mm"}/>
                    }
                </div>
                <div className="verticalspacerbig"/>
            </div>
        )
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ModelDisplay.tsx</div>}>
            <div className=''>
                <div className="row">
                    <span className="colordefault contentpacklabel complextext">
                        {modelcollectionObject.Name  /* Name */}
                    </span>
                </div>
                <div className="row">
                    {returnDescription(modelcollectionObject, modelcollectionObject.Lore) /* Lore */}
                </div>
                <div className="row">
                    {ReturnStats(modelcollectionObject.Stats)  /* Stats */}
                </div>
                <div className="row">
                {returnDescription(modelcollectionObject, modelcollectionObject.Description) /* Description */}
                </div>
                {modelcollectionObject.Abilities.length > 0 &&
                    <>
                        <div className='separator tagboxpad colordefault'></div>
                        <div className="verticalspacerbig"/>
                        <div className="row">
                            {modelcollectionObject.Abilities.map((item) => ( 
                                <div key={"model_ability_"+modelcollectionObject.ID+"_ability_id_"+item.ID}>
                                    <GenericDisplay  d_colour={modelcollectionObject.Team} d_name={item.Name} d_type={"sub"} d_method={() => <AbilityDisplay data={item} />}/>
                                    <div className="verticalspacerbig"/>
                                </div>
                            )) /* Abilities */}
                        </div>
                    </>
                }
                <div className='separator tagboxpad colordefault'></div>
                <div className="row">
                    <span>
                        {modelcollectionObject.KeyWord.map((item) => ( 
                            <span className='tagItem' key={"model_keyword_"+modelcollectionObject.ID+"_keyword_id_"+item.ID}>
                                <GenericHover  d_colour={modelcollectionObject.Team} titlename={item.Name} d_name={item.Name} d_type={""} d_method={() => <KeywordDisplay data={item} />}/>
                            </span>
                        )) /* Keywords */}
                    </span>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default ModelDisplay;