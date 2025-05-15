import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { returnDescription } from '../../../../utility/util'
import SkillDisplay from './SkillDisplay';
import { Patron } from '../../../../classes/feature/skillgroup/Patron';
import RulesCollapsibleContent from "../../rules-content/RulesCollapsibleContent";

const PatronDisplay = (props: any) => {
    const patronObject : Patron = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='PatronDisplay'>
                <div className='PatronDisplay-description'>
                    {returnDescription(patronObject, patronObject.GetDescription())}
                </div>

                <div className={'rules-card'}>
                    <div className={'rules-card-title'}>
                        {patronObject.GetName()}
                    </div>

                    <div className={'rules-card-content'}>
                        <i>
                            {'Available to: '}
                            {patronObject.Factions.map((item) => (
                                <span key={item.Name} className="bodytext complextext small-side-margin">
                                    {
                                        ((patronObject.Factions.indexOf(item) != 0)? ", " : "") +  item.Name + ""
                                    }
                                </span>
                            ))}
                        </i>

                    </div>

                    <div>

                    {patronObject.Skills.map((item) => (
                        <RulesCollapsibleContent key={item.ID}
                             headline={item.Name}
                             content={
                                 <SkillDisplay data={item} />
                             }
                        />
                    ))}
                    </div>
                </div>


            </div>
        </ErrorBoundary>
    )
}

export default PatronDisplay;